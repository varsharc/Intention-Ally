# Intention-Ally Search Intelligence Enhancement v0.2 - Part 2

## IMPORTANT IMPLEMENTATION NOTE
**ATTENTION: These features constitute version 0.2 of Intention-Ally and should ONLY be developed after the base version (v0.1) implementations have been completed in their entirety. This includes all base UI features and the full three-part Allie algorithm outlined in the original specifications. Do NOT begin implementing these advanced functionalities unless explicitly requested by the user.**

## 4. Result Consolidation and Presentation

### 4.1 ML-Based Source Authority Detection

A machine learning approach will be implemented to detect and consolidate results from the same authoritative source:

```python
class SourceAuthorityDetector:
    def __init__(self):
        # Load pre-trained models and embeddings
        self.text_encoder = SentenceTransformer('all-mpnet-base-v2')
        self.source_classifier = load_model('source_authority_classifier.h5')
        self.domain_authority_db = load_domain_authority_database()
        
    def detect_primary_source(self, results_group):
        """Identify the primary authoritative source in a group of related results"""
        # Extract features from each result
        features = []
        for result in results_group:
            # Get text embeddings
            content_embedding = self.text_encoder.encode(result["title"] + " " + result["snippet"])
            
            # Extract domain authority features
            domain_features = self.extract_domain_features(result["source_domain"])
            
            # Combine features
            combined_features = np.concatenate([content_embedding, domain_features])
            features.append(combined_features)
        
        # Predict primary source probability for each result
        primary_probs = self.source_classifier.predict(np.array(features))
        
        # Return result with highest probability of being primary source
        primary_idx = np.argmax(primary_probs)
        
        return {
            "primary_source": results_group[primary_idx],
            "derived_sources": [r for i, r in enumerate(results_group) if i != primary_idx],
            "confidence_score": float(primary_probs[primary_idx])
        }
    
    def extract_domain_features(self, domain):
        """Extract authority features for a given domain"""
        features = []
        
        # Domain TLD type (.gov, .edu, etc.)
        tld = extract_tld(domain)
        tld_encoding = encode_tld_type(tld)
        features.extend(tld_encoding)
        
        # Known authority score from database
        authority_score = self.domain_authority_db.get(domain, 0)
        features.append(authority_score)
        
        # Domain age and other trust metrics
        trust_metrics = calculate_domain_trust_metrics(domain)
        features.extend(trust_metrics)
        
        return np.array(features)
```

### 4.2 Result Grouping and Card Generation

```python
def generate_consolidated_result_cards(search_results, max_cards=10):
    """Generate consolidated result cards from search results"""
    # Step 1: Group results by content similarity using clustering
    similarity_clusters = cluster_by_content_similarity(search_results)
    
    # Step 2: For each cluster, detect primary source
    source_detector = SourceAuthorityDetector()
    consolidated_groups = []
    
    for cluster in similarity_clusters:
        if len(cluster) == 1:
            # Single result, no consolidation needed
            consolidated_groups.append({
                "primary_source": cluster[0],
                "derived_sources": [],
                "references_count": 1
            })
        else:
            # Detect primary/authoritative source
            authority_info = source_detector.detect_primary_source(cluster)
            authority_info["references_count"] = len(cluster)
            consolidated_groups.append(authority_info)
    
    # Step 3: Sort consolidated groups by priority metrics
    sorted_groups = sorted(
        consolidated_groups, 
        key=lambda x: (
            x["primary_source"]["date_published"],  # Recency (default sort)
            x["references_count"],                  # Reference count
            x["primary_source"]["authority_score"]  # Authority score
        ),
        reverse=True
    )
    
    # Step 4: Generate result cards (limit to max_cards)
    result_cards = []
    for group in sorted_groups[:max_cards]:
        card = generate_result_card(group)
        result_cards.append(card)
    
    return result_cards
```

### 4.3 Enhanced Result Card Design

Each result card will include:

