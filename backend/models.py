from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SearchResult(BaseModel):
    title: str
    url: str
    description: str
    date: datetime

class KeywordSearch(BaseModel):
    keyword: str
    results: List[SearchResult]
    timestamp: datetime

class Keyword(BaseModel):
    value: str
    created_at: datetime
    is_active: bool = True

class SearchResponse(BaseModel):
    success: bool
    message: str
    results: Optional[List[SearchResult]] = None
