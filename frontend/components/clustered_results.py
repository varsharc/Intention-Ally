import streamlit as st
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity
import logging
import json

logger = logging.getLogger(__name__)

def calculate_similarity_clusters(search_results):
    """Calculate similarity between search results using DBSCAN clustering"""
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

        # Calculate TF-IDF
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(texts)

        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(tfidf_matrix)

        # Cluster using DBSCAN
        clustering = DBSCAN(
            eps=0.3,  # Maximum distance between samples
            min_samples=2,  # Minimum samples in a cluster
            metric='precomputed'
        )
        cluster_labels = clustering.fit_predict(1 - similarity_matrix)  # Using distance = 1 - similarity

        # Calculate cluster probabilities (confidence scores)
        probabilities = np.zeros(len(texts))
        for i in range(len(texts)):
            if cluster_labels[i] != -1:  # Not noise
                cluster_members = cluster_labels == cluster_labels[i]
                probabilities[i] = np.mean(similarity_matrix[i][cluster_members])
            else:
                probabilities[i] = 0.1  # Default confidence for noise points

        # Use MDS for 2D visualization coordinates
        from sklearn.manifold import MDS
        mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
        coordinates = mds.fit_transform(1 - similarity_matrix)

        return {
            'coordinates': coordinates,
            'cluster_labels': cluster_labels,
            'titles': titles,
            'urls': urls,
            'keywords': keywords,
            'probabilities': probabilities
        }
    except Exception as e:
        logger.error(f"Error calculating clusters: {str(e)}")
        return None

def generate_d3_data(cluster_data):
    """Generate data structure for D3.js visualization"""
    if not cluster_data:
        return None

    try:
        nodes = []
        links = []

        coordinates = cluster_data['coordinates']
        cluster_labels = cluster_data['cluster_labels']
        titles = cluster_data['titles']
        urls = cluster_data['urls']
        keywords = cluster_data['keywords']
        probabilities = cluster_data['probabilities']

        # Create nodes
        for i in range(len(titles)):
            nodes.append({
                'id': i,
                'title': titles[i],
                'url': urls[i],
                'keyword': keywords[i],
                'x': float(coordinates[i, 0]),
                'y': float(coordinates[i, 1]),
                'cluster': int(cluster_labels[i]),
                'confidence': float(probabilities[i])
            })

        # Create edges between nodes in same cluster
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                if (cluster_labels[i] != -1 and  # -1 is noise in DBSCAN
                    cluster_labels[i] == cluster_labels[j]):
                    links.append({
                        'source': i,
                        'target': j,
                        'value': min(probabilities[i], probabilities[j])
                    })

        return {'nodes': nodes, 'links': links}
    except Exception as e:
        logger.error(f"Error generating D3 data: {str(e)}")
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

        # Generate D3.js compatible data
        d3_data = generate_d3_data(cluster_data)
        if not d3_data:
            st.error("Error preparing visualization data")
            return

        # Convert data to JSON for JavaScript
        d3_data_json = json.dumps(d3_data)

        # Create the D3.js visualization HTML
        d3_html = f"""
        <div id="cluster-visualization" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script>
        (function() {{
            const data = {d3_data_json};

            // Set up the SVG container
            const container = document.getElementById('cluster-visualization');
            const width = container.offsetWidth;
            const height = container.offsetHeight;

            const svg = d3.select('#cluster-visualization')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Create the simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force('link', d3.forceLink(data.links).id(d => d.id))
                .force('charge', d3.forceManyBody().strength(-100))
                .force('center', d3.forceCenter(width / 2, height / 2));

            // Add the links
            const link = svg.append('g')
                .selectAll('line')
                .data(data.links)
                .join('line')
                .style('stroke', '#999')
                .style('stroke-opacity', 0.6)
                .style('stroke-width', d => Math.sqrt(d.value));

            // Add the nodes
            const node = svg.append('g')
                .selectAll('circle')
                .data(data.nodes)
                .join('circle')
                .attr('r', d => 5 + d.confidence * 5)
                .style('fill', d => d3.schemeCategory10[d.cluster % 10])
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {{
                    d3.select(this).style('stroke', '#000').style('stroke-width', 2);
                    tooltip.style('visibility', 'visible')
                        .html(`Title: ${{d.title}}<br>Keyword: ${{d.keyword}}<br>Cluster: ${{d.cluster}}`);
                }})
                .on('mouseout', function() {{
                    d3.select(this).style('stroke', null);
                    tooltip.style('visibility', 'hidden');
                }})
                .on('click', (event, d) => window.open(d.url, '_blank'));

            // Add drag behavior
            node.call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

            // Add tooltip
            const tooltip = d3.select('#cluster-visualization')
                .append('div')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('background-color', 'white')
                .style('padding', '5px')
                .style('border', '1px solid #ddd')
                .style('border-radius', '5px');

            // Update positions on each tick
            simulation.on('tick', () => {{
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            }});

            // Drag functions
            function dragstarted(event) {{
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }}

            function dragged(event) {{
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }}

            function dragended(event) {{
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }}
        }})();
        </script>
        """

        # Display the visualization
        st.components.v1.html(d3_html, height=600)

        # Add explanation
        st.markdown("""
        #### How to read this visualization:
        - Each circle represents a search result
        - Circle size indicates relevance score
        - Circle color represents the topic cluster
        - Connected circles are semantically related
        - Hover over circles to see details
        - Click circles to open the source article
        - Drag circles to explore relationships
        """)

    except Exception as e:
        logger.error(f"Error in clustered results: {str(e)}")
        st.error("An error occurred while creating the topic clusters")