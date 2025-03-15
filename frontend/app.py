import streamlit as st

# Set page config must be the first Streamlit command
st.set_page_config(
    page_title="Intentionly - Search Curate, Track. With Purpose.",
    page_icon="🎯",
    layout="wide"
)

import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Now import components after page config
from components.keyword_manager import keyword_manager
from components.search_results import search_results
from components.trend_viz import trend_visualization
from components.search_preferences import search_preferences

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