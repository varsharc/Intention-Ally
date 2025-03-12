import streamlit as st
import requests
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import logging
import sys
import os

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def trend_visualization():
    st.subheader("Search Trends")

    # Date range selector
    days = st.slider("Show trends from last N days", 1, 30, 7)

    # Fetch data
    try:
        response = requests.get(get_api_url(f"results?days={days}"))
        if response.status_code == 200:
            results = response.json()

            if not results:
                st.info("No trend data available for the selected period.")
                return

            # Process data for visualization
            trend_data = []
            for search in results:
                trend_data.append({
                    "Keyword": search["keyword"],
                    "Date": datetime.fromisoformat(search["timestamp"]).strftime("%Y-%m-%d"),
                    "Results": len(search["results"])
                })

            df = pd.DataFrame(trend_data)

            # Line chart of search results over time
            st.subheader("Search Results Over Time")
            fig = px.line(df, x="Date", y="Results", color="Keyword", 
                         title="Number of Search Results by Keyword")
            st.plotly_chart(fig, use_container_width=True)

            # Summary statistics
            st.subheader("Summary Statistics")
            summary_df = df.groupby("Keyword")["Results"].agg([
                "mean", "min", "max", "count"
            ]).round(2)

            summary_df.columns = ["Average Results", "Minimum", "Maximum", "Number of Searches"]
            st.dataframe(summary_df)
        else:
            st.error("Failed to fetch trend data")
            logger.error(f"Error fetching trend data: {response.status_code}")
    except requests.exceptions.ConnectionError as e:
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error(f"Connection error fetching trend data: {str(e)}")
    except Exception as e:
        st.error("An unexpected error occurred while fetching trend data")
        logger.error(f"Unexpected error fetching trend data: {str(e)}")