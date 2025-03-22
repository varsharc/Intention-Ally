import os
import sys
import logging
from pathlib import Path

# Configure logging before anything else
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True
)
logger = logging.getLogger(__name__)

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logger.info(f"Adding project root to Python path: {project_root}")
sys.path.insert(0, project_root)

try:
    logger.info("Initializing Streamlit")
    import streamlit as st

    # First Streamlit command
    logger.info("Setting page config")
    st.set_page_config(
        page_title="Intentionly - Search Curate, Track. With Purpose.",
        page_icon="🎯",
        layout="wide"
    )

    # Import and verify backend connectivity
    from frontend.config import verify_backend_connection

    if not verify_backend_connection():
        st.error("Unable to connect to backend service. Please try again later.")
        logger.error("Failed to verify backend connectivity")
        sys.exit(1)

    logger.info("Importing components")
    try:
        from frontend.components.keyword_manager import keyword_manager
        from frontend.components.search_results import search_results
        from frontend.components.trend_viz import trend_visualization
        from frontend.components.search_preferences import search_preferences
        logger.info("Successfully imported all components")
    except ImportError as e:
        logger.error(f"Failed to import components: {str(e)}")
        st.error(f"Failed to load application components: {str(e)}")
        sys.exit(1)

    def main():
        try:
            logger.info("Starting Streamlit application initialization")

            # Header
            st.title("Intentionly")
            st.markdown("*Search Curate, Track. With Purpose.*")

            logger.info("Setting up navigation tabs")
            # Main navigation
            tabs = st.tabs(["Keywords", "Search Preferences", "Search Results", "Trends"])

            with tabs[0]:
                logger.info("Initializing keyword manager")
                keyword_manager()

            with tabs[1]:
                logger.info("Initializing search preferences")
                current_preferences = search_preferences()

            with tabs[2]:
                logger.info("Initializing search results")
                if current_preferences:
                    st.info(f"Applying filters: {len(current_preferences['regions'])} regions, "
                           f"{len(current_preferences['content_types'])} content types, "
                           f"timeframe: {current_preferences['time_range']}")
                search_results()

            with tabs[3]:
                logger.info("Initializing trend visualization")
                trend_visualization()

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
            logger.info("Application initialization completed successfully")
        except Exception as e:
            logger.error(f"Error in main application: {str(e)}")
            st.error(f"An error occurred while loading the application: {str(e)}")

    if __name__ == "__main__":
        main()
except Exception as e:
    logger.error(f"Critical error during application startup: {str(e)}")
    sys.exit(1)