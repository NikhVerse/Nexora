import json
import logging
from typing import Optional, Dict, Any
import httpx
from app.services.llm.provider import LLMProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class OpenAILLMProvider(LLMProvider):
    _rate_limited: bool = False

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.base_url = (base_url or settings.OPENAI_BASE_URL).rstrip("/")
        self.model = model or settings.OPENAI_MODEL

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "You are an expert research synthesis agent.",
        schema: Optional[Dict[str, Any]] = None
    ) -> str:
        if OpenAILLMProvider._rate_limited:
            from app.services.llm.fallback import SmartFallbackLLMProvider
            return await SmartFallbackLLMProvider().generate(
                prompt=prompt,
                system_prompt=system_prompt,
                schema=schema
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2
        }
        
        if schema:
            payload["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": "research_schema",
                    "strict": True,
                    "schema": schema
                }
            }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower() or "rate" in str(e).lower():
                    OpenAILLMProvider._rate_limited = True
                logger.warning(f"OpenAI API call failed ({e}). Gracefully falling back to SmartFallbackLLMProvider...")
                from app.services.llm.fallback import SmartFallbackLLMProvider
                fallback = SmartFallbackLLMProvider()
                return await fallback.generate(
                    prompt=prompt,
                    system_prompt=system_prompt,
                    schema=schema
                )
