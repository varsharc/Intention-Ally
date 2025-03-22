# Intention-Ally: Complete Project Specification

## 1. Executive Summary

Intention-Ally is a sophisticated semantic search and knowledge visualization platform that helps users track specialized topics across the internet with high precision. Unlike traditional search aggregators, Intention-Ally focuses on quality over quantity, using intelligent filtering, semantic clustering, and interactive visualizations to help users discover meaningful connections between information sources.

The platform is designed to:
- Run automated daily searches on user-defined topics using Tavily and/or Claude AI
- Filter results based on source credibility, relevance, and semantic similarity
- Visualize connections between information sources using an interactive knowledge graph
- Track trends over time and provide insights on emerging patterns
- Respect strict resource limitations and provide transparent usage monitoring

## 2. Technical Architecture

### 2.1 Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Frontend** | Next.js (React) | Deployed on Vercel (free tier) |
| **Backend** | FastAPI (Python) | Developed on Replit, deployed to Railway/Render |
| **Database** | Supabase | PostgreSQL-based, free tier |
| **Search API** | Tavily API + Claude | Hybrid approach for deep research |
| **Visualization** | D3.js | Interactive knowledge graph |
| **Scheduling** | GitHub Actions | For daily search automation |
| **Authentication** | Supabase Auth | Simple email/password |

### 2.2 System Architecture Diagram

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────┐
│                 │     │                   │     │                │
│  Next.js UI     │────▶│  FastAPI Backend  │────▶│  Tavily API    │
│  (Vercel)       │◀────│  (Railway/Render) │◀────│  Claude API    │
│                 │     │                   │     │                │
└─────────────────┘     └───────────────────┘     └────────────────┘
         │                        │                       
         │                        │                       
         ▼                        ▼                       
