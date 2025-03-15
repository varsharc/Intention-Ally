import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import SearchResponse, Keyword, KeywordSearch, SearchResult
from .storage import Storage
from .scheduler import SearchScheduler
from .brave_search import search_brave
from config import BACKEND_HOST, BACKEND_PORT
import uvicorn
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Intentionly API")
storage = Storage()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

try:
    # Initialize scheduler after storage
    scheduler = SearchScheduler(storage)
    logger.info("Scheduler initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize scheduler: {str(e)}")
    scheduler = None  # Allow API to start even if scheduler fails

@app.on_event("startup")
async def startup_event():
    try:
        if scheduler:
            scheduler.start()
            logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    try:
        if scheduler:
            scheduler.shutdown()
            logger.info("Scheduler shutdown successfully")
    except Exception as e:
        logger.error(f"Failed to shutdown scheduler: {str(e)}")

@app.get("/keywords")
async def get_keywords():
    try:
        return storage.get_keywords()
    except Exception as e:
        logger.error(f"Error getting keywords: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/keywords")
async def add_keyword(keyword: str):
    try:
        if not keyword or keyword.strip() == "":
            raise HTTPException(status_code=400, detail="Keyword cannot be empty")

        if storage.add_keyword(keyword):
            return {"message": "Keyword added successfully"}
        raise HTTPException(status_code=400, detail="Maximum keywords limit reached")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding keyword: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/keywords/{keyword}")
async def remove_keyword(keyword: str):
    try:
        storage.remove_keyword(keyword)
        return {"message": "Keyword removed successfully"}
    except Exception as e:
        logger.error(f"Error removing keyword: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search/{keyword}")
async def search(keyword: str) -> SearchResponse:
    try:
        results = await search_brave(keyword)
        return SearchResponse(
            success=True,
            message="Search completed successfully",
            results=results
        )
    except Exception as e:
        logger.error(f"Error performing search: {str(e)}")
        return SearchResponse(
            success=False,
            message=str(e)
        )

@app.get("/results")
async def get_results(days: int = 7):
    try:
        return storage.get_search_results(days)
    except Exception as e:
        logger.error(f"Error getting search results: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-search")
async def run_manual_search():
    """Manually trigger a search for all keywords"""
    try:
        keywords = storage.get_keywords()
        results = []

        if not keywords:
            return {"message": "No keywords found to search"}

        for keyword in keywords:
            if keyword.is_active:
                try:
                    # Add a small delay between searches
                    await asyncio.sleep(1)
                    logger.info(f"Searching for keyword: {keyword.value}")
                    search_results = await search_brave(keyword.value)

                    search = KeywordSearch(
                        keyword=keyword.value,
                        results=search_results,
                        timestamp=datetime.now()
                    )
                    storage.save_search_results(search)
                    results.append({
                        "keyword": keyword.value,
                        "count": len(search_results)
                    })
                    logger.info(f"Successfully saved results for keyword: {keyword.value}")
                except Exception as e:
                    logger.error(f"Error searching for keyword {keyword.value}: {str(e)}")
                    results.append({
                        "keyword": keyword.value,
                        "error": str(e)
                    })

        return {"message": "Manual search completed", "results": results}
    except Exception as e:
        logger.error(f"Error in manual search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def start():
    """Start the FastAPI server"""
    try:
        logger.info(f"Starting server on {BACKEND_HOST}:{BACKEND_PORT}")
        uvicorn.run(
            app,
            host=BACKEND_HOST,
            port=BACKEND_PORT,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise

if __name__ == "__main__":
    start()