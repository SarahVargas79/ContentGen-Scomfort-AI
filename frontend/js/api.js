export const API_URL = "http://127.0.0.1:5000/generate";

export async function gerarConteudo(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
}

/*

Análise de Dados: Explique as funções buscar_dados_produto e buscar_publico_alvo. Diga: "Aqui o código lê os CSVs para descobrir preço, estoque e perfil do cliente antes mesmo de falar com a IA." Essa parte separa, pois são funções separadas?

Prompt Dinâmico (gerar_conteudo_com_gemini): Mostre como você injeta os dados no prompt. Diga: "Não enviamos apenas a pergunta do usuário. Enviamos uma ficha técnica completa oculta para garantir que a IA não alucine preços ou invente detalhes." Deixa mais claro esse ponto.

Endpoints (Flask): Mostre a rota /generate, que é a "porta de entrada" que o site chama. O que seria a "porta de entrada" deixa mais clara essa fala

requirements.txt (As Ferramentas)
Resumo: "A lista de compras do projeto."

Explicação: Lista todas as bibliotecas necessárias para o projeto rodar: Flask (para o site), pandas (para ler os dados/CSVs) e google-genai (para a IA). Sem isso, o código não funciona em outro computador. Aqui esta faltando: flask
flask-cors python-dotenv google-genai pandas  





*/
