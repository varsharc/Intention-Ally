import streamlit as st
import requests
from datetime import datetime
import pandas as pd
import sys
import os
import logging
from .clustered_results import clustered_results

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

def create_article_card(article):
    with st.container():
        st.markdown(f"""
        <div style='padding: 1rem; border: 1px solid #ddd; border-radius: 5px; margin: 0.5rem 0;'>
            <h3>{article['Title']}</h3>
            <p style='color: #666;'>{article['Date']} | {article['Keyword']}</p>
            <p>{article['Description'][:200]}...</p>
            <a href='{article['URL']}' target='_blank'>Read More</a>
        </div>
        """, unsafe_allow_html=True)

def search_results():
    try:
        # Manual search button at the top
        if st.button("Run Manual Search", key="manual_search"):
            with st.spinner("Running manual search..."):
                response = requests.post(get_api_url("run-search"))
                if response.status_code == 200:
                    st.success("Manual search completed!")
                else:
                    st.error("Failed to run manual search")

        # Fetch results
        response = requests.get(get_api_url("results?days=30"))

        if response.status_code == 200:
            results = response.json()

            if not results:
                st.info("No search results available. Try running a manual search.")
                return

            # Show topic clusters visualization first
            clustered_results(results)

            # Process results into a dataframe
            df_rows = []
            for search in results:
                for result in search["results"]:
                    df_rows.append({
                        "Keyword": search["keyword"],
                        "Date": datetime.fromisoformat(search["timestamp"]).strftime("%Y-%m-%d"),
                        "Title": result["title"],
                        "Description": result["description"],
                        "URL": result["url"]
                    })

            df = pd.DataFrame(df_rows)

            # Filtering and sorting options
            col1, col2, col3 = st.columns(3)

            with col1:
                keywords = sorted(df["Keyword"].unique())
                selected_keywords = st.multiselect(
                    "Filter by keywords",
                    options=keywords,
                    default=keywords
                )

            with col2:
                sort_by = st.selectbox(
                    "Sort by",
                    ["Date", "Keyword", "Title"]
                )

            with col3:
                sort_order = st.selectbox(
                    "Order",
                    ["Descending", "Ascending"]
                )

            # Apply filters and sorting
            filtered_df = df[df["Keyword"].isin(selected_keywords)]
            ascending = sort_order == "Ascending"
            filtered_df = filtered_df.sort_values(by=sort_by, ascending=ascending)

            # Pagination
            items_per_page = 20
            total_pages = len(filtered_df) // items_per_page + (1 if len(filtered_df) % items_per_page > 0 else 0)

            if total_pages > 1:
                page = st.number_input("Page", min_value=1, max_value=total_pages, value=1) - 1
                start_idx = page * items_per_page
                end_idx = start_idx + items_per_page
                page_df = filtered_df.iloc[start_idx:end_idx]
            else:
                page_df = filtered_df

            # Display results in a grid layout
            cols = st.columns(4)
            for idx, row in page_df.iterrows():
                with cols[idx % 4]:
                    create_article_card(row)

        else:
            st.error("Failed to fetch search results")

    except requests.exceptions.ConnectionError:
        st.error("Unable to connect to backend service. Please try again later.")
    except Exception as e:
        st.error("An unexpected error occurred while fetching results")
        logger.error(f"Unexpected error: {str(e)}")