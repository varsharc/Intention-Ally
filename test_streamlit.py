import streamlit as st
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Starting minimal Streamlit test")

# Basic page setup
st.set_page_config(page_title="Test Page")

# Simple content
st.title("Test Page")
st.write("If you can see this, Streamlit is working correctly!")

logger.info("Test page rendered")
