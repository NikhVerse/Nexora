from typing import Optional
from app.services.search.provider import SearchProvider
from app.services.search.hybrid import HybridSearchProvider
from app.core.config import settings

def get_search_provider(tavily_api_key: Optional[str] = None) -> SearchProvider:
    return HybridSearchProvider(tavily_api_key=tavily_api_key or settings.TAVILY_API_KEY)
