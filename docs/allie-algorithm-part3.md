# Allie Search Algorithm: Technical Specification (Part 3)

## 5. Search Execution and Scheduling

### 5.1 Daily Search Execution

```python
async def execute_scheduled_search(search_config_id):
    # Retrieve search configuration
    search_config = await db.search_configs.find_one({"_id": search_config_id})
    if not search_config:
        log_error(f"Search config {search_config_id} not found")
        return
    
    # Check if user has quota available
    user_id = search_config["user_id"]
    quota = ResourceQuota(user_id, "tavily_api", daily_limit=search_config.get("daily_limit", 10))
    
    if not quota.can_use():
        log_warning(f"User {user_id} has exceeded their daily quota for search {search_config_id}")
        return
    
    try:
        # Execute search
        results = await perform_search(
            query=search_config["keywords"],
            params=SearchParams(
                domain_template=search_config["template_type"],
                authority_threshold=search_config["authority_threshold"],
                trusted_domains=search_config.get("trusted_domains", []),
                excluded_domains=search_config.get("excluded_domains", []),
                recency_window=search_config.get("recency_window", "30 days"),
                depth="advanced" if search_config.get("use_deep_search", False) else "basic"
            )
        )
        
        # Process results
        processed_results = process_results(results)
        
        # Store results
        await store_search_results(search_config_id, processed_results)
        
        # Record usage
        quota.record_usage()
        
        # Send notification if configured
        if search_config.get("notify_on_results", False) and len(results) > 0:
            await send_results_notification(user_id, search_config_id, len(results))
        
        log_info(f"Scheduled search {search_config_id} completed successfully with {len(results)} results")
    
    except Exception as e:
        log_error(f"Error executing scheduled search {search_config_id}: {str(e)}")
```

### 5.2 Search Scheduler

```python
async def schedule_daily_searches():
    # Get all search configurations that need to run today
    today = datetime.now().weekday()
    configs = await db.search_configs.find({
        "$or": [
            {"schedule.type": "daily"},
            {"schedule.type": "weekly", "schedule.days": today}
        ],
        "is_active": True
    }).to_list(None)
    
    log_info(f"Scheduling {len(configs)} searches")
    
    for config in configs:
        # Queue the search for execution
        await task_queue.put({
            "type": "scheduled_search",
            "search_config_id": config["_id"],
            "scheduled_time": datetime.now()
        })
    
    log_info("All searches queued successfully")
```

### 5.3 Task Queue Worker

```python
async def task_worker():
    while True:
        try:
            # Get task from queue
            task = await task_queue.get()
            
            # Process based on task type
            if task["type"] == "scheduled_search":
                await execute_scheduled_search(task["search_config_id"])
            elif task["type"] == "generate_summary":
                await generate_cluster_summary(task["cluster_id"])
            # ... other task types
            
            # Mark task as done
            task_queue.task_done()
            
        except Exception as e:
            log_error(f"Error in task worker: {str(e)}")
            
        # Small delay to prevent CPU overload
        await asyncio.sleep(0.1)
```

## 6. Security and Privacy

### 6.1 Data Retention and Cleanup

```python
async def cleanup_old_data():
    """Delete data that has exceeded retention period"""
    now = datetime.now()
    
    # Get all search configs with retention policies
    configs = await db.search_configs.find(
        {"data_retention_days": {"$exists": True, "$ne": None}}
    ).to_list(None)
    
    for config in configs:
        retention_days = config["data_retention_days"]
        cutoff_date = now - timedelta(days=retention_days)
        
        # Delete old results
        result = await db.search_results.delete_many({
            "config_id": config["_id"],
            "discovered_at": {"$lt": cutoff_date}
        })
        
        if result.deleted_count > 0:
            log_info(f"Deleted {result.deleted_count} old results for search config {config['_id']}")
            
            # Also clean up clusters that might be orphaned
            await cleanup_orphaned_clusters()
```

### 6.2 Authentication Wrapper

```python
def authenticate_request(func):
    """Decorator to enforce authentication"""
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        token = auth_header.replace("Bearer ", "")
        
        try:
            # Verify token
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            
            # Check if user exists
            user = await db.users.find_one({"_id": user_id})
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            
            # Add user to request state
            request.state.user = user
            request.state.user_id = user_id
            
            # Execute original function
            return await func(request, *args, **kwargs)
            
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    return wrapper
```

