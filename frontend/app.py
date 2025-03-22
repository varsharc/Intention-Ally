import os
import sys
import logging
import streamlit as st

# Configure logging - using improved configuration from original code
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

try:
    # Basic page config from edited code
    st.set_page_config(
        page_title="Minimal Test",
        page_icon="🔍",
        layout="wide"
    )

    # Simple test content from edited code
    st.title("Search Keyword Tracker")
    st.write("Minimal test - if you can see this, the server is working!")

except Exception as e:
    logger.error(f"Failed to start Streamlit app: {str(e)}", exc_info=True)
    sys.exit(1)