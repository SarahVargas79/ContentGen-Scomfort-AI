// Elementos da página usados para mostrar carregamento, resultado e erros
export const loadingIndicator = document.getElementById("loading");
export const outputContainer = document.getElementById("outputContainer");
export const errorMessage = document.getElementById("error-message");

// Mostra o indicador de carregamento e esconde o conteúdo e mensagens de erro
export function showLoading() {
  loadingIndicator.classList.remove("hidden"); // Mostrar o indicador de carregamento
  outputContainer.classList.add("hidden"); // Esconder o conteúdo gerado
  errorMessage.classList.add("hidden"); // Esconder mensagens de erro
}

// Mostra o conteúdo gerado e esconde o indicador de carregamento e mensagens de erro
export function showOutput() {
  loadingIndicator.classList.add("hidden"); // Esconder o indicador de carregamento
  errorMessage.classList.add("hidden"); // Esconder mensagens de erro
  outputContainer.classList.remove("hidden"); // Mostrar o conteúdo gerado
}

// Mostra uma mensagem de erro e esconde o indicador de carregamento e o conteúdo
export function showError(message) {
  loadingIndicator.classList.add("hidden");
  outputContainer.classList.add("hidden");
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = message;
}
