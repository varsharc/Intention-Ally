print("Starting script execution")

import streamlit as st
import logging
import sys

print("Imports successful")

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

print("Logging configured")
logger.info("Starting Streamlit application")

# Basic page config
st.write("Test Minimal App")
logger.info("Written test message")