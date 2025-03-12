import streamlit as st
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Starting minimal test app")
st.write("Basic Streamlit Test")
st.write("If you see this, Streamlit is working!")
logger.info("Test app content rendered")
