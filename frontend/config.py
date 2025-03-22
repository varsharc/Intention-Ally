import os
from pathlib import Path
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Backend API configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://0.0.0.0:8002")
logger.info(f"Backend URL configured as: {BACKEND_URL}")

# Import from root config to ensure consistency
try:
    from config import MAX_KEYWORDS
except ImportError:
    logger.warning("Could not import MAX_KEYWORDS from root config, using default value")
    MAX_KEYWORDS = 10

def verify_backend_connection():
    """Verify that the backend is accessible"""
    try:
        logger.info("Attempting to connect to backend API")
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            logger.info("Successfully connected to backend API")
            return True
        logger.error(f"Backend API returned status code: {response.status_code}")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to connect to backend API: {str(e)}")
        return False

def get_api_url(endpoint: str) -> str:
    """Construct full API URL for given endpoint"""
    try:
        full_url = f"{BACKEND_URL}/{endpoint.lstrip('/')}"
        logger.debug(f"Constructed API URL: {full_url}")
        return full_url
    except Exception as e:
        logger.error(f"Error constructing API URL: {str(e)}")
        raise