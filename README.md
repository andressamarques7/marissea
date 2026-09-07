# Marissea — Catálogo de Alta Moda & Painel de Gestão (CMS)

Bem-vinda ao projeto oficial da **Marissea**, desenvolvido sob a direção estética **Quiet Luxury & Old Money** com inspiração sutil na brisa do litoral mediterrâneo e resorts europeus.

---

## Como Abrir e Visualizar o Site

1. **No seu computador:**
   - Dê um duplo clique no arquivo `index.html` para abrir o site público em qualquer navegador (Google Chrome, Microsoft Edge, Safari, Firefox).
   - Não é necessário instalar programas adicionais nem executar comandos no terminal.
2. **No Painel Administrativo:**
   - Dê um duplo clique em `admin.html` (ou clique no discreto ícone de cadeado no menu do site).

---

## Acesso Administrativo (/admin)

* **URL local:** Abra o arquivo `admin.html` no navegador.
* **Usuário:** `Andressa Marques`
* **Senha:** `Andressa2026`

---

## O que Você Consegue Fazer no Painel Administrativo (Sem Código)

O painel foi construído como um **CMS Visual intuitivo**, pensado para que você gerencie toda a loja sem precisar de programação:

1. **Produtos & Catálogo:**
   * **Adicionar novos modelos** com nome, código REF, categoria, preço opcional, descrição poética e composição de tecidos.
   * **Adicionar fotos** tanto por link direto quanto selecionando arquivos de imagem direto do seu computador.
   * **Efeito Hover:** Defina uma foto principal e uma foto secundária para criar o efeito refinado de troca ao passar o mouse.
   * **Gerenciar tamanhos:** Adicione opções como PP, P, M, G, GG ou numerações personalizadas.
   * **Cartela de cores:** Defina o nome da cor e selecione a tonalidade exata com o conta-gotas/seletor visual.
   * **Destaques:** Marque produtos com selo "Novo" ou "Destaque".
   * **Excluir ou Editar:** Altere qualquer informação de produtos existentes a qualquer instante.

2. **Home & Banners:**
   * Altere a foto principal da campanha da Hero section.
   * Modifique títulos, subtítulos, frases de impacto e texto dos botões.
   * Edite a citação do manifesto no banner azul-marinho.

3. **Categorias:**
   * Crie novas categorias dinâmicas (ex: *Alfaiataria Resort, Linho Belga, Seda Pura*).
   * As novas categorias aparecem instantaneamente nos filtros do catálogo.

4. **Editorial / Journal (Revista Digital da Marca):**
   * Publique matérias de estilo, ensaios e relatos de coleção com fotos de capa e parágrafos estruturados.

5. **Sobre a Marca:**
   * Edite os três parágrafos do manifesto institucional e troque as fotos do ateliê.

6. **Contatos, Concierge & Logos:**
   * Atualize o número de WhatsApp (que reflete automaticamente no botão "Tenho Interesse" das peças).
   * Atualize @ do Instagram, e-mail e endereço da boutique.
   * **Upload da Logo:** Substitua a imagem da logo sempre que desejar.

7. **Backup & Segurança:**
   * Clique em **"Exportar Dados"** para salvar um arquivo `.json` com todos os seus produtos e edições no seu computador.
   * Caso troque de computador, basta clicar em **"Carregar Backup"** para restaurar tudo instantaneamente.

---

## Identidade Visual Aplicada

* **Logo Oficial:** Incorporada com respeito absoluto à caligrafia, proporções e traço fluido original enviado.
* **Paleta de Cores:**
  * **Azul-Marinho Marissea (`#0B2545`)**: Cor principal, vívida e nobre.
  * **Off-White & Marfim (`#FAF8F5`, `#F5EFE6`)**: Bases acolhedoras de linho.
  * **Bege Areia Suave (`#DDD3C4`)**: Acentos neutros elegantes.
  * **Azul Brisa Costeira (`#D7E5EC`)**: Toques sutis nos detalhes.
* **Tipografia:** *Bodoni Moda* e *Cormorant Garamond* (alta costura editorial) combinadas com *Plus Jakarta Sans* (moderna e limpa).

---

## Preparado para o Futuro (E-commerce)

A arquitetura do projeto já possui a modelagem de dados completa para evolução futura:
* Os produtos já possuem identificador único (`id`), código de referência (`ref`), preços unitários (`price`), matriz de tamanhos (`sizes`) e cores (`colors`).
* Para adicionar carrinho de compras, cálculo de frete e checkout de pagamento posteriormente, basta plugar um gateway de pagamento (como Mercado Pago, Stripe ou Pagar.me) e uma API de persistência em nuvem.
