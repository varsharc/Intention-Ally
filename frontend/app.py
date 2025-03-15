import os
import sys
import logging
import streamlit as st

# Configure logging - using improved configuration from edited code
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

logger.info("Starting Streamlit application initialization")

try:
    logger.debug("Attempting to import streamlit")
    
    logger.debug("Setting page configuration")
    st.set_page_config(
        page_title="Search Trends", #from edited code
        page_icon="📊",
        layout="wide"
    )
    logger.info("Page configuration set successfully")

    logger.debug("Attempting to render title")
    st.title("Search Trends Analysis") #from edited code
    st.write("Testing application load...") #from edited code
    logger.info("Title rendered successfully")

except Exception as e:
    logger.error(f"Failed to start Streamlit app: {str(e)}", exc_info=True)
    sys.exit(1)

logger.info("Application startup completed successfully")