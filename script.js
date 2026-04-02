const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

// menu.addEventListener("click", function(event) {

//     let parentButton = event.target.closest(".add-to-cart-btn")

//     if(parentButton) {
//         const name = parentButton.getAttribute("data-name")
//         const price = parseFloat(parentButton.getAttribute("data-price"))

//         addToCart(name, price)
//     }

// })

// function addToCart(name, price) {
//     const existingItem = cart.find(item => item.name === name)

//     if(existingItem) {
//         existingItem.quantity += 1;
//     }else {
//         cart.push({
//             name,
//             price,
//             quantity: 1,
//         })
//     }

//     updateCartModal()
// }

function addToCart(button) {

    const card = button.closest(".flavor-card");

    const name = card.querySelector(".display-font").textContent;

    const sizeContainer = card.querySelector("[data-flavor]");
    const prices = JSON.parse(sizeContainer.getAttribute("data-prices"));

    const selectedBtn = sizeContainer.querySelector(".size-btn.selected");
    const sizeText = selectedBtn.textContent.split("·")[0].trim();

    const price = parseFloat(prices[sizeText]);

    const itemName = `${name} (${sizeText})`;

    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

function selectSize(button) {
    const container = button.parentElement;

    container.querySelectorAll(".size-btn").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");

    // Atualiza o preço exibido
    const prices = JSON.parse(container.getAttribute("data-prices"));
    const sizeText = button.textContent.split("·")[0].trim();
    const newPrice = prices[sizeText];

    const card = container.closest(".flavor-card");
    const priceDisplay = card.querySelector(".price-display");

    priceDisplay.textContent = `R$ ${parseFloat(newPrice).toFixed(2).replace(".", ",")}`;
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    
    if(inputValue !== "") {
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})

checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {

        Toastify({
            text: "Ops o resturante está fechado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Monta os itens no formato desejado
    const cartItems = cart.map((item) => {
        return `${item.quantity} - ${item.name} - R$${item.price}`;
    }).join("\n");

    // Monta a mensagem completa
    const text = 
`Olá, gostaria de realizar o pedido de:

${cartItems}

Meu endereço de entrega:
${addressInput.value}`;

    const message = encodeURIComponent(text);
    const phone = "+5588997397789";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}