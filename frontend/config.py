
import os
from pathlib import Path

# Backend API configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://0.0.0.0:8000")

# Import MAX_KEYWORDS directly from the root config
# Access configuration directly from root config
MAX_KEYWORDS = 10  # Setting this directly instead of importing

# API endpoints
def get_api_url(endpoint: str) -> str:
    """Construct full API URL for given endpoint"""
    return f"{BACKEND_URL}/{endpoint.lstrip('/')}"
