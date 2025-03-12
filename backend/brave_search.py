import aiohttp
import asyncio
from datetime import datetime
from typing import List
import logging
from .models import SearchResult
from config import BRAVE_API_KEY, BRAVE_SEARCH_URL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def search_brave(keyword: str, retry_count: int = 3) -> List[SearchResult]:
    """
    Perform a search using the Brave Search API with retry logic
    """
    if not BRAVE_API_KEY:
        logger.error("Brave API key not configured")
        raise ValueError("Brave API key not configured")

    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
    }

    params = {
        "q": keyword,
        "count": 10
    }

    for attempt in range(retry_count):
        if attempt > 0:
            # Wait 2 seconds between retries, doubled for each subsequent retry
            wait_time = 2 * (2 ** attempt)
            logger.info(f"Waiting {wait_time} seconds before retry {attempt + 1}")
            await asyncio.sleep(wait_time)

        logger.info(f"Making Brave Search API request for keyword: {keyword} (attempt {attempt + 1})")
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(BRAVE_SEARCH_URL, headers=headers, params=params) as response:
                    if response.status == 429 and attempt < retry_count - 1:
                        error_text = await response.text()
                        logger.warning(f"Rate limited, will retry: {error_text}")
                        continue

                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Brave Search API error: Status {response.status}, Response: {error_text}")
                        raise Exception(f"Brave Search API error: {response.status}")

                    data = await response.json()
                    logger.info(f"Received response from Brave Search API for {keyword}")

                    results = []
                    web_results = data.get("web", {}).get("results", [])
                    logger.info(f"Found {len(web_results)} results for keyword: {keyword}")

                    for web_result in web_results:
                        result = SearchResult(
                            title=web_result["title"],
                            url=web_result["url"],
                            description=web_result["description"],
                            date=datetime.now()
                        )
                        results.append(result)

                    return results
            except Exception as e:
                if attempt < retry_count - 1:
                    logger.warning(f"Error on attempt {attempt + 1}, will retry: {str(e)}")
                    continue
                logger.error(f"Failed to fetch search results for {keyword}: {str(e)}")
                raise Exception(f"Failed to fetch search results: {str(e)}")

    raise Exception("Max retries exceeded")