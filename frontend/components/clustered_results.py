import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.manifold import MDS
import numpy as np
import logging

logger = logging.getLogger(__name__)

def calculate_similarity_clusters(search_results):
    """Calculate similarity between search results and create clusters"""
    try:
        # Extract text content for similarity calculation
        texts = []
        titles = []
        urls = []
        keywords = []
        
        for search in search_results:
            for result in search["results"]:
                text = f"{result['title']} {result['description']}"
                texts.append(text)
                titles.append(result['title'])
                urls.append(result['url'])
                keywords.append(search['keyword'])
        
        if not texts:
            return None
            
        # Calculate TF-IDF and similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(texts)
        similarity_matrix = cosine_similarity(tfidf_matrix)
        
        # Use MDS to convert similarities to 2D coordinates
        mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
        distances = 1 - similarity_matrix
        coordinates = mds.fit_transform(distances)
        
        return {
            'coordinates': coordinates,
            'titles': titles,
            'urls': urls,
            'keywords': keywords
        }
    except Exception as e:
        logger.error(f"Error calculating clusters: {str(e)}")
        return None

def create_cluster_visualization(cluster_data):
    """Create an interactive scatter plot visualization of clustered results"""
    try:
        if not cluster_data:
            return None
            
        coordinates = cluster_data['coordinates']
        titles = cluster_data['titles']
        urls = cluster_data['urls']
        keywords = cluster_data['keywords']
        
        # Create hover text
        hover_text = [f"Title: {title}<br>Keyword: {keyword}<br>URL: {url}" 
                     for title, keyword, url in zip(titles, keywords, urls)]
        
        # Create scatter plot
        fig = go.Figure()
        
        # Add points colored by keyword
        unique_keywords = list(set(keywords))
        for i, keyword in enumerate(unique_keywords):
            mask = [k == keyword for k in keywords]
            fig.add_trace(go.Scatter(
                x=coordinates[mask, 0],
                y=coordinates[mask, 1],
                mode='markers+text',
                name=keyword,
                text=[titles[i] for i, m in enumerate(mask) if m],
                hovertext=[hover_text[i] for i, m in enumerate(mask) if m],
                hoverinfo='text',
                textposition="top center",
                marker=dict(size=10)
            ))
        
        fig.update_layout(
            title="Interactive Topic Clusters",
            xaxis_title="",
            yaxis_title="",
            xaxis_showticklabels=False,
            yaxis_showticklabels=False,
            showlegend=True,
            hovermode='closest',
            height=600
        )
        
        return fig
    except Exception as e:
        logger.error(f"Error creating cluster visualization: {str(e)}")
        return None

def clustered_results(search_results):
    """Display clustered search results visualization"""
    st.subheader("Topic Clusters")
    
    try:
        if not search_results:
            st.info("No search results available for clustering.")
            return
            
        # Calculate clusters
        cluster_data = calculate_similarity_clusters(search_results)
        if not cluster_data:
            st.warning("Unable to create clusters from the current search results.")
            return
            
        # Create and display visualization
        fig = create_cluster_visualization(cluster_data)
        if fig:
            st.plotly_chart(fig, use_container_width=True)
            
            # Add explanation
            st.markdown("""
            #### How to read this visualization:
            - Each point represents a search result
            - Points are colored by search keyword
            - Similar topics are placed closer together
            - Hover over points to see details
            - Click and drag to zoom, double click to reset
            """)
        else:
            st.error("Error creating visualization")
            
    except Exception as e:
        logger.error(f"Error in clustered results: {str(e)}")
        st.error("An error occurred while creating the topic clusters")
