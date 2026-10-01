from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import httpx
import logging

logger = logging.getLogger(__name__)

class SearchResult(BaseModel):
    title: str
    url: str
    publisher: str
    published_at: str
    snippet: str
    source_type: str = "web"  # academic, government, technical_report, journalism, expert_analysis, web
    score: float = 1.0

class SearchProvider(ABC):
    @abstractmethod
    async def search(self, query: str, limit: int = 5) -> List[SearchResult]:
        """Perform search and return normalized results."""
        pass

    @abstractmethod
    async def fetch(self, url: str) -> str:
        """Fetch raw content from a URL."""
        pass

    @abstractmethod
    async def extract(self, content: str) -> str:
        """Extract clean text from content."""
        pass
