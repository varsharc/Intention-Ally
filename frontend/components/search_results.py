import streamlit as st
import requests
from datetime import datetime, timedelta
import pandas as pd
import sys
import os
import logging
from .clustered_results import clustered_results

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

def search_results():
    st.subheader("Search Results")

    # Date range selector
    days = st.slider("Show results from last N days", 1, 30, 7)

    # Fetch results
    try:
        logger.info(f"Fetching search results for last {days} days")
        response = requests.get(get_api_url(f"results?days={days}"))

        if response.status_code == 200:
            results = response.json()
            logger.info(f"Received {len(results)} search entries")

            if not results:
                st.info("No search results available for the selected period.")
                return

            # Show topic clusters visualization
            clustered_results(results)

            # Create a dataframe for better display
            df_rows = []
            for search in results:
                logger.info(f"Processing results for keyword: {search['keyword']}")
                for result in search["results"]:
                    df_rows.append({
                        "Keyword": search["keyword"],
                        "Date": datetime.fromisoformat(search["timestamp"]).strftime("%Y-%m-%d"),
                        "Title": result["title"],
                        "Description": result["description"],
                        "URL": result["url"]
                    })

            df = pd.DataFrame(df_rows)
            logger.info(f"Created DataFrame with {len(df)} rows")

            # Add filters
            keywords = df["Keyword"].unique()
            selected_keywords = st.multiselect(
                "Filter by keywords",
                options=keywords,
                default=keywords
            )

            filtered_df = df[df["Keyword"].isin(selected_keywords)]
            logger.info(f"Filtered to {len(filtered_df)} rows")

            # Display results in an expandable format
            st.subheader("Search Result Details")
            for _, row in filtered_df.iterrows():
                with st.expander(f"{row['Title']} ({row['Keyword']} - {row['Date']})"):
                    st.write(row["Description"])
                    st.markdown(f"[View Article]({row['URL']})")
        else:
            st.error("Failed to fetch search results")
            logger.error(f"Error fetching results: {response.status_code}")
            logger.error(f"Response content: {response.text}")
    except requests.exceptions.ConnectionError as e:
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error(f"Connection error fetching results: {str(e)}")
    except Exception as e:
        st.error("An unexpected error occurred while fetching results")
        logger.error(f"Unexpected error fetching results: {str(e)}")