
import streamlit as st
import logging
import sys

# Configure logging
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
st.write("Welcome to the Search Keyword Tracker")

logger.info("Application initialization completed successfully")
