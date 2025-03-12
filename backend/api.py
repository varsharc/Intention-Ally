from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import SearchResponse, Keyword
from .storage import Storage
from .scheduler import SearchScheduler
from .brave_search import search_brave
from config import BACKEND_HOST, BACKEND_PORT
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Intentionly API")
storage = Storage()

# Initialize scheduler after storage
try:
    scheduler = SearchScheduler(storage)
    logger.info("Scheduler initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize scheduler: {str(e)}")
    raise

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        scheduler.start()
        logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    try:
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

def start():
    try:
        logger.info(f"Starting server on {BACKEND_HOST}:{BACKEND_PORT}")
        uvicorn.run(app, host=BACKEND_HOST, port=BACKEND_PORT)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise

if __name__ == "__main__":
    start()