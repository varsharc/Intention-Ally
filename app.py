import streamlit as st

# Configure page
st.set_page_config(
    page_title="Intention-Ally",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply custom CSS for the black, grey, yellow color palette
st.markdown("""
<style>
    /* Dark theme variables - black background with yellow accents */
    :root {
        --primary-color: #FFD700;      /* Yellow */
        --background-color: #121212;   /* Black */
        --secondary-background-color: #242424; /* Dark Grey */
        --text-color: #E0E0E0;         /* Light Grey */
        --font-family: 'Inter', sans-serif;
    }
    
    /* Main background */
    .stApp {
        background-color: var(--background-color);
        color: var(--text-color);
    }
    
    /* Headers */
    h1, h2, h3 {
        color: var(--primary-color) !important;
        font-family: var(--font-family);
    }
    
    /* Card/container elements */
    .stCard, div.block-container {
        background-color: var(--secondary-background-color);
        border-radius: 10px;
        padding: 1rem;
        border-left: 2px solid var(--primary-color);
    }
    
    /* Sidebar */
    .sidebar .sidebar-content {
        background-color: var(--secondary-background-color);
    }
    
    /* Buttons */
    .stButton>button {
        background-color: var(--primary-color);
        color: black;
        font-weight: bold;
    }
    
    /* Search input */
    .stTextInput input {
        border: 2px solid var(--primary-color);
        background-color: var(--secondary-background-color);
        color: var(--text-color);
    }
</style>
""", unsafe_allow_html=True)

# App header
col1, col2 = st.columns([1, 5])
with col1:
    st.image("https://img.icons8.com/ios-filled/50/FFD700/search--v1.png", width=50)
with col2:
    st.title("Intention-Ally")
    st.markdown("*Search Smarter, Stay Focused*")

# Main layout
st.markdown("---")

# Sidebar for filters and advanced options
with st.sidebar:
    st.header("Advanced Filters")
    
    st.subheader("Date Range")
    start_date = st.date_input("Start Date")
    end_date = st.date_input("End Date")
    
    st.subheader("Content Type")
    article = st.checkbox("Articles")
    research = st.checkbox("Research Papers")
    news = st.checkbox("News")
    
    st.subheader("Clustering Method")
    clustering = st.selectbox("Choose Method", ["Semantic Similarity", "Topic Modeling", "Keyword Frequency"])
    
    st.subheader("Sort Results")
    sort_method = st.radio("Sort By", ["Relevance", "Date (Newest)", "Date (Oldest)"])
    
    st.button("Apply Filters")

# Main content area
col1, col2 = st.columns([3, 1])

with col1:
    # Search bar
    st.subheader("Search for Keywords")
    search_query = st.text_input("Enter keywords, topics, or phrases", "carbon insetting")
    col1a, col1b = st.columns([1, 1])
    with col1a:
        st.button("Search")
    with col1b:
        st.button("Save Search")
    
    # Tags
    st.markdown("**Active Tags:** #carbon-insetting #sustainability #climate-action")
    
    # Results
    st.subheader("Search Results")
    
    # Sample results
    for i in range(3):
        with st.container():
            st.markdown(f"""
            <div style='background-color: #242424; padding: 10px; border-radius: 5px; margin-bottom: 10px; border-left: 2px solid #FFD700;'>
                <h3 style='color: #FFD700; margin: 0;'>What is Carbon Insetting? Greener Logistics</h3>
                <p style='color: #A0A0A0; margin: 2px 0;'>www.example.com/sustainability • March, 2023</p>
                <p style='color: #E0E0E0; margin-top: 5px;'>
                Carbon insetting is a carbon management approach where a company invests in GHG reduction activities within its own value chain, 
                unlike offsetting which can happen outside the value chain. This creates shared value and resilience along the company's supply chain.
                </p>
                <div style='display: flex; gap: 10px; margin-top: 5px;'>
                    <span style='background: #333; padding: 2px 8px; border-radius: 3px; font-size: 12px;'>#sustainability</span>
                    <span style='background: #333; padding: 2px 8px; border-radius: 3px; font-size: 12px;'>#supply-chain</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

with col2:
    # Visualizations Section
    st.subheader("Knowledge Graph")
    st.image("https://via.placeholder.com/400x300.png?text=Knowledge+Graph", use_column_width=True)
    
    st.subheader("Trend Analysis")
    st.line_chart({"Topic Frequency": [3, 5, 7, 9, 11, 13, 8]})
    
    st.subheader("Clusters")
    st.image("https://via.placeholder.com/400x200.png?text=Clusters", use_column_width=True)

# Footer
st.markdown("---")
st.markdown("Intention-Ally © 2023 • Developed with Streamlit")