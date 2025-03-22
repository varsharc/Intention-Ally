import os
import sys
import logging
import streamlit as st

# Set explicit server configuration
os.environ['STREAMLIT_SERVER_HEADLESS'] = 'true'
os.environ['STREAMLIT_SERVER_PORT'] = '5000'
os.environ['STREAMLIT_SERVER_ADDRESS'] = '0.0.0.0'

# Configure logging with more detailed output
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.debug("Starting application initialization")

# Basic page config
st.set_page_config(
    page_title="Search Keyword Tracker",
    page_icon="🔍",
    layout="wide"
)

st.title("Search Keyword Tracker")
st.write("Simple test page")

logger.info("Application initialization completed successfully")