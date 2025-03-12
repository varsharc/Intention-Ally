import aiohttp
import asyncio
from datetime import datetime
from typing import List
from .models import SearchResult
from config import BRAVE_API_KEY, BRAVE_SEARCH_URL

async def search_brave(keyword: str) -> List[SearchResult]:
    """
    Perform a search using the Brave Search API
    """
    if not BRAVE_API_KEY:
        raise ValueError("Brave API key not configured")

    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
    }
    
    params = {
        "q": keyword,
        "count": 10
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(BRAVE_SEARCH_URL, headers=headers, params=params) as response:
                if response.status != 200:
                    raise Exception(f"Brave Search API error: {response.status}")
                
                data = await response.json()
                results = []
                
                for web_result in data.get("web", {}).get("results", []):
                    result = SearchResult(
                        title=web_result["title"],
                        url=web_result["url"],
                        description=web_result["description"],
                        date=datetime.now()
                    )
                    results.append(result)
                
                return results
        except Exception as e:
            raise Exception(f"Failed to fetch search results: {str(e)}")
