import streamlit as st
import requests
import logging
from typing import List, Dict
import sys
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

def search_preferences():
    """Component for managing search preferences and filters"""
    st.subheader("Search Preferences")

    # Region Selection
    st.write("Geographic Region Preferences")
    regions = {
        "Global": True,
        "North America": False,
        "Europe": False,
        "Asia": False,
        "Other": False
    }

    # Create columns for region selection
    cols = st.columns(3)
    for i, (region, default) in enumerate(regions.items()):
        with cols[i % 3]:
            regions[region] = st.checkbox(region, value=default, key=f"region_{region}")

    # Credibility Filters
    st.write("Content Type Preferences")
    content_types = {
        "News Articles": True,
        "Academic Sources": False,
        "Industry Reports": False,
        "Blog Posts": False
    }

    # Create columns for content type selection
    cols = st.columns(2)
    for i, (content_type, default) in enumerate(content_types.items()):
        with cols[i % 2]:
            content_types[content_type] = st.checkbox(
                content_type, 
                value=default,
                key=f"content_{content_type}"
            )

    # Time Range Filter
    st.write("Time Range")
    time_range = st.select_slider(
        "Show content from:",
        options=["Last 24 hours", "Last week", "Last month", "Last 6 months", "Last year", "Any time"],
        value="Last month"
    )

    # Credibility Score Threshold with detailed tooltip
    st.write("Minimum Credibility Score")
    credibility_tooltip = """
    Credibility score (0-100) is calculated based on multiple factors:
    • Domain Authority (40%): Website's overall authority and trustworthiness
    • Backlink Quality (30%): Number and quality of referring domains
    • Content Engagement (20%): User interaction metrics from Brave
    • Source Age (10%): How long the domain has been established

    Higher scores indicate more authoritative and trustworthy sources.
    """
    min_credibility = st.slider(
        "Filter results by minimum credibility score",
        min_value=0,
        max_value=100,
        value=50,
        help=credibility_tooltip
    )

    # Save preferences button
    if st.button("Save Preferences"):
        try:
            preferences = {
                "regions": [r for r, enabled in regions.items() if enabled],
                "content_types": [ct for ct, enabled in content_types.items() if enabled],
                "time_range": time_range,
                "min_credibility": min_credibility
            }
            logger.info(f"Saving search preferences: {preferences}")
            # Store preferences in session state for now
            st.session_state.search_preferences = preferences
            st.success("Preferences saved successfully!")
        except Exception as e:
            logger.error(f"Error saving preferences: {str(e)}")
            st.error("Failed to save preferences")

    return st.session_state.get("search_preferences", None)