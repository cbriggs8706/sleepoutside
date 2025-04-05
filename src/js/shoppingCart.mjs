import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartBadge,
} from "./utils.mjs";

export default function shoppingCart() {
  const cartItems = getLocalStorage("so-cart") || [];
  const container = document.querySelector(".product-list");

  renderListWithTemplate(cartItemTemplate, container, cartItems);

  const total = calculateListTotal(cartItems);
  displayCartTotal(total);

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idToRemove = e.target.dataset.id;
      removeFromCart(idToRemove);
    });
  });

  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const action = e.target.dataset.action;
      changeQuantity(id, action);
    });
  });
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider" data-id="${item.Id}">
    <span class="remove-item" data-id="${item.Id}" title="Remove item">✖</span>
    <a href="/product_pages/index.html?product=${
      item.Id
    }" class="cart-card__image">
      <img src="${item.Images.PrimarySmall}" alt="Image of ${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName || "N/A"}</p>
    <div class="quantity-controls">
      <button class="quantity-btn" data-id="${
        item.Id
      }" data-action="decrease">−</button>
      <span class="quantity-display">${item.Quantity || 1}</span>
      <button class="quantity-btn" data-id="${
        item.Id
      }" data-action="increase">+</button>
    </div>
    <p class="cart-card__price">Price: $${(
      item.FinalPrice * (item.Quantity || 1)
    ).toFixed(2)}</p>
  </li>`;
}

function calculateListTotal(list) {
  if (!list) return 0;
  return list.reduce(
    (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
    0
  );
}

function displayCartTotal(total) {
  const footer = document.querySelector(".cart-footer");
  const totalDisplay = document.querySelector(".cart-total");

  if (total > 0) {
    footer.classList.remove("hide");
    totalDisplay.innerText = `Total: $${total.toFixed(2)}`;
  } else {
    footer.classList.add("hide");
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
  }
}

function removeFromCart(id) {
  let cart = getLocalStorage("so-cart") || [];
  cart = cart.filter((item) => item.Id != id);
  setLocalStorage("so-cart", cart);
  shoppingCart();
  updateCartBadge();
}

function changeQuantity(id, action) {
  let cart = getLocalStorage("so-cart") || [];
  cart = cart.map((item) => {
    if (item.Id == id) {
      let qty = item.Quantity || 1;
      if (action === "increase") qty++;
      if (action === "decrease") qty = Math.max(1, qty - 1);
      item.Quantity = qty;
    }
    return item;
  });
  setLocalStorage("so-cart", cart);
  shoppingCart();
}
