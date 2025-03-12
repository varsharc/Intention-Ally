import streamlit as st
import requests
from datetime import datetime, timedelta
import pandas as pd
import sys
import os

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

def search_results():
    st.subheader("Search Results")

    # Date range selector
    days = st.slider("Show results from last N days", 1, 30, 7)

    # Fetch results
    response = requests.get(f"http://localhost:8000/results?days={days}")
    if response.status_code == 200:
        results = response.json()

        if not results:
            st.info("No search results available for the selected period.")
            return

        # Create a dataframe for better display
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

        # Add filters
        keywords = df["Keyword"].unique()
        selected_keywords = st.multiselect(
            "Filter by keywords",
            options=keywords,
            default=keywords
        )

        filtered_df = df[df["Keyword"].isin(selected_keywords)]

        # Display results in an expandable format
        for _, row in filtered_df.iterrows():
            with st.expander(f"{row['Title']} ({row['Keyword']} - {row['Date']})"):
                st.write(row["Description"])
                st.markdown(f"[View Article]({row['URL']})")
    else:
        st.error("Failed to fetch search results")