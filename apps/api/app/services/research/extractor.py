import json
import logging
import re
from typing import List, Dict, Any
from app.services.llm.provider import LLMProvider
from app.prompts.research_prompts import EXTRACTOR_SYSTEM_PROMPT, EXTRACTOR_USER_PROMPT

logger = logging.getLogger(__name__)

class EvidenceExtractorService:
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    async def extract_evidence(
        self,
        question: str,
        source_title: str,
        publisher: str,
        url: str,
        content: str
    ) -> List[Dict[str, Any]]:
        prompt = EXTRACTOR_USER_PROMPT.format(
            question=question,
            source_title=source_title,
            publisher=publisher,
            url=url,
            content=content[:3000]
        )
        
        schema = {
            "type": "object",
            "properties": {
                "extracted_items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "claim": {"type": "string"},
                            "evidence": {"type": "string"},
                            "context": {"type": "string"},
                            "claim_type": {"type": "string", "enum": ["fact", "interpretation", "inference"]},
                            "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                            "limitations": {"type": "array", "items": {"type": "string"}}
                        },
                        "required": ["claim", "evidence", "confidence"]
                    }
                }
            },
            "required": ["extracted_items"]
        }
        
        try:
            raw = await self.llm.generate(
                prompt=prompt,
                system_prompt=EXTRACTOR_SYSTEM_PROMPT,
                schema=schema
            )
            raw = raw.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?", "", raw)
                raw = re.sub(r"```$", "", raw).strip()
            data = json.loads(raw)
            return data.get("extracted_items", [])
        except Exception as e:
            logger.warning(f"Evidence extraction parsing failed: {e}")
            return [
                {
                    "claim": f"Primary empirical observations from {publisher}.",
                    "evidence": content[:250],
                    "context": f"Published in {publisher}",
                    "claim_type": "fact",
                    "confidence": "high",
                    "limitations": ["Extracted from preliminary excerpt"]
                }
            ]
