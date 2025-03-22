# Allie Search Algorithm: Technical Specification (Part 1)

## 1. Algorithm Overview

The Allie search algorithm is a sophisticated, AI-powered system designed to discover, filter, and organize high-quality information from the internet based on user-defined search parameters. Unlike traditional search engines that prioritize popularity or recency, Allie focuses on authority, relevance, and contextual relationships between information sources.

## 2. Core Components

### 2.1 Query Construction & Enhancement

Allie transforms user-provided keywords and parameters into sophisticated search queries through:

#### 2.1.1 Semantic Expansion
- Uses NLP to expand search terms with semantically related concepts
- Identifies key entities, attributes, and relationships
- Constructs boolean search queries with appropriate operators (AND, OR, NOT)

```python
def enhance_query(keywords, domain_template):
    # Sample implementation
    expanded_terms = []
    for keyword in keywords:
        # Get semantic variations via embedding similarity
        variations = semantic_model.get_variations(keyword, top_n=3)
        expanded_terms.append(f"({keyword} OR {' OR '.join(variations)})")
    
    # Add domain-specific modifiers based on template
    if "regulatory" in domain_template:
        expanded_terms.append("(regulation OR directive OR policy OR legislation)")
    
    # Combine with appropriate operators
    enhanced_query = " AND ".join(expanded_terms)
    return enhanced_query
```

#### 2.1.2 Template Application
- Applies domain-specific templates (regulatory, academic, technology, market)
- Adds domain-specific terminology and source preferences
- Adjusts query specificity based on authority threshold settings

### 2.2 Multi-Source Search Strategy

Allie uses a hybrid approach with multiple search interfaces:

#### 2.2.1 Primary Search: Tavily API
```python
async def tavily_search(query, search_params):
    response = await tavily_client.search(
        query=query,
        search_depth=search_params.depth,
        include_domains=search_params.trusted_domains,
        exclude_domains=search_params.excluded_domains,
        max_results=search_params.result_count
    )
    return process_tavily_results(response)
```

#### 2.2.2 Deep Research: Claude API
```python
async def claude_research(query, search_params):
    system_prompt = f"""You are a research assistant performing a deep search on: {query}
    Focus on {search_params.domain_template} sources with high authority.
    Provide detailed information with sources."""
    
    response = await claude_client.complete(
        system=system_prompt,
        messages=[{"role": "user", "content": f"Research: {query}"}],
        max_tokens=4000
    )
    
    return extract_sources_from_claude(response)
```

#### 2.2.3 Result Merging
- Combines results from multiple sources
- De-duplicates based on URL and content similarity
- Preserves source attribution for authority scoring

### 2.3 Authority Scoring Engine

The authority scoring system is central to Allie's functionality. It calculates a score (0-100) for each source:

#### 2.3.1 Domain-Based Scoring (40%)
```python
def calculate_domain_score(url):
    domain = extract_domain(url)
    tld = extract_tld(domain)
    
    # Base TLD scoring
    if tld in ['.edu', '.gov']:
        base_score = 40
    elif tld == '.org':
        base_score = 30
    elif tld == '.com':
        base_score = 20
    else:
        base_score = 10
    
    # Apply user domain preferences
    if domain in user_preferences.trusted_domains:
        base_score = min(base_score + 10, 40)
    elif domain in user_preferences.untrusted_domains:
        base_score = max(base_score - 20, 0)
    
    return base_score
```

#### 2.3.2 Publication Factors (30%)
- Source reputation (based on known publishers database)
- Citation count (where available)
- Author credentials (where available)
- Publication date (recency)

#### 2.3.3 Content Quality (30%)
- Text length and comprehensiveness
- Presence of data, references, and citations
- Language complexity and specificity
- Balance of perspectives (for non-factual topics)

```python
def calculate_content_quality_score(content, metadata):
    score = 0
    
    # Text length (0-10 points)
    if len(content) > 5000:
        score += 10
    elif len(content) > 2000:
        score += 7
    elif len(content) > 1000:
        score += 5
    elif len(content) > 500:
        score += 3
    else:
        score += 1
    
    # References (0-10 points)
    reference_count = count_references(content)
    score += min(reference_count, 10)
    
    # Data presence (0-10 points)
    if contains_tables(content):
        score += 5
    if contains_charts(content):
        score += 3
    if contains_statistics(content):
        score += 2
    
    return min(score, 30)  # Cap at 30 points
```

### 2.4 Natural Language Processing Pipeline

#### 2.4.1 Content Processing
```python
def process_content(raw_content):
    # Clean HTML and extract text
    clean_text = html_cleaner.clean(raw_content)
    
    # Extract key information
    title = extract_title(clean_text)
    summary = generate_summary(clean_text)
    keywords = extract_keywords(clean_text)
    entities = extract_entities(clean_text)
    
    # Generate embeddings for similarity comparison
    embedding = sentence_encoder.encode(clean_text)
    
    return {
        "title": title,
        "summary": summary,
        "keywords": keywords,
        "entities": entities,
        "embedding": embedding,
        "full_text": clean_text
    }
```

#### 2.4.2 Semantic Clustering
```python
def cluster_results(processed_results):
    # Extract embeddings
    embeddings = [result["embedding"] for result in processed_results]
    
    # Apply dimensionality reduction
    reduced_embeddings = umap.UMAP(
        n_neighbors=15,
        n_components=2,
        min_dist=0.1
    ).fit_transform(embeddings)
    
    # Apply density-based clustering
    cluster_labels = hdbscan.HDBSCAN(
        min_cluster_size=3,
        min_samples=1,
        metric='euclidean'
    ).fit_predict(reduced_embeddings)
    
    # Assign clusters and 2D coordinates for visualization
    for i, result in enumerate(processed_results):
        result["cluster"] = int(cluster_labels[i]) if cluster_labels[i] >= 0 else None
        result["x"] = float(reduced_embeddings[i][0])
        result["y"] = float(reduced_embeddings[i][1])
    
    return processed_results
```

#### 2.4.3 Cluster Labeling
```python
def label_clusters(clustered_results):
    # Group by cluster
    clusters = {}
    for result in clustered_results:
        if result["cluster"] is not None:
            if result["cluster"] not in clusters:
                clusters[result["cluster"]] = []
            clusters[result["cluster"]].append(result)
    
    # Generate label for each cluster
    for cluster_id, items in clusters.items():
        # Extract all keywords from cluster items
        all_keywords = []
        for item in items:
            all_keywords.extend(item["keywords"])
        
        # Find most common keywords
        keyword_counts = Counter(all_keywords)
        common_keywords = [k for k, v in keyword_counts.most_common(3)]
        
        # Set cluster label
        label = " & ".join(common_keywords)
        
        # Update each item with cluster label
        for item in items:
            item["cluster_label"] = label
    
    return clustered_results
```