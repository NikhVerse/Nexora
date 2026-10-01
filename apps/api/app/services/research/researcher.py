import logging
from typing import List, Dict, Any
from app.services.search.provider import SearchProvider, SearchResult

logger = logging.getLogger(__name__)

class ResearchExecutionService:
    def __init__(self, search_provider: SearchProvider):
        self.search_provider = search_provider

    async def collect_sources_for_task(self, question: str, depth: str = "standard") -> List[SearchResult]:
        limit = 3 if depth == "quick" else (5 if depth == "standard" else 7)
        results = await self.search_provider.search(question, limit=limit)
        return results
