export function initCustomSelect() {
  // Container do custom select
  const customSelect = document.querySelector(".custom-select");

  // Elemento visível que o usuário clica para abrir o menu
  const trigger = document.querySelector(".custom-select-trigger");

  // Lista de opções dentro do menu customizado
  const options = document.querySelectorAll(".custom-options li");

  // Select original oculto que armazena o valor selecionado
  const hiddenSelect = document.querySelector(".hidden-select");

  trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  // Adiciona evento de clique para cada opção
  options.forEach((option) => {
    option.addEventListener("click", () => {
      // Mostra o texto da opção escolhida no botão (trigger)
      trigger.textContent = option.textContent;

      // Atualiza o valor do select oculto
      hiddenSelect.value = option.dataset.value;

      // Remove a classe 'selected' de todas as opções
      options.forEach((o) => o.classList.remove("selected"));

      // Adiciona a classe 'selected' à opção clicada
      option.classList.add("selected");

      // Fecha o dropdown após a seleção
      customSelect.classList.remove("open");
    });
  });

  // Fecha o dropdown automaticamente quando o usuário clica fora dele.
  document.addEventListener("click", function (e) {
    // Verifica se o clique foi fora do custom select
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
}