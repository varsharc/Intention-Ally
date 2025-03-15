import streamlit as st
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.manifold import MDS
import logging
import json

logger = logging.getLogger(__name__)

def calculate_similarity_clusters(search_results):
    """Calculate similarity between search results using DBSCAN clustering"""
    try:
        # Debug: Show input structure
        st.write("### Input Data Structure")
        if search_results:
            st.write("Sample search result:")
            st.json(search_results[0])

        # Extract text content
        texts = []
        titles = []
        urls = []
        keywords = []

        # Process each search result
        for search in search_results:
            keyword = search.get('keyword', '')
            st.write(f"Processing keyword: {keyword}")

            for result in search.get('results', []):
                title = result.get('title', '').strip()
                desc = result.get('description', '').strip()
                if title and desc:
                    texts.append(f"{title} {desc}")
                    titles.append(title)
                    urls.append(result.get('url', ''))
                    keywords.append(keyword)

        # Debug: Show extracted text data
        st.write("### Extracted Data")
        st.write(f"Number of documents: {len(texts)}")
        if texts:
            st.write("Sample document:")
            st.write(texts[0])

        if not texts:
            st.error("No valid text content found for clustering")
            return None

        # Calculate TF-IDF
        st.write("### TF-IDF Calculation")
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=100,  # Reduced for debugging
            min_df=1,
            max_df=0.9
        )
        tfidf_matrix = vectorizer.fit_transform(texts)
        st.write(f"TF-IDF Matrix Shape: {tfidf_matrix.shape}")

        # Calculate normalized similarity matrix
        similarity_matrix = cosine_similarity(tfidf_matrix)
        # Ensure similarity values are between 0 and 1
        similarity_matrix = np.clip(similarity_matrix, 0, 1)

        st.write("### Similarity Matrix")
        st.write("Sample similarities (first 3x3):")
        st.dataframe(pd.DataFrame(similarity_matrix[:3, :3]))

        # Convert to distance matrix with proper normalization
        distance_matrix = np.clip(1 - similarity_matrix, 0, 1)

        # Cluster the documents
        st.write("### Clustering Process")
        eps = 0.7  # Increased threshold for more inclusive clusters
        min_samples = 2  # Minimum points per cluster
        st.write(f"DBSCAN parameters: eps={eps}, min_samples={min_samples}")

        clustering = DBSCAN(
            eps=eps,
            min_samples=min_samples,
            metric='precomputed'
        )
        cluster_labels = clustering.fit_predict(distance_matrix)

        # Analyze clusters
        unique_clusters = np.unique(cluster_labels)
        st.write(f"Number of clusters: {len(unique_clusters[unique_clusters != -1])}")
        st.write("Cluster sizes:", np.bincount(cluster_labels[cluster_labels != -1]).tolist())
        st.write("Number of noise points:", np.sum(cluster_labels == -1))

        # Calculate cluster probabilities with normalization
        probabilities = np.zeros(len(texts))
        for i in range(len(texts)):
            similar_docs = similarity_matrix[i] > 0.3
            probabilities[i] = np.clip(np.mean(similarity_matrix[i][similar_docs]), 0.1, 1.0)

        # Generate 2D coordinates
        st.write("### Generating Visualization Coordinates")
        mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
        coordinates = mds.fit_transform(distance_matrix)

        st.write("Sample coordinates (first 3 points):")
        coord_df = pd.DataFrame(
            coordinates[:3], 
            columns=['x', 'y']
        )
        st.dataframe(coord_df)

        # Scale coordinates
        x_min, x_max = np.min(coordinates[:, 0]), np.max(coordinates[:, 0])
        y_min, y_max = np.min(coordinates[:, 1]), np.max(coordinates[:, 1])
        x_scale = 800 / (x_max - x_min + 1e-10)
        y_scale = 600 / (y_max - y_min + 1e-10)

        # Create nodes with normalized coordinates
        nodes = []
        for i in range(len(texts)):
            x_coord = (coordinates[i, 0] - x_min) * x_scale
            y_coord = (coordinates[i, 1] - y_min) * y_scale
            nodes.append({
                'id': str(i),
                'title': titles[i],
                'url': urls[i],
                'keyword': keywords[i],
                'x': float(x_coord),
                'y': float(y_coord),
                'cluster': int(cluster_labels[i]),
                'confidence': float(probabilities[i])
            })

        # Create links between similar nodes
        links = []
        for i in range(len(texts)):
            for j in range(i + 1, len(texts)):
                if cluster_labels[i] != -1 and cluster_labels[i] == cluster_labels[j]:
                    sim_value = similarity_matrix[i, j]
                    if sim_value > 0.3:  # Threshold for creating links
                        links.append({
                            'source': str(i),
                            'target': str(j),
                            'value': float(sim_value)
                        })

        st.write("### D3.js Data Summary")
        st.write(f"Number of nodes: {len(nodes)}")
        st.write(f"Number of links: {len(links)}")
        if nodes:
            st.write("Sample node:", nodes[0])
        if links:
            st.write("Sample link:", links[0])

        return {'nodes': nodes, 'links': links}

    except Exception as e:
        logger.error(f"Error in clustering: {str(e)}", exc_info=True)
        st.error(f"Error processing data: {str(e)}")
        return None

