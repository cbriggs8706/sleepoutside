import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default function shoppingCart(selector) {
  const container = document.querySelector(selector);
  const cartItems = getLocalStorage("so-cart");
  renderListWithTemplate(cartItemTemplate, container, cartItems);
}

function getCartItems() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// TODO fix quantity
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="product_pages/index.html?product=${
      item.Id
    }" class="cart-card__image">
      <img src="${item.Image}" alt="Image of ${item.Name}" />
    </a>
    <a href="product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Color || "N/A"}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}
