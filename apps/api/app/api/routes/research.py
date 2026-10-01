import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models import ResearchSession, ResearchTask, Source, Evidence, Finding, Report
from app.schemas import (
    ResearchCreate,
    ResearchSessionResponse,
    ResearchPlanUpdate,
    SourceResponse,
    EvidenceResponse,
    FindingResponse,
    ReportResponse
)
from app.services.research.orchestrator import ResearchOrchestrator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/research", tags=["research"])

@router.post("", response_model=ResearchSessionResponse, status_code=status.HTTP_200_OK)
async def create_research_session(
    payload: ResearchCreate,
    x_api_key: Optional[str] = Header(None, alias="X-OpenAI-Key"),
    db: AsyncSession = Depends(get_db)
):
    """Create a new research inquiry and generate the preliminary plan."""
    orchestrator = ResearchOrchestrator(db, api_key=x_api_key)
    session = await orchestrator.create_session_and_plan(
        question=payload.question,
        depth=payload.depth
    )
    return session

@router.get("", response_model=List[ResearchSessionResponse])
async def list_research_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """List historical research sessions with optional search query."""
    query = select(ResearchSession).order_by(ResearchSession.created_at.desc())
    if search:
        query = query.where(ResearchSession.question.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=ResearchSessionResponse)
async def get_research_session(id: str, db: AsyncSession = Depends(get_db)):
    """Fetch complete research session with tasks and report."""
    result = await db.execute(
        select(ResearchSession)
        .where(ResearchSession.id == id)
        .options(
            selectinload(ResearchSession.tasks),
            selectinload(ResearchSession.report)
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
    return session

@router.patch("/{id}/plan", response_model=ResearchSessionResponse)
@router.put("/{id}/plan", response_model=ResearchSessionResponse)
@router.post("/{id}/plan", response_model=ResearchSessionResponse)
async def update_research_plan(
    id: str,
    payload: ResearchPlanUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Allows user to edit, reorder, add, or delete sub-questions in the research plan."""
    result = await db.execute(select(ResearchSession).where(ResearchSession.id == id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
        
    if payload.objective is not None:
        session.objective = payload.objective
    if payload.strategy is not None:
        session.strategy = payload.strategy
    if payload.dimensions is not None:
        session.dimensions = payload.dimensions

    # Replace tasks with updated list
    await db.execute(delete(ResearchTask).where(ResearchTask.session_id == id))
    for q_data in payload.questions:
        task = ResearchTask(
            session_id=id,
            question=q_data.question,
            priority=q_data.priority,
            status="pending",
            evidence_requirements=q_data.evidence_requirements
        )
        db.add(task)
        
    await db.commit()
    await db.refresh(session)
    return session

@router.post("/{id}/start")
async def start_research_execution(id: str, db: AsyncSession = Depends(get_db)):
    """Acknowledge approval and start research stage."""
    result = await db.execute(select(ResearchSession).where(ResearchSession.id == id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
    session.status = "researching"
    session.current_stage = "tasks"
    await db.commit()
    return {"status": "started", "session_id": id}

@router.get("/{id}/stream")
async def stream_research_progress(
    id: str,
    x_api_key: Optional[str] = Header(None, alias="X-OpenAI-Key"),
    db: AsyncSession = Depends(get_db)
):
    """Server-Sent Events (SSE) streaming endpoint for live research pipeline progress."""
    orchestrator = ResearchOrchestrator(db, api_key=x_api_key)
    
    return StreamingResponse(
        orchestrator.execute_research_pipeline(id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/{id}/sources", response_model=List[SourceResponse])
async def get_session_sources(id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve collected and normalized sources for a research session."""
    result = await db.execute(
        select(Source).where(Source.session_id == id).order_by(Source.created_at.asc())
    )
    return result.scalars().all()

@router.get("/{id}/evidence", response_model=List[EvidenceResponse])
async def get_session_evidence(
    id: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve extracted evidence items with optional verification status filter."""
    query = select(Evidence).where(Evidence.session_id == id).options(selectinload(Evidence.source))
    if status_filter and status_filter != "all":
        query = query.where(Evidence.verification_status == status_filter)
    result = await db.execute(query.order_by(Evidence.created_at.asc()))
    return result.scalars().all()

@router.get("/{id}/report", response_model=ReportResponse)
async def get_session_report(id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve the synthesized final research report with bound citations."""
    result = await db.execute(select(Report).where(Report.session_id == id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not generated yet for this session")
    return report

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_research_session(id: str, db: AsyncSession = Depends(get_db)):
    """Delete a research session and all associated tasks, sources, and reports."""
    result = await db.execute(select(ResearchSession).where(ResearchSession.id == id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
    await db.delete(session)
    await db.commit()
    return None
