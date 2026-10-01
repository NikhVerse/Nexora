import asyncio
import json
import logging
from typing import AsyncGenerator, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import ResearchSession, ResearchTask, Source, Evidence, Finding, Report
from app.services.llm import get_llm_provider
from app.services.search import get_search_provider
from app.services.research.planner import ResearchPlannerService
from app.services.research.researcher import ResearchExecutionService
from app.services.research.extractor import EvidenceExtractorService
from app.services.research.verifier import EvidenceVerifierService
from app.services.research.contradiction import ContradictionDetectionService
from app.services.research.synthesizer import SynthesizerService

logger = logging.getLogger(__name__)

class ResearchOrchestrator:
    def __init__(self, db: AsyncSession, api_key: str = None):
        self.db = db
        self.llm = get_llm_provider(api_key=api_key)
        self.search = get_search_provider()
        
        self.planner_svc = ResearchPlannerService(self.llm)
        self.researcher_svc = ResearchExecutionService(self.search)
        self.extractor_svc = EvidenceExtractorService(self.llm)
        self.verifier_svc = EvidenceVerifierService(self.llm)
        self.contradiction_svc = ContradictionDetectionService(self.llm)
        self.synthesizer_svc = SynthesizerService(self.llm)

    async def create_session_and_plan(self, question: str, depth: str = "standard") -> ResearchSession:
        title = question[:100] + ("..." if len(question) > 100 else "")
        session = ResearchSession(
            title=title,
            question=question,
            depth=depth,
            status="planning",
            current_stage="planning"
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)

        # Generate structured plan
        plan = await self.planner_svc.generate_plan(question, depth=depth)
        session.objective = plan.get("objective", "")
        session.strategy = plan.get("strategy", "")
        session.dimensions = plan.get("dimensions", [])
        session.evidence_requirements = []
        session.status = "ready"
        session.current_stage = "planning"

        # Create tasks
        for q_data in plan.get("questions", []):
            task = ResearchTask(
                session_id=session.id,
                question=q_data["question"],
                priority=q_data.get("priority", "medium"),
                status="pending",
                evidence_requirements=q_data.get("evidence_requirements", [])
            )
            self.db.add(task)

        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def execute_research_pipeline(self, session_id: str) -> AsyncGenerator[str, None]:
        """
        Executes pipeline: Discovery -> Extraction -> Verification -> Contradictions -> Synthesis.
        Yields SSE formatted string events.
        """
        # Helper to format SSE
        def sse(event_type: str, stage: str, message: str, data: Any = None) -> str:
            payload = json.dumps({
                "type": event_type,
                "stage": stage,
                "message": message,
                "data": data or {}
            })
            return f"data: {payload}\n\n"

        result = await self.db.execute(select(ResearchSession).where(ResearchSession.id == session_id))
        session = result.scalar_one_or_none()
        if not session:
            yield sse("error", "error", "Research session not found")
            return

        session.status = "researching"
        await self.db.commit()

        try:
            # Load tasks
            tasks_res = await self.db.execute(select(ResearchTask).where(ResearchTask.session_id == session_id))
            tasks = tasks_res.scalars().all()

            # --- STAGE 1: Evidence Discovery (Search & Sources) ---
            session.current_stage = "tasks"
            await self.db.commit()
            yield sse("stage_started", "tasks", "Executing research tasks and gathering sources...")
            
            all_sources = []
            for task in tasks:
                task.status = "active"
                await self.db.commit()
                yield sse("progress", "tasks", f"Searching literature for: '{task.question[:60]}...'")
                
                search_results = await self.researcher_svc.collect_sources_for_task(task.question, session.depth)
                for res in search_results:
                    # Check if source already saved for this session
                    existing = await self.db.execute(
                        select(Source).where(Source.session_id == session_id, Source.url == res.url)
                    )
                    src_record = existing.scalar_one_or_none()
                    if not src_record:
                        src_record = Source(
                            session_id=session_id,
                            task_id=task.id,
                            title=res.title,
                            url=res.url,
                            publisher=res.publisher,
                            published_at=res.published_at,
                            snippet=res.snippet,
                            source_type=res.source_type,
                            verification_status="unverified",
                            raw_content=res.snippet
                        )
                        self.db.add(src_record)
                        await self.db.commit()
                        await self.db.refresh(src_record)
                    all_sources.append(src_record)

                task.status = "completed"
                await self.db.commit()
                await asyncio.sleep(0.1)

            yield sse("progress", "tasks", f"Identified {len(all_sources)} relevant sources across research questions.")
            yield sse("stage_completed", "tasks", "Source collection completed.")

            # --- STAGE 2: Evidence Extraction ---
            session.current_stage = "evidence"
            await self.db.commit()
            yield sse("stage_started", "evidence", "Extracting empirical claims and evidence items from sources...")

            all_evidence = []
            for src in all_sources:
                yield sse("progress", "evidence", f"Analyzing source: {src.publisher} ({src.title[:50]}...)")
                extracted = await self.extractor_svc.extract_evidence(
                    question=session.question,
                    source_title=src.title,
                    publisher=src.publisher,
                    url=src.url,
                    content=src.snippet or ""
                )
                
                for item in extracted:
                    ev = Evidence(
                        session_id=session_id,
                        source_id=src.id,
                        task_id=src.task_id,
                        claim=item.get("claim", ""),
                        evidence=item.get("evidence", ""),
                        context=item.get("context", ""),
                        claim_type=item.get("claim_type", "fact"),
                        confidence=item.get("confidence", "high"),
                        limitations=item.get("limitations", []),
                        verification_status="unverified"
                    )
                    self.db.add(ev)
                    await self.db.commit()
                    await self.db.refresh(ev)
                    all_evidence.append(ev)

                await asyncio.sleep(0.1)

            yield sse("progress", "evidence", f"Extracted {len(all_evidence)} structured evidence items.")
            yield sse("stage_completed", "evidence", "Evidence extraction completed.")

            # --- STAGE 3: Verification ---
            session.current_stage = "verification"
            await self.db.commit()
            yield sse("stage_started", "verification", "Verifying evidence accuracy, context bounds, and limitations...")

            for ev in all_evidence:
                # Find source
                src = next((s for s in all_sources if s.id == ev.source_id), None)
                v_res = await self.verifier_svc.verify_evidence(
                    claim=ev.claim,
                    evidence=ev.evidence,
                    context=ev.context or "",
                    source_title=src.title if src else "",
                    publisher=src.publisher if src else ""
                )
                ev.verification_status = v_res.get("verification_status", "verified")
                ev.verification_notes = v_res.get("notes", "")
                if src and ev.verification_status == "verified":
                    src.verification_status = "verified"
                await self.db.commit()

            yield sse("progress", "verification", f"Cross-verified {len(all_evidence)} evidence points against sources.")
            yield sse("stage_completed", "verification", "Verification completed.")

            # --- STAGE 4: Contradiction Detection ---
            yield sse("stage_started", "contradiction", "Detecting nuanced contradictions, conflicting findings, and trade-offs...")
            ev_dicts = [
                {"id": e.id, "claim": e.claim, "evidence": e.evidence, "context": e.context, "source_id": e.source_id}
                for e in all_evidence
            ]
            contradictions = await self.contradiction_svc.detect_contradictions(session.question, ev_dicts)

            # Store findings
            for c in contradictions:
                finding = Finding(
                    session_id=session_id,
                    dimension=c.get("topic", "General"),
                    finding=f"{c.get('finding_a')} vs {c.get('finding_b')}",
                    confidence="medium",
                    contradiction_notes=f"{c.get('explanation')} Conclusion: {c.get('conclusion')}"
                )
                self.db.add(finding)
            await self.db.commit()

            yield sse("progress", "contradiction", f"Analyzed {len(contradictions)} substantive contradiction points.")
            yield sse("stage_completed", "contradiction", "Contradiction detection completed.")

            # --- STAGE 5: Synthesis & Citation Binding ---
            session.current_stage = "synthesis"
            await self.db.commit()
            yield sse("stage_started", "synthesis", "Synthesizing findings into a cited, transparent report...")

            src_dicts = [
                {"id": s.id, "title": s.title, "publisher": s.publisher, "url": s.url, "published_at": s.published_at, "snippet": s.snippet}
                for s in all_sources
            ]
            
            synth_res = await self.synthesizer_svc.synthesize(
                question=session.question,
                objective=session.objective or "",
                sources=src_dicts,
                evidence_items=[{"claim": e.claim, "evidence": e.evidence, "source_id": e.source_id, "confidence": e.confidence} for e in all_evidence],
                contradictions=contradictions
            )

            # Persist Report
            report = Report(
                session_id=session_id,
                title=synth_res.get("title", f"Research Report: {session.question}"),
                executive_summary=synth_res.get("executive_summary", ""),
                key_findings=synth_res.get("key_findings", []),
                detailed_analysis=synth_res.get("detailed_analysis", []),
                conflicting_evidence=synth_res.get("conflicting_evidence", []),
                limitations=synth_res.get("limitations", []),
                conclusion=synth_res.get("conclusion", ""),
                citations=synth_res.get("citations", [])
            )
            self.db.add(report)
            session.status = "completed"
            session.current_stage = "report"
            await self.db.commit()

            yield sse("stage_completed", "synthesis", "Report synthesis complete with verified citations.")
            yield sse("complete", "report", "Research process completed successfully.", {"report_id": report.id})

        except Exception as e:
            logger.error(f"Research pipeline failed: {e}", exc_info=True)
            session.status = "failed"
            await self.db.commit()
            yield sse("error", "error", f"Research encountered an error: {str(e)}")