### 6.3 Admin Authorization

```python
def require_admin(func):
    """Decorator to enforce admin permissions"""
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        # Ensure user is set in request state (from authenticate_request)
        if not hasattr(request.state, "user"):
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # Check admin flag
        if not request.state.user.get("is_admin", False):
            raise HTTPException(status_code=403, detail="Admin privileges required")
        
        # Execute original function
        return await func(request, *args, **kwargs)
    
    return wrapper
```

## 7. API Endpoints

### 7.1 Search Configuration Endpoints

```python
@router.post("/search-configs", response_model=SearchConfigResponse)
@authenticate_request
async def create_search_config(request: Request, config: SearchConfigCreate):
    """Create a new search configuration"""
    user_id = request.state.user_id
    
    # Check user's limit on number of search configs
    user_config_count = await db.search_configs.count_documents({"user_id": user_id})
    user_limits = await get_user_limits(user_id)
    
    if user_config_count >= user_limits["max_search_configs"]:
        raise HTTPException(
            status_code=403, 
            detail=f"Maximum number of search configurations ({user_limits['max_search_configs']}) reached"
        )
    
    # Create new config
    new_config = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "name": config.name,
        "keywords": config.keywords,
        "template_type": config.template_type,
        "authority_threshold": config.authority_threshold,
        "update_frequency": config.update_frequency,
        "advanced_params": config.advanced_params.dict() if config.advanced_params else {},
        "created_at": datetime.now(),
        "is_active": True
    }
    
    # Insert into database
    await db.search_configs.insert_one(new_config)
    
    # Schedule initial search if requested
    if config.run_immediately:
        await task_queue.put({
            "type": "scheduled_search",
            "search_config_id": new_config["_id"],
            "scheduled_time": datetime.now()
        })
    
    return new_config
```

### 7.2 Search Results Endpoints

```python
@router.get("/search-results/{config_id}", response_model=List[SearchResult])
@authenticate_request
async def get_search_results(
    request: Request, 
    config_id: str, 
    limit: int = 50, 
    offset: int = 0,
    min_authority: Optional[int] = None,
    cluster_id: Optional[str] = None,
    sort_by: str = "discovered_at",
    sort_order: str = "desc"
):
    """Get search results for a specific configuration"""
    user_id = request.state.user_id
    
    # Verify ownership of the search config
    config = await db.search_configs.find_one({"_id": config_id, "user_id": user_id})
    if not config:
        raise HTTPException(status_code=404, detail="Search configuration not found")
    
    # Build query
    query = {"config_id": config_id}
    
    if min_authority is not None:
        query["authority_score"] = {"$gte": min_authority}
    
    if cluster_id:
        # Get result IDs in the specified cluster
        memberships = await db.cluster_memberships.find(
            {"cluster_id": cluster_id},
            {"result_id": 1}
        ).to_list(None)
        
        result_ids = [m["result_id"] for m in memberships]
        query["_id"] = {"$in": result_ids}
    
    # Sort options
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Fetch results
    results = await db.search_results.find(query) \
        .sort(sort_by, sort_direction) \
        .skip(offset) \
        .limit(limit) \
        .to_list(None)
    
    return results
```

### 7.3 Admin Endpoints

```python
@router.get("/admin/usage-stats", response_model=UsageStatsSummary)
@authenticate_request
@require_admin
async def get_usage_stats(
    request: Request,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user_id: Optional[str] = None
):
    """Get usage statistics for all users or a specific user"""
    # Parse date range
    start = datetime.fromisoformat(start_date) if start_date else datetime.now() - timedelta(days=30)
    end = datetime.fromisoformat(end_date) if end_date else datetime.now()
    
    # Build query
    query = {"timestamp": {"$gte": start, "$lte": end}}
    if user_id:
        query["user_id"] = user_id
    
    # Aggregate usage by service
    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": {
                "user_id": "$user_id",
                "service": "$service"
            },
            "count": {"$sum": 1},
            "resources_consumed": {"$sum": "$resources.api_calls"}
        }},
        {"$group": {
            "_id": "$_id.user_id",
            "services": {
                "$push": {
                    "service": "$_id.service",
                    "count": "$count",
                    "resources": "$resources_consumed"
                }
            },
            "total_operations": {"$sum": "$count"}
        }}
    ]
    
    usage_stats = await db.usage_logs.aggregate(pipeline).to_list(None)
    
    # Format response
    result = {
        "period": {
            "start": start.isoformat(),
            "end": end.isoformat()
        },
        "users": usage_stats
    }
    
    return result
```

