from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: str = "You are an expert research synthesis agent.",
        schema: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generate response from LLM given prompt and optional schema."""
        pass
