import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  shoppingCart("#cart-list");
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

    document.querySelector(".cart-total").innerHTML = `Total: $${total.toFixed(
      2
    )}`;
  } else {
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