## 8. Visualization Data Preparation

### 8.1 Knowledge Graph Data Generator

```python
async def generate_graph_data(config_id, params=None):
    """Generate data for knowledge graph visualization"""
    # Default parameters
    if params is None:
        params = {
            "min_authority": 0,
            "days": 30,
            "similarity_threshold": 0.6,
            "include_unclustered": False
        }
    
    # Get results within timeframe
    cutoff_date = datetime.now() - timedelta(days=params["days"])
    query = {
        "config_id": config_id,
        "discovered_at": {"$gte": cutoff_date}
    }
    
    if params["min_authority"] > 0:
        query["authority_score"] = {"$gte": params["min_authority"]}
    
    # Fetch results
    results = await db.search_results.find(query).to_list(None)
    
    if not results:
        return {"nodes": [], "edges": [], "clusters": []}
    
    # Get cluster information
    cluster_ids = set()
    for result in results:
        if result.get("cluster") is not None:
            cluster_ids.add(result["cluster"])
    
    clusters = await db.result_clusters.find(
        {"_id": {"$in": list(cluster_ids)}}
    ).to_list(None)
    
    # Create nodes
    nodes = []
    for result in results:
        # Skip unclustered results if requested
        if not params["include_unclustered"] and result.get("cluster") is None:
            continue
        
        nodes.append({
            "id": result["_id"],
            "title": result["title"],
            "url": result["url"],
            "cluster": result.get("cluster"),
            "authority": result["authority_score"],
            "x": result.get("x", 0),
            "y": result.get("y", 0),
            "date": result["discovered_at"].isoformat(),
            "source_type": result.get("source_type", "unknown")
        })
    
    # Create edges
    edges = []
    for i, result1 in enumerate(results):
        for j, result2 in enumerate(results[i+1:], i+1):
            # Skip if either result is unclustered and we're not including unclustered
            if not params["include_unclustered"] and (result1.get("cluster") is None or result2.get("cluster") is None):
                continue
            
            # Calculate similarity if not already cached
            similarity = await get_similarity(result1["_id"], result2["_id"])
            
            if similarity >= params["similarity_threshold"]:
                edges.append({
                    "source": result1["_id"],
                    "target": result2["_id"],
                    "weight": similarity
                })
    
    # Format cluster data
    cluster_data = [{
        "id": cluster["_id"],
        "label": cluster["name"],
        "description": cluster.get("description", ""),
        "node_count": sum(1 for node in nodes if node["cluster"] == cluster["_id"])
    } for cluster in clusters]
    
    return {
        "nodes": nodes,
        "edges": edges,
        "clusters": cluster_data
    }
```

### 8.2 Time-Based Visualization Generator

