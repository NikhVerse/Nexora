from typing import Optional
from app.services.llm.provider import LLMProvider
from app.services.llm.openai import OpenAILLMProvider
from app.services.llm.fallback import SmartFallbackLLMProvider
from app.core.config import settings

def get_llm_provider(api_key: Optional[str] = None) -> LLMProvider:
    key = api_key or settings.OPENAI_API_KEY
    if key and key.strip() and not key.startswith("your_"):
        return OpenAILLMProvider(api_key=key)
    return SmartFallbackLLMProvider()