┌─────────────────┐     ┌───────────────────┐            
│                 │     │                   │            
│  D3.js Graph    │     │  Supabase         │            
│  Visualization  │     │  (Database/Auth)  │            
│                 │     │                   │            
└─────────────────┘     └───────────────────┘            
```

### 2.3 Data Flow

1. User configures search parameters (keywords, filters, criteria)
2. GitHub Action triggers a daily search
3. FastAPI backend sends request to Tavily and/or Claude
4. Results are processed, filtered, and clustered
5. Data is stored in Supabase
6. Frontend retrieves and displays data in knowledge graph
7. User interacts with graph and results
8. Usage data is logged for admin monitoring

## 3. User Interface Design

### 3.1 Design Philosophy

The UI will follow a dark-themed, minimalist aesthetic inspired by 99% Invisible and Feedly, using:
- Primary colors: Dark gray (#1C1C1C), Black (#000000), Accent Yellow (#FFCE00)
- Secondary colors: Light gray (#E5E5E5), Medium gray (#808080)
- Typography: System font stack with clear hierarchy
- Generous whitespace and clear visual separation between elements

### 3.2 Core Interface Components

#### 3.2.1 Search Configuration Panel

- **Location**: Top of main content area
- **Components**:
  - Search term input field (supports multiple keywords/phrases)
  - Search template selector with customizable weights
  - Authority threshold slider with detailed tooltip
  - Update frequency selector
  - Advanced parameters accordion panel
  - Save template button

#### 3.2.2 Knowledge Graph Visualization

- **Location**: Center of main content area
- **Components**:
  - Interactive D3.js force-directed graph
  - Nodes representing articles/sources (sized by relevance)
  - Edges representing semantic connections
  - Color coding for source types and relevance
  - Zoom and pan controls
  - Filter controls overlay

#### 3.2.3 Results List Panel

- **Location**: Bottom of main content area
- **Components**:
  - Chronological list of discovered items
  - Each item shows: title, source, authority indicator, timestamp
  - Quick filtering options (by time, by authority)
  - Expandable view for article details

#### 3.2.4 Navigation Sidebar

- **Location**: Left side of interface
- **Components**:
  - Today's discoveries
  - Saved searches
  - Search history
  - User settings
  - Admin panel (if admin user)

### 3.3 User Flows

#### 3.3.1 Creating a New Search

1. User enters keywords in search bar
2. User selects or customizes a search template
3. User adjusts authority threshold and frequency
4. User saves the search configuration
5. System begins tracking the topic

#### 3.3.2 Exploring Results

1. User opens a saved search
2. System displays knowledge graph of discovered information
3. User can:
   - Zoom/pan to explore connections
   - Filter by various criteria
   - Click nodes to view article details
   - Save important findings

#### 3.3.3 Admin Monitoring

1. Admin logs in with special credentials
2. Admin views usage dashboard
3. Admin can:
   - See resource consumption by user/search
   - Set usage limits
   - View system logs
   - Configure system parameters

## 4. "Allie" Search Algorithm Specification

### 4.1 Core Components

The Allie search algorithm consists of several integrated components:

1. **Query Processing**:
   - Expansion of search terms using semantic understanding
   - Identification of key entities and concepts
   - Generation of search variants for comprehensive coverage

2. **Multi-Source Retrieval**:
   - Primary: Tavily API for deep web search
   - Secondary: Claude API for research and summarization
   - Fallback: Direct web scraping for specialized sources

3. **Content Evaluation**:
   - Authority scoring based on domain reputation and content quality
   - Relevance scoring based on semantic similarity to search intent
   - Novelty assessment to prioritize new information

4. **Semantic Clustering**:
   - Vector embedding of content using Sentence Transformers
   - Dimensionality reduction with UMAP
   - Clustering with HDBSCAN
   - Topic modeling for cluster labeling

### 4.2 Authority Scoring Criteria

The authority score (0-100) is calculated using:

- **Domain Credibility** (40%):
  - Top-tier (.edu, .gov): 35-40 points
  - Established organizations (.org): 25-35 points
  - Commercial entities (.com): 10-25 points
  - Other domains: 5-10 points

- **Publication Factors** (30%):
  - Peer-reviewed: +15 points
  - Citations/references: +5-15 points
  - Author credentials: +5-10 points

- **Content Quality** (30%):
  - Comprehensiveness: +5-10 points
  - Data backing: +5-10 points
  - Balanced perspective: +5-10 points

The full scoring formula and detailed explanation will be available via tooltip in the UI.

### 4.3 Claude Integration

Claude can be integrated in two ways:

1. **API-based Integration**:
   - Direct connection to Claude API using user's credentials
   - Sends structured requests for deep research on specific topics
   - Processes and incorporates Claude's responses alongside Tavily results

2. **Query Enhancement**:
   - Uses Claude to improve search queries before sending to Tavily
   - Analyzes results for additional context and connections
   - Generates summaries and insights from discovered content

### 4.4 Clustering and Visualization Algorithm

1. **Text Vectorization**:
   - Convert article text and metadata to vector embeddings
   - Use Sentence Transformers for semantic understanding

2. **Dimensionality Reduction**:
   - Apply UMAP to reduce high-dimensional embeddings
   - Configure parameters for optimal cluster separation

3. **Density-Based Clustering**:
   - Use HDBSCAN to identify natural clusters
   - Allow for noise points (unclustered articles)

4. **Graph Construction**:
   - Nodes = Articles
   - Edges = Semantic similarity (threshold-based)
   - Node size = Authority score
   - Node color = Cluster/topic
   - Cluster label = Generated from common terms

5. **Force-Directed Layout**:
   - Use D3.js force simulation
   - Configure forces for clear cluster visualization
   - Optimize for readability and exploration

## 5. Resource Management & Cost Optimization

### 5.1 Resource Limitations

| Resource | Limit | Monitoring Approach |
|----------|-------|---------------------|
| Tavily API | User-configurable daily limit | Count API calls, log in Supabase |
| Claude API | Rate-limited based on user subscription | Track token usage |
| Supabase | Stay within free tier (500MB) | Monitor DB size daily |
| Vercel | Free tier limits | Static export when possible |
| FastAPI Backend | Minimal compute, sleep when idle | Monitor response times |

### 5.2 Cost Optimization Strategies

1. **Caching Mechanism**:
   - Cache search results for reuse (configurable TTL)
   - Implement LRU cache for frequently accessed content
   - Store embeddings to avoid recomputation

2. **Batched Processing**:
   - Group similar searches to minimize API calls
   - Process in off-peak hours when possible
   - Implement queue system for non-urgent searches

3. **Resource Throttling**:
   - Implement progressive throttling at 75%, 90%, 100% of limits
   - Prioritize critical searches when resources are limited
   - Allow user-configurable resource allocation

4. **Data Lifecycle Management**:
   - Auto-archive older data to compressed storage
   - Implement configurable retention policies
   - Allow user-initiated data cleanup

### 5.3 Admin Monitoring Dashboard

The admin dashboard will provide:

1. **Resource Usage Metrics**:
   - Per-user API call counts
   - Database storage utilization
   - Compute time consumption
   - Bandwidth usage

2. **Cost Projections**:
   - Estimated monthly costs based on current usage
   - Projected costs if usage trends continue
   - Cost breakdown by service

3. **Limit Configuration**:
   - Global limits for all services
   - Per-user allocation controls
   - Notification thresholds
   - Emergency shutoff controls

4. **Usage Patterns**:
   - Time-based usage patterns
   - Most resource-intensive searches
   - User activity heatmap

## 6. Implementation Timeline

### 6.1 Phase 1: Core Infrastructure (Weeks 1-2)

- Set up development environment in Replit
- Implement basic FastAPI backend
- Create Supabase database schema
- Establish API integrations (Tavily, Claude)

### 6.2 Phase 2: Search & Processing (Weeks 3-4)

- Implement Allie search algorithm
- Develop semantic clustering logic
- Create authority scoring system
- Build basic result storage and retrieval

### 6.3 Phase 3: Frontend & Visualization (Weeks 5-6)

- Develop Next.js frontend framework
- Implement D3.js knowledge graph
- Create user interface components
- Establish user authentication

### 6.4 Phase 4: Resource Management & Admin (Weeks 7-8)

- Build resource monitoring system
- Develop admin dashboard
- Implement usage limitations
- Create notification system

### 6.5 Phase 5: Testing & Deployment (Weeks 9-10)

- Comprehensive testing
- Performance optimization
- Documentation
- Production deployment

## 7. Appendix: UI Component Specifications

Detailed specifications for key UI components are provided in the accompanying UI design artifacts.

1. Search Configuration Interface
2. Knowledge Graph Visualization
3. Results List Panel
4. Admin Dashboard
5. Settings & Preferences Panel

Each component is fully described with visual references and interaction specifications.

## 8. Appendix: Technical Implementation Details

### 8.1 Frontend Code Structure

```
/pages
  /index.js         # Main dashboard
  /search/[id].js   # Specific search view
  /admin/index.js   # Admin dashboard
  /settings.js      # User settings
