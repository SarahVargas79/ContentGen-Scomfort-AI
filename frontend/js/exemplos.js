//
import { showError } from "./ui.js";

/* ---------------------------------------------------------------------------
 Armazena os exemplos carregados do arquivo JSON.
 Este objeto será preenchido dinamicamente quando carregarExemplos() rodar.
 --------------------------------------------------------------------------- */
export let exemplosData = {};

// Carrega o JSON de exemplos
export function carregarExemplos() {
  return fetch("data/exemplos.json") // Busca o arquivo dentro da pasta /data
    .then((res) => res.json()) // Converte a resposta para JSON
    .then((data) => (exemplosData = data)) // Salva os exemplos carregados
    .catch((err) => {
      console.error("Erro ao carregar exemplos.json:", err);
      showError(
        "Não foi possível carregar os exemplos. Verifique o arquivo data/exemplos.json."
      );
    });
}

// Preenche o campo de instruções com validação
export function preencherExemplo(indice, tipoConteudo, instrucoesInput) {
  // Verifica se existe a categoria de exemplos no JSON
  if (!exemplosData[tipoConteudo]) {
    showError(`Nenhum exemplo encontrado para o tipo "${tipoConteudo}".`);
    return;
  }

  const lista = exemplosData[tipoConteudo];

  // Verifica se o botão pediu um exemplo maior do que o JSON possui
  if (indice >= lista.length) {
    showError(
      `O botão pediu o exemplo ${indice}, mas só existem ${lista.length} exemplos para "${tipoConteudo}".`
    );
    return;
  }

  // Se tudo estiver correto, preenche
  instrucoesInput.value = lista[indice];
}
