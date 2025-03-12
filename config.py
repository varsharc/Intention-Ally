import os

# API Configuration
BRAVE_API_KEY = os.getenv("BRAVE_API_KEY", "")
BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"

# Backend Configuration
BACKEND_HOST = "0.0.0.0"
BACKEND_PORT = 8000

# Storage Configuration
STORAGE_DIR = "data"
RESULTS_FILE = "search_results.json"
KEYWORDS_FILE = "keywords.json"

# Search Configuration
MAX_KEYWORDS = 10
RESULTS_PER_SEARCH = 10
RETENTION_DAYS = 30
