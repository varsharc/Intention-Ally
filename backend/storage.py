import json
import os
from datetime import datetime, timedelta
from typing import List, Dict
from .models import SearchResult, KeywordSearch, Keyword
from config import STORAGE_DIR, RESULTS_FILE, KEYWORDS_FILE, RETENTION_DAYS

class Storage:
    def __init__(self):
        os.makedirs(STORAGE_DIR, exist_ok=True)
        self.results_path = os.path.join(STORAGE_DIR, RESULTS_FILE)
        self.keywords_path = os.path.join(STORAGE_DIR, KEYWORDS_FILE)
        self._initialize_storage()

    def _initialize_storage(self):
        if not os.path.exists(self.results_path):
            self._save_results([])
        if not os.path.exists(self.keywords_path) or os.path.getsize(self.keywords_path) == 0:
            self._save_keywords([])

    def _save_results(self, results: List[Dict]):
        with open(self.results_path, 'w') as f:
            json.dump(results, f, default=str)

    def _save_keywords(self, keywords: List[Dict]):
        with open(self.keywords_path, 'w') as f:
            json.dump(keywords, f, default=str)

    def get_keywords(self) -> List[Keyword]:
        try:
            with open(self.keywords_path, 'r') as f:
                data = json.load(f)
                return [Keyword(
                    value=k.get("value", ""),
                    created_at=datetime.fromisoformat(k.get("created_at", datetime.now().isoformat())),
                    is_active=k.get("is_active", True)
                ) for k in data]
        except json.JSONDecodeError:
            return []

    def add_keyword(self, keyword: str) -> bool:
        keywords = self.get_keywords()
        if len(keywords) >= 10:
            return False
        
        new_keyword = Keyword(
            value=keyword,
            created_at=datetime.now(),
            is_active=True
        )
        keywords_dict = [k.dict() for k in keywords]
        keywords_dict.append(new_keyword.dict())
        self._save_keywords(keywords_dict)
        return True

    def remove_keyword(self, keyword: str):
        keywords = self.get_keywords()
        keywords = [k for k in keywords if k.value != keyword]
        self._save_keywords([k.dict() for k in keywords])

    def save_search_results(self, keyword_search: KeywordSearch):
        results = self._load_results()
        results.append(keyword_search.dict())
        self._save_results(results)
        self._cleanup_old_results()

    def get_search_results(self, days: int = 7) -> List[KeywordSearch]:
        results = self._load_results()
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_results = [
            r for r in results 
            if datetime.fromisoformat(r['timestamp']) > cutoff_date
        ]
        return [KeywordSearch(**r) for r in recent_results]

    def _load_results(self) -> List[Dict]:
        with open(self.results_path, 'r') as f:
            return json.load(f)

    def _cleanup_old_results(self):
        results = self._load_results()
        cutoff_date = datetime.now() - timedelta(days=RETENTION_DAYS)
        filtered_results = [
            r for r in results 
            if datetime.fromisoformat(r['timestamp']) > cutoff_date
        ]
        self._save_results(filtered_results)
