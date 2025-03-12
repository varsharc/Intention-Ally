import os
from pathlib import Path

# Backend API configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://0.0.0.0:8002")  # Changed port to 8002

# Setting this directly instead of importing
MAX_KEYWORDS = 10  # Avoid circular import

# API endpoints
def get_api_url(endpoint: str) -> str:
    """Construct full API URL for given endpoint"""
    return f"{BACKEND_URL}/{endpoint.lstrip('/')}"