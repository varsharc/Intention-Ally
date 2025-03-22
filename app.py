print("Starting Streamlit application...")

import streamlit as st
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

logger.info("Initializing application")

# Basic app content
st.title("Simple Test App")
st.write("If you can see this message, the app is working correctly!")

logger.info("Application rendered successfully")