def clustered_results(search_results):
    """Main entry point for clustering visualization"""
    st.subheader("Topic Clusters")

    if not search_results:
        st.info("No search results available. Please run a manual search first.")
        return

    st.info("Processing search results for clustering...")
    result = calculate_similarity_clusters(search_results)

    if not result:
        st.error("Failed to generate visualization. Check the debug information above.")
        return

    # Create the visualization
    st.write("### D3.js Visualization")
    st.components.v1.html(f"""
        <div id="cluster-viz" style="width: 100%; height: 600px; border: 1px solid #ddd;"></div>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script>
        (function() {{
            const data = {json.dumps(result)};
            console.log('D3.js data:', data);  // Debug log

            const width = document.getElementById('cluster-viz').offsetWidth;
            const height = 600;

            // Create SVG
            const svg = d3.select('#cluster-viz')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Add zoom behavior
            const g = svg.append('g');
            svg.call(d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([0.1, 4])
                .on('zoom', (event) => g.attr('transform', event.transform)));

            // Create force simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force('link', d3.forceLink(data.links).id(d => d.id))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2));

            // Draw links
            const links = g.append('g')
                .selectAll('line')
                .data(data.links)
                .enter()
                .append('line')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', d => Math.sqrt(d.value));

            // Draw nodes
            const nodes = g.append('g')
                .selectAll('circle')
                .data(data.nodes)
                .enter()
                .append('circle')
                .attr('r', d => Math.sqrt(d.size) * 5)
                .attr('fill', d => d3.schemeCategory10[d.group % 10])
                .call(drag(simulation));

            // Add labels
            const labels = g.append('g')
                .selectAll('text')
                .data(data.nodes)
                .enter()
                .append('text')
                .text(d => d.id)
                .attr('font-size', '12px')
                .attr('dx', 15)
                .attr('dy', 4);

            // Update positions
            simulation.on('tick', () => {
                links
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                nodes
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);

                labels
                    .attr('x', d => d.x)
                    .attr('y', d => d.y);
            });

            // Drag behavior
            function drag(simulation) {
                function dragstarted(event) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }

                function dragged(event) {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                }

                function dragended(event) {
                    if (!event.active) simulation.alphaTarget(0);
                    event.subject.fx = null;
                    event.subject.fy = null;
                }

                return d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended);
            }
        }})();
        </script>
    """, height=600)

            // Force simulation
            const simulation = d3.forceSimulation(data.nodes)
                .force('link', d3.forceLink(data.links).id(d => d.id).distance(50))
                .force('charge', d3.forceManyBody().strength(-100))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collision', d3.forceCollide().radius(d => 5 + d.confidence * 15));

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

    # Add legend
    st.markdown("""
    ### How to Interact:
    - Nodes represent search results
    - Node size indicates relevance
    - Node color represents the cluster
    - Lines show relationships between similar results
    - Hover over nodes to see details
    - Click nodes to open articles
    - Drag to rearrange
    - Scroll to zoom
    """)