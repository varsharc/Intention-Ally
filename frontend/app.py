import os
import sys
import logging
from pathlib import Path

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True
)
logger = logging.getLogger(__name__)

try:
    import streamlit as st

    # First Streamlit command
    st.set_page_config(
        page_title="Intentionly - Search Curate, Track. With Purpose.",
        page_icon="🎯",
        layout="wide",
        initial_sidebar_state="collapsed"
    )

    # Import components after page config
    from frontend.components.keyword_manager import keyword_manager
    from frontend.components.search_results import search_results
    from frontend.components.trend_viz import trend_visualization
    from frontend.components.search_preferences import search_preferences

    def main():
        try:
            # Header with minimal styling
            st.title("Intentionly")
            st.markdown("*Search Curate, Track. With Purpose.*")

            # Main navigation with cleaner layout
            tabs = st.tabs(["Search Results", "Trends", "Keywords", "Preferences"])

            with tabs[0]:
                search_results()

            with tabs[1]:
                trend_visualization()

            with tabs[2]:
                keyword_manager()

            with tabs[3]:
                search_preferences()

            # Footer
            st.markdown("---")
            st.markdown(
                """
                <div style='text-align: center'>
                    <p>Intentionly - Your AI-powered search tracking assistant</p>
                </div>
                """,
                unsafe_allow_html=True
            )

        except Exception as e:
            st.error("An unexpected error occurred")
            logger.error(f"Error in main application: {str(e)}")

    if __name__ == "__main__":
        main()

except Exception as e:
    logger.error(f"Critical error during application startup: {str(e)}")
    sys.exit(1)