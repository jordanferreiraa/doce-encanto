// Abre/fecha accordion
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector(".accordion-icon");
  content.classList.toggle("open");
  icon.classList.toggle("rotated");
}

// Seleciona tamanho e atualiza preço exibido
function selectSize(btn) {
  const group = btn.parentElement;
  group
    .querySelectorAll(".size-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");

  // Extrai o preço do label do botão: "100g · R$ 22,99"
  const label = btn.textContent.trim();
  const priceStr = label.split("·")[1]?.trim() || "";
  const priceDisplay = btn
    .closest(".flavor-info")
    .querySelector(".price-display");
  if (priceDisplay) priceDisplay.textContent = priceStr;
}

// Adicionar ao carrinho (hook para sua lógica existente)
function addToCart(btn) {
  const card = btn.closest(".flavor-card");
  const flavorName = card.querySelector(".display-font").textContent.trim();
  const selectedBtn = card.querySelector(".size-btn.selected");
  const label = selectedBtn ? selectedBtn.textContent.trim() : "";
  const size = label.split("·")[0]?.trim() || "";
  const priceRaw =
    label.split("·")[1]?.trim().replace("R$ ", "").replace(",", ".") || "0";

  // Dispara evento customizável para integrar com seu carrinho
  document.dispatchEvent(
    new CustomEvent("addToCart", {
      detail: { name: `${flavorName} ${size}`, price: parseFloat(priceRaw) },
    }),
  );

  // Feedback visual no botão
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-check"></i> Adicionado!';
  btn.style.background = "#4a7c59";
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = "";
  }, 1500);
}

// Exemplo: escutar o evento de carrinho
document.addEventListener("addToCart", (e) => {
  console.log("Carrinho:", e.detail);
});
