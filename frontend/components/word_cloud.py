import streamlit as st
import pandas as pd
from wordcloud import WordCloud
import plotly.graph_objects as go
from collections import Counter
import logging

logger = logging.getLogger(__name__)

def generate_word_cloud(search_results):
    """Generate a word cloud from search results with sentiment coloring"""
    try:
        # Combine all descriptions into one text
        all_text = " ".join([
            result["description"] 
            for search in search_results 
            for result in search["results"]
        ])
        
        # Generate word frequencies
        wordcloud = WordCloud(
            width=800, height=400,
            background_color='white',
            colormap='viridis'  # Using viridis colormap for now, will add sentiment colors later
        ).generate(all_text)
        
        # Convert to image for Streamlit
        fig = go.Figure()
        fig.add_trace(
            go.Image(z=wordcloud.to_array())
        )
        
        fig.update_layout(
            title="Search Results Word Cloud",
            xaxis_visible=False,
            yaxis_visible=False
        )
        
        return fig
    except Exception as e:
        logger.error(f"Error generating word cloud: {str(e)}")
        return None
