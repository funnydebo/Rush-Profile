import streamlit as st
import streamlit.components.v1 as components
import os
import base64

# Configure page metadata
st.set_page_config(
    page_title="RUSH Club | Yamamah University",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit header, footer, and padding to give a full native website feel
hide_streamlit_style = """
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding-top: 0rem;
        padding-bottom: 0rem;
        padding-left: 0rem;
        padding-right: 0rem;
        max-width: 100%;
    }
    iframe {
        border: none;
        width: 100% !important;
        height: 100vh !important;
    }
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Path to the website directory
current_dir = os.path.dirname(os.path.abspath(__file__))

def read_file(filename):
    path = os.path.join(current_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def get_base64_image(filename):
    path = os.path.join(current_dir, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = f.read()
        ext = filename.split(".")[-1].lower()
        mime = "image/png" if ext == "png" else "image/svg+xml"
        return f"data:{mime};base64,{base64.b64encode(data).decode('utf-8')}"
    return filename

# Read HTML, CSS, JS and Content files
html_content = read_file("index.html")
css_content = read_file("style.css")
script_content = read_file("script.js")
content_js = read_file("content.js")

# Inline CSS
html_content = html_content.replace(
    '<link rel="stylesheet" href="style.css" />',
    f"<style>{css_content}</style>"
)

# Inline JS
html_content = html_content.replace(
    '<script src="content.js"></script>',
    f"<script>{content_js}</script>"
)
html_content = html_content.replace(
    '<script src="script.js"></script>',
    f"<script>{script_content}</script>"
)

# Replace image paths with embedded base64 data URIs so they load properly inside Streamlit
asset_files = [
    "assets/logo.png",
    "assets/sports-placeholder.svg",
    "assets/esports-placeholder.svg",
    "assets/event-gamethon.svg",
    "assets/event-national-day.svg",
    "assets/event-bodymasters.svg",
    "assets/event-placeholder.svg",
    "assets/leader-omar.svg",
    "assets/leader-yousef.svg",
]

for asset in asset_files:
    b64_uri = get_base64_image(asset)
    html_content = html_content.replace(asset, b64_uri)

# Render the self-contained showcase application
components.html(html_content, height=1200, scrolling=True)
