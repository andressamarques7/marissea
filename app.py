"""
Marissea — Aplicação Oficial Streamlit
Aesthetic: Quiet Luxury & Old Money Fashion
"""

import os
import sys
import base64
import zipfile
import streamlit as st
import streamlit.components.v1 as components

# Diretório base do script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Auto-descompactação caso o usuário tenha subido o arquivo .zip no GitHub
for item in os.listdir(BASE_DIR):
    if item.endswith(".zip"):
        zip_path = os.path.join(BASE_DIR, item)
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(BASE_DIR)
        except Exception as e:
            pass

def find_file(filename):
    """Busca robusta por arquivos no diretório atual ou subdiretórios."""
    candidates = [
        os.path.join(BASE_DIR, filename),
        os.path.join(BASE_DIR, "marissea", filename),
        os.path.abspath(filename)
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
            
    # Busca recursiva se não encontrado diretamente
    for root, _, files in os.walk(BASE_DIR):
        if os.path.basename(filename) in files:
            return os.path.join(root, os.path.basename(filename))
            
    return ""

def load_file_content(filename):
    file_path = find_file(filename)
    if file_path and os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def get_base64_image(filename):
    file_path = find_file(filename)
    if file_path and os.path.exists(file_path):
        with open(file_path, "rb") as img_file:
            return f"data:image/png;base64,{base64.b64encode(img_file.read()).decode()}"
    return ""

# 1. Configuração da Página Streamlit
logo_icon = find_file("assets/images/logo-navy.png")
st.set_page_config(
    page_title="Marissea — Elegância que transcende temporadas",
    page_icon=logo_icon if logo_icon else "🌊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 2. Injeção de Estilos para Remover Chrome Padrão do Streamlit
st.markdown("""
<style>
    /* Ocultar cabeçalhos, rodapés e margens nativas do Streamlit */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    .block-container {
        padding: 0rem !important;
        margin: 0rem !important;
        max-width: 100% !important;
    }
    
    iframe {
        border: none !important;
        width: 100% !important;
        display: block;
    }
    
    .stDeployButton {display: none;}
</style>
""", unsafe_allow_html=True)

# 3. Roteamento de Visualização (Loja vs Admin)
current_view = "loja"
try:
    if hasattr(st, "query_params"):
        current_view = st.query_params.get("view", "loja")
    else:
        current_view = st.experimental_get_query_params().get("view", ["loja"])[0]
except Exception:
    current_view = "loja"

# Barra Superior / Lateral de Gestão
with st.sidebar:
    st.markdown("### 🌊 Marissea Boutique")
    st.markdown("**Navegação Rápida:**")
    col1, col2 = st.columns(2)
    with col1:
        if st.button("🛍️ Ver Loja", use_container_width=True):
            try:
                st.query_params["view"] = "loja"
            except Exception:
                st.experimental_set_query_params(view="loja")
            st.rerun()
    with col2:
        if st.button("🔒 Admin", use_container_width=True):
            try:
                st.query_params["view"] = "admin"
            except Exception:
                st.experimental_set_query_params(view="admin")
            st.rerun()
    
    st.markdown("---")
    st.markdown("""
    **Acesso Administrativo:**
    * Usuário: `Andressa Marques`
    * Senha: `Andressa2026`
    """)

# 4. Construção do HTML Seguro
is_admin_mode = (current_view == "admin")
base_file = "admin.html" if is_admin_mode else "index.html"
html_content = load_file_content(base_file)

if not html_content:
    st.error(f"⚠️ O arquivo {base_file} não foi localizado na raiz do repositório.")
    st.info(f"Arquivos presentes no servidor: {os.listdir(BASE_DIR)}")
else:
    css = load_file_content("assets/css/style.css")
    store_js = load_file_content("assets/js/store.js")
    script_file = "assets/js/admin.js" if is_admin_mode else "assets/js/app.js"
    custom_js = load_file_content(script_file)
    
    # Inlined Logos
    logo_navy_b64 = get_base64_image("assets/images/logo-navy.png")
    logo_cream_b64 = get_base64_image("assets/images/logo-cream.png")
    
    if logo_navy_b64:
        html_content = html_content.replace('assets/images/logo-navy.png', logo_navy_b64)
    if logo_cream_b64:
        html_content = html_content.replace('assets/images/logo-cream.png', logo_cream_b64)
        
    # Inlined CSS
    if css:
        html_content = html_content.replace(
            '<link rel="stylesheet" href="assets/css/style.css">',
            f'<style>{css}</style>'
        )
        
    # Navegação entre Loja e Admin dentro do iframe
    if not is_admin_mode:
        html_content = html_content.replace('href="admin.html"', 'href="?view=admin" target="_top"')
    else:
        html_content = html_content.replace('href="index.html"', 'href="?view=loja" target="_top"')
        
    # Inlined JS
    if store_js or custom_js:
        js_bundle = f"""
        <script>
        {store_js}
        {custom_js}
        </script>
        """
        if is_admin_mode:
            html_content = html_content.replace('<script src="assets/js/store.js"></script>', '')
            html_content = html_content.replace('<script src="assets/js/admin.js"></script>', js_bundle)
        else:
            html_content = html_content.replace('<script src="assets/js/store.js"></script>', '')
            html_content = html_content.replace('<script src="assets/js/app.js"></script>', js_bundle)

    # 5. Renderizar na tela
    page_height = 3200 if not is_admin_mode else 1800
    components.html(html_content, height=page_height, scrolling=True)
