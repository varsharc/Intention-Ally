import logging
import os
import streamlit as st
from components.keyword_manager import keyword_manager
from components.search_results import search_results
from components.trend_viz import trend_visualization

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

try:
    logger.info("Starting Streamlit application")

    # Page configuration
    st.set_page_config(
        page_title="Intentionly - Search Curate, Track. With Purpose.",
        page_icon="🎯",
        layout="wide"
    )

    def main():
        try:
            # Header
            logger.info("Rendering main application header")
            st.title("Intentionly")
            st.markdown("*Search Curate, Track. With Purpose.*")

            # Main navigation
            logger.info("Setting up navigation tabs")
            tabs = st.tabs(["Keywords", "Search Results", "Trends"])

            with tabs[0]:
                logger.info("Rendering Keywords tab")
                keyword_manager()

            with tabs[1]:
                logger.info("Rendering Search Results tab")
                search_results()

            with tabs[2]:
                logger.info("Rendering Trends tab")
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
            logger.info("Application rendered successfully")
        except Exception as e:
            logger.error(f"Error in main application: {str(e)}", exc_info=True)
            st.error("An error occurred while loading the application. Please check the logs for details.")

    if __name__ == "__main__":
        try:
            logger.info("Starting application on port 5000")
            main()
        except Exception as e:
            logger.error(f"Critical error starting application: {str(e)}", exc_info=True)
except Exception as e:
    logger.error(f"Fatal error in Streamlit initialization: {str(e)}", exc_info=True)
    st.error("A critical error occurred during application startup. Please check the logs for details.")