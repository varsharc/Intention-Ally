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
        page_title="Test App",
        page_icon="📊",
        layout="wide"
    )
    logger.info("Page configuration set successfully")

    logger.debug("Attempting to render title")
    st.title("This is a Streamlit app")
    st.write("If you can see this, the app is working!") #Adding confirmation message from edited code.
    logger.info("Title rendered successfully")

except Exception as e:
    logger.error(f"Failed to start Streamlit app: {str(e)}", exc_info=True)
    sys.exit(1)

logger.info("Application startup completed successfully")