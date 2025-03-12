from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import SearchResponse, Keyword
from .storage import Storage
from .scheduler import SearchScheduler
from .brave_search import search_brave
from config import BACKEND_HOST, BACKEND_PORT
import uvicorn

app = FastAPI(title="Intentionly API")
storage = Storage()
scheduler = SearchScheduler(storage)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()

@app.get("/keywords")
async def get_keywords():
    return storage.get_keywords()

@app.post("/keywords")
async def add_keyword(keyword: str):
    if storage.add_keyword(keyword):
        return {"message": "Keyword added successfully"}
    raise HTTPException(status_code=400, message="Maximum keywords limit reached")

@app.delete("/keywords/{keyword}")
async def remove_keyword(keyword: str):
    storage.remove_keyword(keyword)
    return {"message": "Keyword removed successfully"}

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
        return SearchResponse(
            success=False,
            message=str(e)
        )

@app.get("/results")
async def get_results(days: int = 7):
    return storage.get_search_results(days)

def start():
    uvicorn.run(app, host=BACKEND_HOST, port=BACKEND_PORT)

if __name__ == "__main__":
    start()