```python
async def generate_trend_data(config_id, params=None):
    """Generate time-based trend visualization data"""
    # Default parameters
    if params is None:
        params = {
            "days": 90,
            "interval": "day",  # day, week, month
            "group_by": "cluster"  # cluster, source_type, authority_range
        }
    
    # Get results within timeframe
    cutoff_date = datetime.now() - timedelta(days=params["days"])
    
    # Build date grouping based on interval
    if params["interval"] == "day":
        date_format = "%Y-%m-%d"
        date_trunc = {"$dateToString": {"format": "%Y-%m-%d", "date": "$discovered_at"}}
    elif params["interval"] == "week":
        date_format = "%G-W%V"  # ISO week
        date_trunc = {"$dateToString": {"format": "%G-W%V", "date": "$discovered_at"}}
    else:  # month
        date_format = "%Y-%m"
        date_trunc = {"$dateToString": {"format": "%Y-%m", "date": "$discovered_at"}}
    
    # Build grouping field
    if params["group_by"] == "cluster":
        group_field = "$cluster"
    elif params["group_by"] == "source_type":
        group_field = "$source_type"
    else:  # authority_range
        group_field = {
            "$switch": {
                "branches": [
                    {"case": {"$gte": ["$authority_score", 80]}, "then": "High (80-100)"},
                    {"case": {"$gte": ["$authority_score", 60]}, "then": "Medium (60-79)"},
                    {"case": {"$gte": ["$authority_score", 40]}, "then": "Low (40-59)"}
                ],
                "default": "Very Low (0-39)"
            }
        }
    
    # Aggregate results
    pipeline = [
        {"$match": {"config_id": config_id, "discovered_at": {"$gte": cutoff_date}}},
        {"$group": {
            "_id": {
                "date": date_trunc,
                "group": group_field
            },
            "count": {"$sum": 1},
            "avg_authority": {"$avg": "$authority_score"}
        }},
        {"$sort": {"_id.date": 1}}
    ]
    
    results = await db.search_results.aggregate(pipeline).to_list(None)
    
    # Format data for visualization
    trend_data = {}
    
    for result in results:
        date = result["_id"]["date"]
        group = result["_id"]["group"] or "Uncategorized"
        
        if date not in trend_data:
            trend_data[date] = {"date": date}
        
        trend_data[date][f"{group}_count"] = result["count"]
        trend_data[date][f"{group}_avg_authority"] = round(result["avg_authority"], 1)
    
    # Convert to list and ensure all dates have entries for all groups
    sorted_data = []
    
    # Get all unique groups
    all_groups = set()
    for result in results:
        group = result["_id"]["group"] or "Uncategorized"
        all_groups.add(group)
    
    # Generate all dates in the range
    all_dates = []
    current = cutoff_date
    today = datetime.now()
    while current <= today:
        if params["interval"] == "day":
            date_str = current.strftime(date_format)
        elif params["interval"] == "week":
            date_str = current.strftime(date_format)
        else:  # month
            date_str = current.strftime(date_format)
        
        all_dates.append(date_str)
        
        # Increment based on interval
        if params["interval"] == "day":
            current += timedelta(days=1)
        elif params["interval"] == "week":
            current += timedelta(days=7)
        else:  # month
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
    
    # Fill in missing data points
    for date in all_dates:
        point = trend_data.get(date, {"date": date})
        
        for group in all_groups:
            if f"{group}_count" not in point:
                point[f"{group}_count"] = 0
            if f"{group}_avg_authority" not in point:
                point[f"{group}_avg_authority"] = 0
        
        sorted_data.append(point)
    
    return {
        "data": sorted_data,
        "groups": list(all_groups)
    }
```

## 9. Error Handling and Logging

### 9.1 Structured Logging

```python
class LogLevel(Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"

async def log_event(level: LogLevel, message: str, metadata: Optional[Dict] = None):
    """Log an event with structured metadata"""
    event = {
        "timestamp": datetime.now().isoformat(),
        "level": level.value,
        "message": message,
        "metadata": metadata or {}
    }
    
    # Print to console in development environment
    if settings.ENVIRONMENT == "development":
        print(f"[{event['level']}] {event['message']}")
        if metadata:
            print(f"  {json.dumps(metadata)}")
    
    # Store in database
    await db.system_logs.insert_one(event)
    
    # Forward to external logging service if configured
    if settings.EXTERNAL_LOGGING_ENABLED:
        await forward_to_external_logging(event)

# Convenience functions
async def log_debug(message: str, metadata: Optional[Dict] = None):
    await log_event(LogLevel.DEBUG, message, metadata)

async def log_info(message: str, metadata: Optional[Dict] = None):
    await log_event(LogLevel.INFO, message, metadata)

async def log_warning(message: str, metadata: Optional[Dict] = None):
    await log_event(LogLevel.WARNING, message, metadata)

async def log_error(message: str, metadata: Optional[Dict] = None):
    await log_event(LogLevel.ERROR, message, metadata)

async def log_critical(message: str, metadata: Optional[Dict] = None):
    await log_event(LogLevel.CRITICAL, message, metadata)
```

### 9.2 Global Exception Handler

