# Allie Search Algorithm: Technical Specification (Part 2)

### 2.5 Knowledge Graph Construction

#### 2.5.1 Node Creation
```python
def create_graph_nodes(processed_results):
    nodes = []
    for result in processed_results:
        node = {
            "id": result["id"],
            "title": result["title"],
            "url": result["url"],
            "cluster": result["cluster"],
            "cluster_label": result.get("cluster_label", "Uncategorized"),
            "authority": result["authority_score"],
            "x": result["x"],
            "y": result["y"],
            "date": result["date"],
            "source_type": result["source_type"]
        }
        nodes.append(node)
    return nodes
```

#### 2.5.2 Edge Creation
```python
def create_graph_edges(processed_results, similarity_threshold=0.6):
    edges = []
    
    # Calculate cosine similarity between all pairs
    for i in range(len(processed_results)):
        for j in range(i+1, len(processed_results)):
            similarity = cosine_similarity(
                processed_results[i]["embedding"],
                processed_results[j]["embedding"]
            )
            
            if similarity > similarity_threshold:
                edge = {
                    "source": processed_results[i]["id"],
                    "target": processed_results[j]["id"],
                    "weight": float(similarity)
                }
                edges.append(edge)
    
    return edges
```

## 3. Claude Integration

### 3.1 Claude API Configuration

Allie can be configured to use either a self-managed Claude API key or the user's Claude subscription:

```python
def configure_claude_integration(config):
    if config.use_user_claude_subscription:
        # Set up OAuth flow for user's Claude account
        return ClaudeClient(
            auth_type="oauth",
            redirect_uri=config.redirect_uri,
            client_id=config.client_id
        )
    else:
        # Use application's Claude API key
        return ClaudeClient(
            auth_type="api_key",
            api_key=config.claude_api_key
        )
```

### 3.2 Claude Research Prompt Engineering

To get the most accurate and useful results from Claude, Allie uses specialized prompt templates:

```python
def generate_claude_research_prompt(query, params):
    prompt = f"""
    I need comprehensive research on the following topic:
    
    TOPIC: {query}
    
    Requirements:
    1. Focus on {params.domain_template} sources with high credibility
    2. Prioritize information from the past {params.recency_window}
    3. For each finding, include:
       - Source (URL)
       - Publication date
       - Key insights
       - Relevance to the topic
    
    Search specifically for information related to:
    {", ".join(params.keywords)}
    
    Format your findings as:
    [SOURCE TITLE](URL) - DATE
    * Key insight 1
    * Key insight 2
    
    Please ensure all sources are reputable and relevant.
    """
    
    return prompt
```

### 3.3 Result Extraction and Processing

```python
def parse_claude_research_results(response):
    # Extract sources and insights from Claude's response
    source_pattern = r'\[(.*?)\]\((https?://.*?)\) - (.*?)$'
    sources = []
    
    lines = response.split('\n')
    current_source = None
    insights = []
    
    for line in lines:
        source_match = re.match(source_pattern, line)
        if source_match:
            # Save previous source if exists
            if current_source:
                current_source["insights"] = insights
                sources.append(current_source)
                insights = []
            
            # Start new source
            title, url, date = source_match.groups()
            current_source = {
                "title": title,
                "url": url,
                "date": parse_date(date),
                "source": "claude"
            }
        elif line.strip().startswith('*') and current_source:
            insights.append(line.strip()[2:])
    
    # Add the last source
    if current_source:
        current_source["insights"] = insights
        sources.append(current_source)
    
    return sources
```

### 3.4 Claude Topic Summarization

```python
def generate_topic_summary(cluster_results, params):
    # Prepare input for Claude
    sources = []
    for result in cluster_results:
        sources.append(f"Source: {result['title']}\nURL: {result['url']}\nExcerpt: {result['snippet']}\n")
    
    source_text = "\n".join(sources)
    
    prompt = f"""
    Based on the following sources related to {params.topic_name}, provide:
    
    1. A concise summary of the key findings (3-5 sentences)
    2. The main trends or patterns across these sources
    3. Any significant contrasting viewpoints
    
    Sources:
    {source_text}
    
    Focus on extracting the most important insights relevant to the topic.
    """
    
    response = claude_client.complete(
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )
    
    return {
        "summary": response.content.text,
        "source_count": len(cluster_results),
        "generated_at": datetime.now()
    }
```

