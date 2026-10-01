import json
import logging
import re
from typing import Dict, Any, Optional
from app.services.llm.provider import LLMProvider
from app.prompts.research_prompts import PLANNER_SYSTEM_PROMPT, PLANNER_USER_PROMPT

logger = logging.getLogger(__name__)

class ResearchPlannerService:
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    async def generate_plan(self, question: str, depth: str = "standard") -> Dict[str, Any]:
        prompt = PLANNER_USER_PROMPT.format(question=question, depth=depth)
        
        # Schema definition for structured output
        schema = {
            "type": "object",
            "properties": {
                "objective": {"type": "string"},
                "strategy": {"type": "string"},
                "dimensions": {"type": "array", "items": {"type": "string"}},
                "questions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "question": {"type": "string"},
                            "priority": {"type": "string", "enum": ["high", "medium", "low"]},
                            "evidence_requirements": {"type": "array", "items": {"type": "string"}}
                        },
                        "required": ["id", "question", "priority", "evidence_requirements"]
                    }
                }
            },
            "required": ["objective", "strategy", "dimensions", "questions"]
        }
        
        # Retry with repair if needed
        for attempt in range(2):
            try:
                raw_response = await self.llm.generate(
                    prompt=prompt,
                    system_prompt=PLANNER_SYSTEM_PROMPT,
                    schema=schema
                )
                
                parsed = self._clean_and_parse_json(raw_response)
                if self._validate_plan(parsed):
                    return parsed
            except Exception as e:
                logger.warning(f"Plan generation attempt {attempt + 1} failed: {e}")
                
        # Fallback safe plan if LLM failed
        return {
            "objective": f"Analyze and evaluate key empirical evidence concerning: {question}",
            "strategy": "Systematically review academic publications, technical benchmarks, and verified field reports.",
            "dimensions": ["Empirical Metrics", "Operational Impact", "Contradictions & Constraints"],
            "questions": [
                {
                    "id": "q1",
                    "question": f"What quantitative baseline data and metrics exist regarding: {question}?",
                    "priority": "high",
                    "evidence_requirements": ["Empirical measurements", "Peer-reviewed studies"]
                },
                {
                    "id": "q2",
                    "question": f"What conflicting findings or operational limitations have been documented?",
                    "priority": "high",
                    "evidence_requirements": ["Contradictory data", "Methodology variance"]
                },
                {
                    "id": "q3",
                    "question": f"What are the verified long-term implications and conclusions?",
                    "priority": "medium",
                    "evidence_requirements": ["Longitudinal outcomes", "Expert assessments"]
                }
            ]
        }

    def _clean_and_parse_json(self, text: str) -> Dict[str, Any]:
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?", "", text)
            text = re.sub(r"```$", "", text).strip()
        return json.loads(text)

    def _validate_plan(self, data: Dict[str, Any]) -> bool:
        return (
            isinstance(data, dict)
            and "objective" in data
            and "questions" in data
            and len(data["questions"]) >= 1
        )
