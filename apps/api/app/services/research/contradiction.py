import json
import logging
import re
from typing import List, Dict, Any
from app.services.llm.provider import LLMProvider
from app.prompts.research_prompts import CONTRADICTION_SYSTEM_PROMPT, CONTRADICTION_USER_PROMPT

logger = logging.getLogger(__name__)

class ContradictionDetectionService:
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    async def detect_contradictions(
        self,
        question: str,
        evidence_items: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        # Format evidence items summary
        summary_lines = []
        for idx, item in enumerate(evidence_items[:15]):
            claim = item.get("claim", "")
            evidence = item.get("evidence", "")
            ctx = item.get("context", "")
            summary_lines.append(f"[{idx+1}] CLAIM: {claim} | EVIDENCE: {evidence} | CONTEXT: {ctx}")
            
        evidence_summary = "\n".join(summary_lines)
        
        prompt = CONTRADICTION_USER_PROMPT.format(
            question=question,
            evidence_summary=evidence_summary
        )
        
        schema = {
            "type": "object",
            "properties": {
                "contradictions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string"},
                            "finding_a": {"type": "string"},
                            "finding_b": {"type": "string"},
                            "explanation": {"type": "string"},
                            "conclusion": {"type": "string"}
                        },
                        "required": ["topic", "finding_a", "finding_b", "explanation", "conclusion"]
                    }
                }
            },
            "required": ["contradictions"]
        }
        
        try:
            raw = await self.llm.generate(
                prompt=prompt,
                system_prompt=CONTRADICTION_SYSTEM_PROMPT,
                schema=schema
            )
            raw = raw.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?", "", raw)
                raw = re.sub(r"```$", "", raw).strip()
            data = json.loads(raw)
            return data.get("contradictions", [])
        except Exception as e:
            logger.warning(f"Contradiction detection failed: {e}")
            return []
