import streamlit as st
import requests
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime, timedelta
import logging
import sys
import os
from .word_cloud import generate_word_cloud

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


def visualize_clusters(nodes, links):
    """Visualizes clusters using Plotly."""
    st.subheader("Topic Clusters Visualization")

    # Create a network graph using Plotly
    edge_x = []
    edge_y = []
    for link in links:
        x0, y0 = nodes[link['source']]['x'], nodes[link['source']]['y']
        x1, y1 = nodes[link['target']]['x'], nodes[link['target']]['y']
        edge_x.extend([x0, x1, None])
        edge_y.extend([y0, y1, None])

    edge_trace = go.Scatter(
        x=edge_x, y=edge_y,
        line=dict(width=0.5, color='#888'),
        hoverinfo='none',
        mode='lines')

    node_x = [node['x'] for node in nodes]
    node_y = [node['y'] for node in nodes]
    node_colors = [node['group'] for node in nodes]
    node_text = [f"Theme: {_get_theme_for_cluster(node['group'])}<br>Size: {node['size']}" for node in nodes]

    node_trace = go.Scatter(
        x=node_x, y=node_y,
        mode='markers+text',
        hoverinfo='text',
        text=[_get_theme_for_cluster(node['group']) for node in nodes],
        textposition="top center",
        marker=dict(
            showscale=True,
            colorscale='Viridis',
            color=node_colors,
            size=[n['size']*10 for n in nodes],
            line_width=2))

    fig = go.Figure(data=[edge_trace, node_trace],
                   layout=go.Layout(
                       showlegend=False,
                       hovermode='closest',
                       margin=dict(b=0,l=0,r=0,t=0),
                       xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                       yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                   )

    st.plotly_chart(fig, use_container_width=True)

def _get_theme_for_cluster(group_id):
    """Extract theme label for a cluster group."""
    themes = {
        1: "Technology",
        2: "Environment",
        3: "Business",
        4: "Science",
        5: "Politics"
    }
    return themes.get(group_id, f"Theme {group_id}")

#Example usage (needs data sourcing)
nodes = [{'id':'node1', 'size':10, 'group':1, 'x':10, 'y':10}, {'id':'node2', 'size':20, 'group':2, 'x':20, 'y':20}]
links = [{'source':0, 'target':1, 'value':1}]
visualize_clusters(nodes, links)