## 4. Resource Optimization

### 4.1 Caching Strategy

Allie implements sophisticated caching to minimize API usage:

```python
def get_cached_or_search(query, params, cache_ttl=86400):
    # Generate cache key based on query and params
    cache_key = hash_query(query, params)
    
    # Check cache
    cached_result = cache.get(cache_key)
    if cached_result:
        # Check if still fresh
        if time.time() - cached_result["timestamp"] < cache_ttl:
            # Log cache hit for monitoring
            log_cache_hit(query, params)
            return cached_result["data"]
    
    # Cache miss - perform search
    results = perform_search(query, params)
    
    # Store in cache
    cache.set(cache_key, {
        "data": results,
        "timestamp": time.time()
    })
    
    # Log cache miss for monitoring
    log_cache_miss(query, params)
    
    return results
```

### 4.2 Rate Limiting and Quotas

```python
class ResourceQuota:
    def __init__(self, user_id, service, daily_limit):
        self.user_id = user_id
        self.service = service
        self.daily_limit = daily_limit
        self.usage_tracker = {}
    
    def can_use(self, amount=1):
        today = datetime.now().date().isoformat()
        
        # Initialize tracking for today if needed
        if today not in self.usage_tracker:
            self.usage_tracker = {today: 0}  # Reset historical data
        
        # Check if usage would exceed limit
        if self.usage_tracker[today] + amount > self.daily_limit:
            return False
        
        return True
    
    def record_usage(self, amount=1):
        today = datetime.now().date().isoformat()
        
        # Initialize tracking for today if needed
        if today not in self.usage_tracker:
            self.usage_tracker = {today: 0}
        
        # Record usage
        self.usage_tracker[today] += amount
        
        # Log for persistence
        db.usage_logs.insert_one({
            "user_id": self.user_id,
            "service": self.service,
            "amount": amount,
            "timestamp": datetime.now()
        })
        
        return self.usage_tracker[today]
```

### 4.3 Resource Usage Tracking

```python
def track_resource_usage(user_id, operation, params):
    usage_entry = {
        "user_id": user_id,
        "timestamp": datetime.now(),
        "operation": operation,
        "parameters": params,
        "resources": {
            "api_calls": 1,
            "tokens_used": estimate_tokens(params),
            "storage_bytes": estimate_storage(params)
        }
    }
    
    # Store in usage log
    db.usage_logs.insert_one(usage_entry)
    
    # Update user totals
    db.user_usage.update_one(
        {"user_id": user_id},
        {"$inc": {
            "total_api_calls": 1,
            "total_tokens": estimate_tokens(params),
            "total_storage": estimate_storage(params)
        }},
        upsert=True
    )
    
    # Check if any thresholds have been crossed
    check_resource_thresholds(user_id)
```

### 4.4 Alerting and Notifications

```python
def check_resource_thresholds(user_id):
    # Get user's current usage
    usage = db.user_usage.find_one({"user_id": user_id})
    if not usage:
        return
    
    # Get user's limits
    limits = db.user_limits.find_one({"user_id": user_id})
    if not limits:
        limits = db.global_limits.find_one({})  # Use global defaults
    
    # Check if any thresholds have been crossed
    notifications = []
    
    # API calls threshold
    api_calls_percent = (usage["total_api_calls"] / limits["max_api_calls"]) * 100
    if api_calls_percent >= limits["warning_threshold"] and not usage.get("api_threshold_notified"):
        notifications.append({
            "type": "threshold_warning",
            "resource": "api_calls",
            "percentage": api_calls_percent,
            "current": usage["total_api_calls"],
            "limit": limits["max_api_calls"]
        })
        
        # Mark as notified
        db.user_usage.update_one(
            {"user_id": user_id},
            {"$set": {"api_threshold_notified": True}}
        )
    
    # Send notifications if any
    if notifications:
        send_user_notifications(user_id, notifications)
        send_admin_alert(user_id, notifications)
```