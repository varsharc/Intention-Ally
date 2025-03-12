import streamlit as st
import requests
from typing import List
import sys
import os
import logging

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from config import MAX_KEYWORDS
from frontend.config import get_api_url

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def keyword_manager():
    st.subheader("Keyword Management")

    # Add new keyword
    with st.form("add_keyword"):
        new_keyword = st.text_input("Add a new keyword")
        submit_button = st.form_submit_button("Add Keyword")

        if submit_button and new_keyword:
            try:
                response = requests.post(get_api_url("keywords"), json=new_keyword)
                if response.status_code == 200:
                    st.success("Keyword added successfully!")
                else:
                    error_msg = response.json().get("detail", "Failed to add keyword")
                    st.error(error_msg)
                    logger.error(f"Failed to add keyword: {error_msg}")
            except requests.exceptions.ConnectionError as e:
                error_msg = "Unable to connect to backend service. Please try again later."
                st.error(error_msg)
                logger.error(f"Connection error: {str(e)}")
            except Exception as e:
                st.error("An unexpected error occurred")
                logger.error(f"Unexpected error adding keyword: {str(e)}")

    # Display current keywords
    st.subheader("Current Keywords")
    try:
        response = requests.get(get_api_url("keywords"))
        if response.status_code == 200:
            keywords = response.json()
            if not keywords:
                st.info(f"No keywords added yet. You can add up to {MAX_KEYWORDS} keywords.")
            else:
                for keyword in keywords:
                    col1, col2 = st.columns([3, 1])
                    with col1:
                        st.write(keyword["value"])
                    with col2:
                        if st.button("Remove", key=f"remove_{keyword['value']}"):
                            try:
                                delete_response = requests.delete(get_api_url(f"keywords/{keyword['value']}"))
                                if delete_response.status_code == 200:
                                    st.success("Keyword removed successfully!")
                                    st.rerun()
                                else:
                                    st.error(delete_response.json().get("detail", "Failed to remove keyword"))
                            except Exception as e:
                                st.error("Failed to remove keyword")
                                logger.error(f"Error removing keyword: {str(e)}")
        else:
            st.error("Failed to fetch keywords")
            logger.error(f"Error fetching keywords: {response.status_code}")
    except requests.exceptions.ConnectionError as e:
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error(f"Connection error fetching keywords: {str(e)}")
    except Exception as e:
        st.error("An unexpected error occurred")
        logger.error(f"Unexpected error fetching keywords: {str(e)}")