```python
def generate_result_card(result_group):
    """Generate a rich result card from a group of related results"""
    primary = result_group["primary_source"]
    derived = result_group["derived_sources"]
    
    # Core card content
    card = {
        "id": generate_unique_id(),
        "title": primary["title"],
        "url": primary["url"],
        "source_name": extract_organization_name(primary["source_domain"]),
        "publication_date": primary["date_published"],
        "snippet": primary["snippet"],
        
        # Tags section (color-coded)
        "tags": {
            # Authority tag (blue scale)
            "authority": {
                "score": primary["authority_score"],
                "label": get_authority_label(primary["authority_score"]),
                "color": get_authority_color(primary["authority_score"])
            },
            
            # Reference count tag (heat scale with emoji)
            "references": {
                "count": len(derived) + 1,
                "label": get_reference_label(len(derived) + 1),
                "color": get_reference_color(len(derived) + 1),
                "emoji": get_reference_emoji(len(derived) + 1)
            },
            
            # Source type tag
            "source_type": {
                "type": get_source_type(primary),
                "label": get_source_type_label(primary),
                "color": get_source_type_color(primary)
            },
            
            # Keyword relevance tags (multiple possible)
            "keywords": generate_keyword_relevance_tags(primary, derived)
        },
        
        # Derived sources summary
        "derived_sources_summary": summarize_derived_sources(derived),
        
        # Original search tags this result matches
        "matching_search_tags": identify_matching_search_tags(primary, derived)
    }
    
    return card
```

## 5. Knowledge Graph and Visual Enhancements

### 5.1 Enhanced Knowledge Graph Integration

The existing knowledge graph visual will be enhanced to highlight consolidated sources:

```python
def enhance_knowledge_graph(graph_data, consolidated_results):
    """Enhance knowledge graph with consolidation information"""
    enhanced_graph = copy.deepcopy(graph_data)
    
    # Create node mapping for quick access
    node_map = {node["id"]: node for node in enhanced_graph["nodes"]}
    
    # For each consolidated result group
    for result_group in consolidated_results:
        primary_id = result_group["primary_source"]["id"]
        derived_ids = [s["id"] for s in result_group["derived_sources"]]
        
        # Enhance primary source node
        if primary_id in node_map:
            node_map[primary_id]["is_primary_source"] = True
            node_map[primary_id]["derived_count"] = len(derived_ids)
            node_map[primary_id]["size_multiplier"] = 1 + (0.2 * len(derived_ids))
            
        # Mark derived source nodes
        for derived_id in derived_ids:
            if derived_id in node_map:
                node_map[derived_id]["is_derived"] = True
                node_map[derived_id]["primary_source_id"] = primary_id
                
        # Add special edges between primary and derived sources
        for derived_id in derived_ids:
            enhanced_graph["edges"].append({
                "source": primary_id,
                "target": derived_id,
                "type": "derivation",
                "style": "dashed",
                "width": 1,
                "color": "#FFD700"  # Yellow for derivation relationships
            })
    
    return enhanced_graph
```

### 5.2 Daily Summary Card

A new component will generate a daily summary from consolidated results:

```python
def generate_daily_summary(consolidated_results, date=None):
    """Generate a summary card for results from a specific date"""
    if date is None:
        date = datetime.now().date()
    
    # Filter results for the specific date
    date_results = [r for r in consolidated_results 
                   if r["primary_source"]["date_published"].date() == date]
    
    if not date_results:
        return None
        
    # Extract key topics from the day's results
    topics = extract_key_topics(date_results)
    
    # Generate concise summary using Claude
    summary_prompt = f"""
    Provide a concise summary (3-5 sentences) of these key developments on {date.strftime('%b %d, %Y')}:
    
    {format_topics_for_summary(topics)}
    
    Focus on the most important patterns, changes, or announcements.
    """
    
    summary_response = claude_client.complete(
        prompt=summary_prompt,
        max_tokens=300
    )
    
    # Create summary card
    summary_card = {
        "date": date.isoformat(),
        "summary_text": summary_response.text,
        "topics": topics,
        "source_count": len(date_results),
        "top_sources": [r["primary_source"]["source_name"] for r in date_results[:3]]
    }
    
    return summary_card
```