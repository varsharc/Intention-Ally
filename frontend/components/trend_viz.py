import streamlit as st
import requests
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import logging
import sys
import os
from .word_cloud import generate_word_cloud
import networkx as nx # Added for network graph

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from frontend.config import get_api_url

def trend_visualization():
    st.subheader("Search Trends")

    # Date range selector
    days = st.slider("Show trends from last N days", 1, 30, 7)

    # Fetch data
    try:
        logger.info(f"Fetching trend data for last {days} days")
        response = requests.get(get_api_url(f"results?days={days}"))

        if response.status_code == 200:
            results = response.json()
            logger.info(f"Received {len(results)} search entries for trends")

            if not results:
                st.info("No trend data available for the selected period.")
                return

            # Word Cloud Visualization
            st.subheader("Topic Word Cloud")
            word_cloud_fig = generate_word_cloud(results)
            if word_cloud_fig:
                st.plotly_chart(word_cloud_fig, use_container_width=True)

            # Process data for trend visualization
            trend_data = []
            for search in results:
                logger.info(f"Processing trend data for keyword: {search['keyword']}")
                trend_data.append({
                    "Keyword": search["keyword"],
                    "Date": datetime.fromisoformat(search["timestamp"]).strftime("%Y-%m-%d"),
                    "Results": len(search["results"])
                })

            df = pd.DataFrame(trend_data)
            logger.info(f"Created trends DataFrame with {len(df)} rows")

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
            logger.info("Successfully displayed trend visualizations")
        else:
            st.error("Failed to fetch trend data")
            logger.error(f"Error fetching trend data: {response.status_code}")
            logger.error(f"Response content: {response.text}")
    except requests.exceptions.ConnectionError as e:
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error(f"Connection error fetching trend data: {str(e)}")
    except Exception as e:
        st.error("An unexpected error occurred while fetching trend data")
        logger.error(f"Unexpected error fetching trend data: {str(e)}")


# Example of how to potentially integrate D3-like visualization (requires significant expansion)

def visualize_clusters(nodes, links):
    """Visualizes clusters using a network graph (simulating D3)."""
    #Simulate D3 behaviour for illustration purposes only, needs a proper D3 implementation
    st.subheader("Topic Clusters Visualization")
    # Placeholder for D3 chart (replace with actual D3 implementation)
    # Create force-directed graph with thematic labels
    graph = nx.Graph()
    for node in nodes:
        # Add thematic labels based on clustering
        theme = _get_theme_for_cluster(node['group'])
        graph.add_node(node['id'], size=node['size'], group=node['group'], theme=theme)
    for link in links:
        graph.add_edge(link['source'], link['target'], weight=link['value'])

    pos = nx.spring_layout(graph) #Example layout, needs improvement for large graphs
    nx.draw(graph, pos, with_labels=True, node_size=[d['size'] for n,d in graph.nodes(data=True)])
    st.pyplot() #needs a proper backend

def _get_theme_for_cluster(group_id):
    # Placeholder - needs actual implementation for theme extraction
    return f"Theme for cluster {group_id}"

#Example usage (needs data sourcing)
nodes = [{'id':'node1', 'size':10, 'group':1}, {'id':'node2', 'size':20, 'group':2}]
links = [{'source':'node1', 'target':'node2', 'value':1}]
visualize_clusters(nodes, links)