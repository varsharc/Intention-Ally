import streamlit as st
import requests
from typing import List
import sys
import os

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from config import MAX_KEYWORDS

def keyword_manager():
    st.subheader("Keyword Management")

    # Add new keyword
    with st.form("add_keyword"):
        new_keyword = st.text_input("Add a new keyword")
        submit_button = st.form_submit_button("Add Keyword")

        if submit_button and new_keyword:
            response = requests.post("http://localhost:8000/keywords", json=new_keyword)
            if response.status_code == 200:
                st.success("Keyword added successfully!")
            else:
                st.error(response.json().get("message", "Failed to add keyword"))

    # Display current keywords
    st.subheader("Current Keywords")
    response = requests.get("http://localhost:8000/keywords")
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
                        delete_response = requests.delete(f"http://localhost:8000/keywords/{keyword['value']}")
                        if delete_response.status_code == 200:
                            st.success("Keyword removed successfully!")
                            st.rerun()