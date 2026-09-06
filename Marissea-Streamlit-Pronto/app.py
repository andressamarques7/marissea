"""
Marissea — Aplicação Oficial Streamlit
Aesthetic: Quiet Luxury & Old Money Fashion
"""

import os
import base64
import streamlit as st
import streamlit.components.v1 as components

# 1. Configuração da Página Streamlit
st.set_page_config(
    page_title="Marissea — Elegância que transcende temporadas",
    page_icon="assets/images/logo-navy.png" if os.path.exists("assets/images/logo-navy.png") else "🌊",
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
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        max-width: 100% !important;
    }
    
    iframe {
        border: none !important;
        width: 100% !important;
        display: block;
    }
    
    /* Barra de alternância rápida sutil para Andressa */
    .stDeployButton {display: none;}
</style>
""", unsafe_allow_html=True)

# 3. Funções Auxiliares para Embutir Assets (Garantia de Funcionamento no Streamlit Cloud)
def get_base64_image(image_path):
    if os.path.exists(image_path):
        with open(image_path, "rb") as img_file:
            return f"data:image/png;base64,{base64.b64encode(img_file.read()).decode()}"
    return ""

def load_file_content(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def build_standalone_html(is_admin=False):
    """
    Empacota todo o ecossistema (HTML, CSS, JS, Logos) em um documento autossuficiente
    para execução em tela cheia com 0% de chance de erro de carregamento.
    """
    base_file = "admin.html" if is_admin else "index.html"
    html = load_file_content(base_file)
    css = load_file_content("assets/css/style.css")
    store_js = load_file_content("assets/js/store.js")
    
    script_file = "assets/js/admin.js" if is_admin else "assets/js/app.js"
    custom_js = load_file_content(script_file)
    
    # Imagens das logos em base64
    logo_navy_b64 = get_base64_image("assets/images/logo-navy.png")
    logo_cream_b64 = get_base64_image("assets/images/logo-cream.png")
    
    # Substituir links de assets relativos pelas versões inlined seguras
    if logo_navy_b64:
        html = html.replace('assets/images/logo-navy.png', logo_navy_b64)
    if logo_cream_b64:
        html = html.replace('assets/images/logo-cream.png', logo_cream_b64)
        
    # Injetar CSS inline
    html = html.replace(
        '<link rel="stylesheet" href="assets/css/style.css">',
        f'<style>{css}</style>'
    )
    
    # Ajustar navegação interna do Streamlit
    if not is_admin:
        html = html.replace('href="admin.html"', 'href="?view=admin" target="_top"')
    else:
        html = html.replace('href="index.html"', 'href="?view=loja" target="_top"')
    
    # Injetar scripts JS inline
    js_bundle = f"""
    <script>
    {store_js}
    {custom_js}
    </script>
    """
    
    if is_admin:
        html = html.replace('<script src="assets/js/store.js"></script>', '')
        html = html.replace('<script src="assets/js/admin.js"></script>', js_bundle)
    else:
        html = html.replace('<script src="assets/js/store.js"></script>', '')
        html = html.replace('<script src="assets/js/app.js"></script>', js_bundle)
        
    return html

# 4. Roteamento de Visualização (Loja vs Admin)
# Suporta parâmetro de URL (?view=admin ou ?view=loja)
query_params = st.query_params
current_view = query_params.get("view", "loja")

# Barra Superior Discreta de Gestão no Streamlit (ideal para você alternar quando quiser)
with st.sidebar:
    st.markdown("### 🌊 Marissea Concierge")
    st.markdown("**Navegação Rápida:**")
    if st.button("🛍️ Ver Loja / Catálogo", use_container_width=True):
        st.query_params["view"] = "loja"
        st.rerun()
    if st.button("🔒 Painel Administrativo (/admin)", use_container_width=True):
        st.query_params["view"] = "admin"
        st.rerun()
    
    st.markdown("---")
    st.markdown("""
    **Acesso Admin:**
    - Usuário: `Andressa Marques`
    - Senha: `Andressa2026`
    """)

# 5. Renderização em Alta Fidelidade
is_admin_mode = (current_view == "admin")
rendered_html = build_standalone_html(is_admin=is_admin_mode)

# Altura dinâmica calculada para rolagem suave e sem barras duplicadas
page_height = 2800 if not is_admin_mode else 1600
components.html(rendered_html, height=page_height, scrolling=True)