```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for all unhandled exceptions"""
    # Generate unique error ID for tracking
    error_id = str(uuid.uuid4())
    
    # Log the error with stack trace
    await log_error(
        f"Unhandled exception: {str(exc)}",
        {
            "error_id": error_id,
            "error_type": type(exc).__name__,
            "path": request.url.path,
            "method": request.method,
            "traceback": traceback.format_exc()
        }
    )
    
    # Return standardized error response
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred",
            "error_id": error_id,
            "type": "server_error"
        }
    )
```

### 9.3 API Error Response Standards

```python
class APIError(Exception):
    """Base class for API errors"""
    def __init__(self, status_code: int, detail: str, error_type: str):
        self.status_code = status_code
        self.detail = detail
        self.error_type = error_type
        super().__init__(self.detail)

class ResourceNotFoundError(APIError):
    """Error raised when a requested resource is not found"""
    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            status_code=404,
            detail=f"{resource_type} with ID {resource_id} not found",
            error_type="resource_not_found"
        )

class AuthorizationError(APIError):
    """Error raised when a user is not authorized to access a resource"""
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(
            status_code=403,
            detail=message,
            error_type="forbidden"
        )

class ValidationError(APIError):
    """Error raised when input validation fails"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=422,
            detail=detail,
            error_type="validation_error"
        )

class RateLimitError(APIError):
    """Error raised when a rate limit is exceeded"""
    def __init__(self, limit: int, reset_at: datetime):
        super().__init__(
            status_code=429,
            detail=f"Rate limit of {limit} requests exceeded",
            error_type="rate_limit_exceeded"
        )
        self.reset_at = reset_at

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    """Handler for API errors"""
    # Log the error
    await log_warning(
        f"API error: {exc.detail}",
        {
            "error_type": exc.error_type,
            "status_code": exc.status_code,
            "path": request.url.path,
            "method": request.method
        }
    )
    
    # Build response
    response = {
        "detail": exc.detail,
        "type": exc.error_type
    }
    
    # Add reset time for rate limit errors
    if isinstance(exc, RateLimitError):
        response["reset_at"] = exc.reset_at.isoformat()
    
    return JSONResponse(
        status_code=exc.status_code,
        content=response
    )
```

## 10. Integration Tests

### 10.1 End-to-End Search Flow Test

```python
@pytest.mark.asyncio
async def test_end_to_end_search_flow():
    """Test the complete search flow from configuration to results"""
    # Create test user
    user_id = str(uuid.uuid4())
    await db.users.insert_one({
        "_id": user_id,
        "email": "test@example.com",
        "is_admin": False,
        "created_at": datetime.now()
    })
    
    # Create search configuration
    config = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "name": "Test Search",
        "keywords": ["python", "programming"],
        "template_type": "academic",
        "authority_threshold": 70,
        "update_frequency": "daily",
        "created_at": datetime.now(),
        "is_active": True
    }
    
    await db.search_configs.insert_one(config)
    
    # Mock search API response
    with patch('services.search_service.tavily_search') as mock_search:
        mock_search.return_value = [
            {
                "title": "Python Programming Guide",
                "url": "https://example.com/python-guide",
                "snippet": "A comprehensive guide to Python programming.",
                "source_domain": "example.com"
            },
            {
                "title": "Advanced Python Techniques",
                "url": "https://example.org/python-advanced",
                "snippet": "Advanced programming techniques in Python.",
                "source_domain": "example.org"
            }
        ]
        
        # Execute search
        await execute_scheduled_search(config["_id"])
    
    # Verify results were stored
    results = await db.search_results.find({"config_id": config["_id"]}).to_list(None)
    assert len(results) == 2
    
    # Verify correct processing
    assert all("authority_score" in result for result in results)
    assert all("processed_at" in result for result in results)
    
    # Verify clustering was performed
    cluster_ids = set(result.get("cluster") for result in results if result.get("cluster") is not None)
    assert len(cluster_ids) > 0
    
    # Clean up test data
    await db.users.delete_one({"_id": user_id})
    await db.search_configs.delete_one({"_id": config["_id"]})
    await db.search_results.delete_many({"config_id": config["_id"]})
    for cluster_id in cluster_ids:
        await db.result_clusters.delete_one({"_id": cluster_id})
```
