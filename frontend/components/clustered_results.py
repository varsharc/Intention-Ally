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
            logger.warning("No texts found for clustering")
            return None

        logger.info(f"Processing {len(texts)} documents for clustering")

        # Calculate TF-IDF
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = vectorizer.fit_transform(texts)
        logger.info(f"TF-IDF matrix shape: {tfidf_matrix.shape}")

        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(tfidf_matrix)
        distance_matrix = 1 - similarity_matrix

        # Cluster using DBSCAN
        clustering = DBSCAN(
            eps=0.5,  # Maximum distance between points in a cluster
            min_samples=2,  # Minimum points to form a cluster
            metric='precomputed'
        )
        cluster_labels = clustering.fit_predict(distance_matrix)

        # Calculate cluster probabilities
        probabilities = np.zeros(len(texts))
        for i in range(len(texts)):
            if cluster_labels[i] != -1:  # Not noise
                cluster_members = cluster_labels == cluster_labels[i]
                probabilities[i] = np.mean(similarity_matrix[i][cluster_members])
            else:
                probabilities[i] = 0.1  # Default for noise points

        # Use MDS for 2D visualization coordinates
        from sklearn.manifold import MDS
        mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
        coordinates = mds.fit_transform(distance_matrix)

        # Log clustering results
        unique_clusters = np.unique(cluster_labels)
        logger.info(f"Number of clusters found: {len(unique_clusters)}")
        logger.info(f"Cluster sizes: {np.bincount(cluster_labels[cluster_labels != -1])}")
        logger.info(f"Number of noise points: {np.sum(cluster_labels == -1)}")

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

        # Debug: Display raw cluster data
        with st.expander("Debug: Raw Cluster Data"):
            st.write({
                "Number of texts": len(cluster_data['titles']),
                "Unique clusters": len(np.unique(cluster_data['cluster_labels'])),
                "Coordinates shape": cluster_data['coordinates'].shape
            })

        # Create D3.js compatible data structure
        nodes = []
        links = []

        coordinates = cluster_data['coordinates']
        cluster_labels = cluster_data['cluster_labels']
        titles = cluster_data['titles']
        urls = cluster_data['urls']
        keywords = cluster_data['keywords']
        probabilities = cluster_data['probabilities']

        # Create nodes with normalized coordinates
        x_scale = 800 / (np.max(coordinates[:, 0]) - np.min(coordinates[:, 0]))
        y_scale = 600 / (np.max(coordinates[:, 1]) - np.min(coordinates[:, 1]))

        for i in range(len(titles)):
            nodes.append({
                'id': str(i),  # Convert to string for D3.js
                'title': titles[i],
                'url': urls[i],
                'keyword': keywords[i],
                'x': float(coordinates[i, 0] * x_scale),
                'y': float(coordinates[i, 1] * y_scale),
                'cluster': int(cluster_labels[i]),
                'confidence': float(probabilities[i])
            })

        # Create edges between nodes in same cluster
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                if (cluster_labels[i] != -1 and  # -1 is noise
                    cluster_labels[i] == cluster_labels[j]):
                    links.append({
                        'source': str(i),  # Use string IDs
                        'target': str(j),
                        'value': min(probabilities[i], probabilities[j])
                    })

        # Create the visualization
        st.components.v1.html(f"""
            <div id="cluster-viz" style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 5px;"></div>
            <script src="https://d3js.org/d3.v7.min.js"></script>
            <script>
            (function() {{
                const data = {json.dumps({'nodes': nodes, 'links': links})};
                console.log('Visualization data:', data);  // Debug log

                const width = document.getElementById('cluster-viz').offsetWidth;
                const height = 600;

                // Create SVG
                const svg = d3.select('#cluster-viz')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Define forces
                const simulation = d3.forceSimulation(data.nodes)
                    .force('link', d3.forceLink(data.links)
                        .id(d => d.id)
                        .distance(50))
                    .force('charge', d3.forceManyBody().strength(-200))
                    .force('center', d3.forceCenter(width / 2, height / 2))
                    .force('collision', d3.forceCollide().radius(d => 10 + d.confidence * 20));

                // Create container for zoom
                const g = svg.append('g');

                // Add zoom behavior
                svg.call(d3.zoom()
                    .extent([[0, 0], [width, height]])
                    .scaleExtent([0.1, 4])
                    .on('zoom', (event) => {{
                        g.attr('transform', event.transform);
                    }}));

                // Create links
                const link = g.append('g')
                    .selectAll('line')
                    .data(data.links)
                    .join('line')
                    .style('stroke', '#999')
                    .style('stroke-opacity', 0.6)
                    .style('stroke-width', d => Math.sqrt(d.value) * 2);

                // Create nodes
                const node = g.append('g')
                    .selectAll('circle')
                    .data(data.nodes)
                    .join('circle')
                    .attr('r', d => 5 + d.confidence * 15)
                    .style('fill', d => d.cluster === -1 ? '#ccc' : d3.schemeCategory10[d.cluster % 10])
                    .style('stroke', '#fff')
                    .style('stroke-width', 1.5)
                    .style('cursor', 'pointer');

                // Add tooltip
                const tooltip = d3.select('#cluster-viz')
                    .append('div')
                    .style('position', 'absolute')
                    .style('visibility', 'hidden')
                    .style('background-color', 'white')
                    .style('padding', '8px')
                    .style('border', '1px solid #ddd')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                    .style('z-index', '10')
                    .style('max-width', '300px');

                // Add interactivity
                node.on('mouseover', function(event, d) {{
                        d3.select(this)
                            .style('stroke', '#000')
                            .style('stroke-width', 2);

                        tooltip.style('visibility', 'visible')
                            .html(`
                                <strong>${{d.title}}</strong><br/>
                                Keyword: ${{d.keyword}}<br/>
                                Cluster: ${{d.cluster === -1 ? 'Unclustered' : d.cluster + 1}}
                            `)
                            .style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - 10) + 'px');
                    }})
                    .on('mouseout', function() {{
                        d3.select(this)
                            .style('stroke', '#fff')
                            .style('stroke-width', 1.5);
                        tooltip.style('visibility', 'hidden');
                    }})
                    .on('click', (event, d) => window.open(d.url, '_blank'))
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));

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
        """, height=600)

        # Add explanation
        st.markdown("""
        #### How to read this visualization:
        - Each circle represents a search result
        - Circle size indicates relevance score
        - Circle color represents the topic cluster
        - Connected circles are semantically related
        - Hover over circles to see details
        - Click circles to open the source article
        - Drag to rearrange, scroll to zoom
        """)

    except Exception as e:
        logger.error(f"Error in clustered results: {str(e)}")
        st.error("An error occurred while creating the topic clusters")