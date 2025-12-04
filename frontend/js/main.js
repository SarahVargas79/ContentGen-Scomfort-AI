/* ==================================================================
   IMPORTS
 ================================================================== */

// Função que faz a chamada ao backend para gerar o conteúdo
import { gerarConteudo } from "./api.js";

// Funções de UI: mostrar carregamento, resultado ou erro
import { showLoading, showOutput, showError, outputContainer } from "./ui.js";

// Função para inicializar o select customizado
import { initCustomSelect } from "./custom-select.js";

// Funções para carregar e preencher exemplos do JSON
import { carregarExemplos, preencherExemplo } from "./exemplos.js";

/* ==================================================================
   CONFIGURAÇÃO GLOBAL
 ================================================================== */

// Torna a função preencherExemplo acessível no escopo global para os botões de exemplo
window.preencherExemplo = (indice) => {
  const tipoConteudo = document.getElementById("tipo_conteudo").value; // pega o tipo de conteúdo selecionado
  const instrucoesInput = document.getElementById("instrucoes"); // pega o textarea de instruções
  preencherExemplo(indice, tipoConteudo, instrucoesInput); // preenche o exemplo correspondente
};

// Referências aos elementos principais do DOM
const gerarBtn = document.getElementById("gerarBtn");
const instrucoesInput = document.getElementById("instrucoes");
const tipoConteudoSelect = document.getElementById("tipo_conteudo");
const numOpcoesInput = document.getElementById("num_opcoes");

/* ==================================================================
   INICIALIZAÇÃO
 ================================================================== */

// Inicializa o select customizado
initCustomSelect();

// Carrega JSON de exemplos
carregarExemplos();

// ==================================================================
// EVENTO PRINCIPAL: GERAR CONTEÚDO
// ==================================================================
gerarBtn.addEventListener("click", async () => {
  // Coleta os valores do formulário
  const instrucoes = instrucoesInput.value.trim();
  const tipo_conteudo = tipoConteudoSelect.value;
  const num_opcoes = parseInt(numOpcoesInput.value);

  // Limpa área de saída antes de gerar novo conteúdo
  outputContainer.innerHTML = "";

  if (!instrucoes) {
    showError("Por favor, insira as instruções do tênis.");
    return;
  }

  // Mostra indicador de carregamento e desativa o botão
  showLoading();
  gerarBtn.disabled = true;

  try {
    // Chama a API para gerar o conteúdo
    const { response, data } = await gerarConteudo({
      instrucoes,
      tipo_conteudo,
      num_opcoes,
    });

    if (!response.ok || data.error) {
      const erro =
        data.error || "Erro desconhecido na comunicação com o backend.";
      showError(`🚨 Erro na Geração: ${erro}`);
      return;
    }
    // 1. Usa *** para separar (evita quebrar parágrafos do mesmo texto)
    const rawOptions = data.content.split("***");

    // 2. Limpa espaços e remove "Opção X" caso a IA teimosamente tenha colocado
    const options = rawOptions
      .map((opt) =>
        opt.replace(/(\*\*|#)?\s*Opção \d+:?\s*(\*\*)?/iy, "").trim()
      )
      .filter((opt) => opt !== "");

    // Cria elementos HTML
    options.forEach((option, index) => {
      const item = document.createElement("div");
      item.className = "output-item";

      // Adiciona o conteúdo limpo
      item.innerHTML = `
        <strong>Opção ${index + 1} (${tipo_conteudo})</strong>
        <p>${option.replace(/\n/g, "<br>")}</p>
      `;

      outputContainer.appendChild(item);
    });

    // Mostra a seção de saída e oculta carregamento
    showOutput();
  } catch (err) {
    showError(
      `🚨 Falha na conexão com o servidor. Verifique se o backend_api.py está rodando na porta 5000. Detalhe: ${err}`
    );
  } finally {
    gerarBtn.disabled = false;
  }
});
