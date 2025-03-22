import streamlit as st
import pandas as pd
import numpy as np

# Set page title
st.title('Data Visualization Demo')

# Add controls
num_points = st.slider('Number of points', 10, 1000, 100)
color = st.color_picker('Choose plot color', '#1f77b4')

# Generate sample data
np.random.seed(42)
data = pd.DataFrame({
    'x': np.random.randn(num_points),
    'y': np.random.randn(num_points)
})

# Create scatter plot
st.scatter_chart(
    data,
    x='x',
    y='y',
    color=color
)