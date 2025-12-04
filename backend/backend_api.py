# ==============================================================================
# PROJETO: ContentGen Scomfort - BACKEND API (Python/Flask)
# FUNÇÃO: Servir a lógica de IA Generativa com DADOS REAIS (Produtos + Clientes)
# ==============================================================================

from flask import Flask, request, jsonify, send_from_directory
# Flask → cria a aplicação web
# request → recebe dados enviados pelo frontend (JSON, formulários, etc.)
# jsonify → envia respostas no formato JSON para o frontend
# send_from_directory → entrega arquivos estáticos (HTML, CSS, JS) do frontend

from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os  # Manipulação de caminhos e variáveis de ambiente
import pandas as pd  # Leitura dos arquivos CSV

# ==============================================================================
# CONFIGURAÇÕES INICIAIS
# ==============================================================================

load_dotenv()  # Carrega variáveis do arquivo .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Pasta do frontend (arquivos estáticos)
app = Flask(__name__, static_folder="../frontend")
CORS(app)

# Permite que o frontend (localhost) acesse o backend sem bloqueio de navegador
CORS(app)

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("⚠️  ERRO: GEMINI_API_KEY não encontrada no .env")

# ==============================================================================
# FUNÇÕES DE ANÁLISE DE PRODUTOS E CLIENTES
# ==============================================================================


# --- FUNÇÃO 1: Identifica o produto na frase ---
def identificar_produto_na_frase(texto_usuario):
    if not texto_usuario:
        return None
    produtos_conhecidos = ["Runner", "Classic", "Slip-on"]
    texto_lower = texto_usuario.lower()
    for produto in produtos_conhecidos:
        if produto.lower() in texto_lower:
            return produto
    return None

# --- FUNÇÃO 2: Busca Dados DETALHADOS (Cores, Nota, Preço) ---
def buscar_dados_produto(nome_produto):
    try:
        df = pd.read_csv("dados/scomfort_produtos.csv", sep=";")

        # Filtra pelo modelo (ignorando maiúsculas)
        df_modelo = df[df['modelo'].str.contains(
            nome_produto, case=False, na=False)]

        if not df_modelo.empty:
            # 1. Pega o preço mais recente (média para evitar erros)
            preco = df_modelo['preco'].iloc[0]

            # 2. Descobre todas as cores únicas disponíveis para este modelo
            cores = ", ".join(df_modelo['cor'].unique())

            # 3. Pega a nota média de avaliação e número de avaliações
            nota = df_modelo['avaliacao_media'].iloc[0]
            total_reviews = df_modelo['num_avaliacoes'].sum()

            # 4. Soma o estoque total
            estoque = df_modelo['estoque_atual'].sum()

            return (f"Modelo: {nome_produto} | Preço: R$ {preco} | "
                    f"Cores Disponíveis: {cores} | "
                    f"Avaliação Clientes: {nota}/5.0 ({total_reviews} votos) | "
                    f"Estoque Total: {estoque} unidades.")
    except Exception as e:
        print(f"Erro ao ler produtos: {e}")

    return "Dados do produto não encontrados."

# --- FUNÇÃO 3: Busca Inteligência de Cliente ---
def buscar_publico_alvo(nome_produto):
    try:
        df = pd.read_csv("dados/scomfort_clientes.csv", sep=";")
        vendas = df[df['modelo_preferido'].str.contains(
            nome_produto, case=False, na=False)]

        if not vendas.empty:
            top_profissao = vendas['profissao'].mode()[0]
            # Extra: descobre o canal de onde eles vêm (Instagram? Google?)
            top_canal = vendas['canal_aquisicao'].mode()[0]

            return f"Quem mais compra: {top_profissao}. Eles chegam via: {top_canal}."
    except Exception as e:
        print(f"Erro ao ler clientes: {e}")
    return "Público variado."

# ==============================================================================
# GERAÇÃO DE CONTEÚDO COM GEMINI
# ==============================================================================


def gerar_conteudo_com_gemini(instrucoes: str, tipo_conteudo: str, num_opcoes: int) -> str:

    nome_produto = identificar_produto_na_frase(instrucoes)

    if nome_produto:
        info_produto = buscar_dados_produto(nome_produto)
        info_cliente = buscar_publico_alvo(nome_produto)
        print(f"✅ Análise Completa: {info_produto} || {info_cliente}")
    else:
        info_produto = "Produto genérico (não identificado nos dados)."
        info_cliente = "Público geral."

    # --- LÓGICA ESPECIAL PARA DESCRIÇÃO COMPLETA ---
    estrutura_extra = ""
    if "Completa" in tipo_conteudo or "Pagina" in tipo_conteudo:
        # Define estrutura para página de produto (sem numerar opções)
        estrutura_extra = """
        ESTRUTURA OBRIGATÓRIA (Siga esta ordem sem numerar os blocos):
        - Título Persuasivo (Use H1 ou destaque)
        - Parágrafo de Introdução (Foco na dor do cliente: {info_cliente})
        - Lista de Benefícios (Use bullet points)
        - Ficha Técnica (inclua as cores disponíveis e detalhes: {info_produto})
        - Call to Action (Preço e encerranmento)
        """
    else:
        estrutura_extra = "Estrutura: Texto fluido, curto e direto para redes sociais/email."

    prompt_template = f"""
    Aja como um Redator Sênior da Scomfort.
    
    DADOS DO PRODUTO: {info_produto}
    PÚBLICO ALVO: {info_cliente}
    
    Tarefa: Criar {num_opcoes} variações de: {tipo_conteudo}.
    Instruções do usuário: "{instrucoes}"
    
    Diretrizes da Marca: Tom moderno, foco em conforto extremo e durabilidade.
    
    {estrutura_extra}
    
    --- REGRAS CRÍTICAS DE FORMATAÇÃO ---
    1. SEPARE as opções EXATAMENTE com '***'.
    2. PROIBIDO escrever "Opção 1", "Opção 2", "Variação 1". 
    3. Comece o texto IMEDIATAMENTE (ex: direto pelo Título).
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash', contents=prompt_template)
        return response.text
    except Exception as e:
        return f"ERRO_API: {e}"

# ==============================================================================
# ROTAS DA API
# ==============================================================================

# Rota raiz - Serve o arquivo index.html do frontend
@app.route('/')
def serve_index():
    return send_from_directory("../frontend", "index.html")


@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory("../frontend", path)

# Rota para gerar conteúdo via IA
@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    instrucoes = data.get('instrucoes', '')
    tipo_conteudo = data.get('tipo_conteudo', 'Descrição Curta')
    num_opcoes = int(data.get('num_opcoes', 3))

    resultado_ia = gerar_conteudo_com_gemini(
        instrucoes, tipo_conteudo, num_opcoes)

    if resultado_ia.startswith("ERRO_API"):
        return jsonify({"error": resultado_ia}), 500

    return jsonify({"content": resultado_ia})

# ==============================================================================
# EXECUÇÃO DO SERVIDOR
# ==============================================================================


if __name__ == '__main__':
    app.run(debug=True, port=5000)  
