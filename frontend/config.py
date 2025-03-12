import os
import sys
from pathlib import Path

# Add root directory to Python path to import root config
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))
from config import MAX_KEYWORDS

# Backend API configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://0.0.0.0:8000")

# API endpoints
def get_api_url(endpoint: str) -> str:
    """Construct full API URL for given endpoint"""
    return f"{BACKEND_URL}/{endpoint.lstrip('/')}"