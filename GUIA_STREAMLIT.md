# Guia Oficial: Como Publicar a Marissea no Streamlit Cloud

Com este guia simples, você terá um link oficial da internet (ex: `https://marissea.streamlit.app`) funcionando 24 horas por dia, acessível pelo celular, tablet e computador de qualquer pessoa no mundo.

---

## 📁 O que já foi preparado para o Streamlit

Todos os arquivos necessários já estão configurados na pasta `C:\Users\Denise\.gemini\antigravity\scratch\marissea\`:

1. **`app.py`**: O código Python principal que carrega todo o site e o painel administrativo.
2. **`requirements.txt`**: O arquivo que avisa ao Streamlit para instalar o necessário.
3. **`.streamlit/config.toml`**: As configurações visuais de cor (azul-marinho e marfim).
4. **`index.html` e `admin.html`**: O catálogo e o painel CMS.
5. **`assets/`**: As logos oficiais, estilos de luxo e scripts.

---

## 🚀 Passo a Passo para Lançar no Streamlit Cloud (Gratuito)

### Passo 1: Criar um Repositório no GitHub

1. Acesse **[github.com](https://github.com)** (se ainda não tiver conta, crie uma gratuitamente).
2. Clique no botão verde **"New"** (ou **"Novo Repositório"**).
3. Dê um nome ao repositório, por exemplo: `marissea`.
4. Escolha se quer que o código seja **Público** ou **Privado** (ambos funcionam no Streamlit Cloud!).
5. Clique em **"Create repository"**.
6. Na tela seguinte, clique em **"uploading an existing file"** (enviar arquivos existentes).
7. Arraste todos os arquivos da pasta `marissea` para a tela e clique em **"Commit changes"**.

---

### Passo 2: Conectar no Streamlit Cloud

1. Acesse **[share.streamlit.io](https://share.streamlit.io)**.
2. Faça login com a sua conta do GitHub (com apenas 1 clique).
3. Clique no botão azul **"New app"**.
4. Selecione o seu repositório:
   * **Repository:** `seu-usuario/marissea`
   * **Branch:** `main`
   * **Main file path:** `app.py`
   * **App URL (Opcional):** Escolha o nome do seu link! Por exemplo:
     ```text
     marissea.streamlit.app
     ```
     *(ou `marissea-catalogo.streamlit.app`)*
5. Clique em **"Deploy!"**.

---

### Passo 3: Pronto! Seu site está no ar

Em menos de 1 minuto, o Streamlit criará o seu link oficial:
👉 **`https://marissea.streamlit.app`**

* **No Celular:** Basta abrir o link no Safari ou Chrome do celular.
* **No WhatsApp:** Envie o link para clientes ou amigas testarem.
* **No Painel Admin:** Para acessar o painel de administração na internet, basta abrir:
  👉 **`https://marissea.streamlit.app/?view=admin`**
  *(Ou abrir a barra lateral e clicar em "Painel Administrativo")*
  * **Usuário:** `Andressa Marques`
  * **Senha:** `Andressa2026`

---

## 🔒 Privacidade no Streamlit Cloud

* No painel de controle do Streamlit Cloud (em `share.streamlit.io`), você pode clicar nos três pontinhos ao lado do app e ir em **Settings -> Sharing**.
* Se você configurou o repositório como Privado, pode restringir quem pode abrir o app adicionando apenas os e-mails das pessoas autorizadas, ou manter o link acessível para qualquer pessoa que possua o link direto.
