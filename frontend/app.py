
import streamlit as st
from components.keyword_manager import keyword_manager
from components.search_results import search_results
from components.trend_viz import trend_visualization
from components.search_preferences import search_preferences

st.set_page_config(
    page_title="Intentionly - Search Curate, Track. With Purpose.",
    page_icon="🎯",
    layout="wide"
)

def main():
    # Header
    st.title("Intentionly")
    st.markdown("*Search Curate, Track. With Purpose.*")

    # Main navigation
    tabs = st.tabs(["Topic Clusters", "Article Explorer", "Search Settings"])

    with tabs[0]:
        trend_visualization()
        keyword_manager()

    with tabs[1]:
        search_results()

    with tabs[2]:
        current_preferences = search_preferences()
        if current_preferences:
            st.info(f"Applying filters: {len(current_preferences['regions'])} regions, "
                   f"{len(current_preferences['content_types'])} content types, "
                   f"timeframe: {current_preferences['time_range']}")

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

if __name__ == "__main__":
    main()
