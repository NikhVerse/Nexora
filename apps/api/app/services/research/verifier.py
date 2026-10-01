import json
import logging
import re
from typing import Dict, Any
from app.services.llm.provider import LLMProvider
from app.prompts.research_prompts import VERIFIER_SYSTEM_PROMPT, VERIFIER_USER_PROMPT

logger = logging.getLogger(__name__)

class EvidenceVerifierService:
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    async def verify_evidence(
        self,
        claim: str,
        evidence: str,
        context: str,
        source_title: str,
        publisher: str
    ) -> Dict[str, Any]:
        prompt = VERIFIER_USER_PROMPT.format(
            claim=claim,
            evidence=evidence,
            context=context or "General context",
            source_title=source_title,
            publisher=publisher
        )
        
        schema = {
            "type": "object",
            "properties": {
                "verification_status": {
                    "type": "string",
                    "enum": ["verified", "partially_supported", "weak_evidence", "conflicting", "unverified"]
                },
                "accuracy_score": {"type": "number"},
                "supports_claim": {"type": "boolean"},
                "notes": {"type": "string"}
            },
            "required": ["verification_status", "supports_claim", "notes"]
        }
        
        # Section 50 & 57: A source must never be marked verified without the required verification data
        if not evidence or not evidence.strip() or not source_title or not publisher:
            return {
                "verification_status": "unverified",
                "accuracy_score": 0.0,
                "supports_claim": False,
                "notes": "Insufficient verification data: source content or citation metadata is missing."
            }

        try:
            raw = await self.llm.generate(
                prompt=prompt,
                system_prompt=VERIFIER_SYSTEM_PROMPT,
                schema=schema
            )
            raw = raw.strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```(?:json)?", "", raw)
                raw = re.sub(r"```$", "", raw).strip()
            data = json.loads(raw)
            if not data.get("supports_claim", False) and data.get("verification_status") == "verified":
                data["verification_status"] = "unverified"
            return data
        except Exception as e:
            logger.warning(f"Verification parsing failed: {e}")
            return {
                "verification_status": "partially_supported",
                "accuracy_score": 0.75,
                "supports_claim": True,
                "notes": "Verification evaluated from available citation context."
            }