/components
  /SearchConfig     # Search configuration components
  /Graph            # D3.js visualization components
  /Results          # Results list components
  /Admin            # Admin dashboard components
  /common           # Shared UI components
/lib
  /api              # API client functions
  /utils            # Utility functions
  /hooks            # Custom React hooks
/styles             # Global styles and theme
```

### 8.2 Backend Code Structure

```
/app
  /main.py          # FastAPI entry point
  /routers
    /search.py      # Search endpoints
    /users.py       # User management
    /admin.py       # Admin endpoints
  /services
    /search_service.py    # Search logic
    /cluster_service.py   # Clustering logic
    /auth_service.py      # Authentication
  /models
    /search.py      # Search data models
    /user.py        # User data models
  /utils
    /monitoring.py  # Resource monitoring
    /limits.py      # Usage limits
/alembic            # Database migrations
/tests              # Test suite
```

### 8.3 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE
);

-- Search configurations
CREATE TABLE search_configs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  template_type TEXT NOT NULL,
  authority_threshold INTEGER NOT NULL,
  update_frequency TEXT NOT NULL,
  advanced_params JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search results
CREATE TABLE search_results (
  id UUID PRIMARY KEY,
  config_id UUID REFERENCES search_configs(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  snippet TEXT,
  source_domain TEXT,
  authority_score INTEGER,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Result clusters
CREATE TABLE result_clusters (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cluster memberships
CREATE TABLE cluster_memberships (
  cluster_id UUID REFERENCES result_clusters(id),
  result_id UUID REFERENCES search_results(id),
  similarity_score FLOAT,
  PRIMARY KEY (cluster_id, result_id)
);

-- Usage logs
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service TEXT NOT NULL,
  action TEXT NOT NULL,
  resources_consumed JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```