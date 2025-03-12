import streamlit as st
import requests
import pandas as pd
import plotly.express as px
from datetime import datetime
import sys
import os
import logging

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def trend_visualization():
    st.subheader("Trend Analysis")

    try:
        # Fetch results
        response = requests.get(get_api_url("results"))
        if response.status_code == 200:
            results = response.json()

            if not results:
                st.info("No data available for trend analysis yet.")
                return

            # Prepare data for visualization
            df_rows = []
            for search in results:
                date = datetime.fromisoformat(search["timestamp"]).date()
                keyword = search["keyword"]
                result_count = len(search["results"])
                df_rows.append({
                    "Date": date,
                    "Keyword": keyword,
                    "Results": result_count
                })

            df = pd.DataFrame(df_rows)

            # Create trend line chart
            fig = px.line(
                df,
                x="Date",
                y="Results",
                color="Keyword",
                title="Search Results Trend Over Time",
                labels={"Results": "Number of Results", "Date": "Search Date"}
            )

            # Customize layout
            fig.update_layout(
                hovermode="x unified",
                legend_title_text="Keywords",
                xaxis_title="Date",
                yaxis_title="Number of Results"
            )

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