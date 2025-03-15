import streamlit as st
import pandas as pd
import logging
from datetime import datetime, timedelta
import math
import requests
from frontend.config import get_api_url

logger = logging.getLogger(__name__)

def _fetch_results_from_api():
    days = st.slider("Show results from last N days", 1, 30, 7)
    try:
        logger.info(f"Fetching search results for last {days} days")
        response = requests.get(get_api_url(f"results?days={days}"))
        if response.status_code == 200:
            results = response.json()
            logger.info(f"Received {len(results)} search entries")
            if not results:
                st.info("No search results available for the selected period.")
                return []

            df_rows = []
            for search in results:
                for result in search["results"]:
                    df_rows.append({
                        "date": datetime.fromisoformat(search["timestamp"]).strftime("%Y-%m-%d"),
                        "title": result["title"],
                        "description": result["description"],
                        "url": result["url"],
                        "theme": "Theme Placeholder", # Placeholder, needs to be populated from API response
                        "category": "Category Placeholder", # Placeholder, needs to be populated from API response
                        "credibility_score": 0.5 # Placeholder, needs to be populated from API response

                    })
            return df_rows
        else:
            st.error("Failed to fetch search results")
            logger.error(f"Error fetching results: {response.status_code}")
            return []
    except requests.exceptions.ConnectionError as e:
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error(f"Connection error fetching results: {str(e)}")
        return []
    except Exception as e:
        st.error("An unexpected error occurred while fetching results")
        logger.error(f"Unexpected error fetching results: {str(e)}")
        return []


def search_results():
    with st.container():
        df = _get_search_results()
        if df is not None:
            _display_results_as_cards(df)

def _get_search_results():
    try:
        # Get results from API
        results_df = pd.DataFrame(_fetch_results_from_api())
        return results_df
    except Exception as e:
        logger.error(f"Error fetching results: {str(e)}")
        return None

def _display_results_as_cards(df):
    # Add sorting/filtering options
    col1, col2, col3 = st.columns(3)
    with col1:
        sort_by = st.selectbox("Sort by", ["Recency", "Credibility Score", "Theme"])
    with col2:
        filter_theme = st.multiselect("Filter by Theme", df["theme"].unique())
    with col3:
        filter_category = st.multiselect("Filter by Category", df["category"].unique())

    # Apply filters
    filtered_df = df
    if filter_theme:
        filtered_df = filtered_df[filtered_df["theme"].isin(filter_theme)]
    if filter_category:
        filtered_df = filtered_df[filtered_df["category"].isin(filter_category)]

    # Sort results
    if sort_by == "Recency":
        filtered_df = filtered_df.sort_values("date", ascending=False)
    elif sort_by == "Credibility Score":
        filtered_df = filtered_df.sort_values("credibility_score", ascending=False)
    elif sort_by == "Theme":
        filtered_df = filtered_df.sort_values("theme")

    # Pagination
    items_per_page = 20
    total_pages = math.ceil(len(filtered_df) / items_per_page)
    page = st.number_input("Page", min_value=1, max_value=total_pages, value=1) - 1

    start_idx = page * items_per_page
    end_idx = start_idx + items_per_page
    page_df = filtered_df.iloc[start_idx:end_idx]

    # Display cards in 4x1 grid
    cols = st.columns(4)
    for idx, row in page_df.iterrows():
        col_idx = idx % 4
        with cols[col_idx]:
            with st.container():
                st.markdown(f"""
                <div style='padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 5px;'>
                    <h4>{row['title'][:50]}...</h4>
                    <p>{row['description'][:100]}...</p>
                    <small>Theme: {row['theme']} | Score: {row['credibility_score']:.1f}</small>
                    <a href="{row['url']}" target="_blank">View Article</a>
                </div>
                """, unsafe_allow_html=True)

    st.markdown(f"Page {page + 1} of {total_pages}")