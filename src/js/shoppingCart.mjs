import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default function shoppingCart() {
  const cartItems = getLocalStorage("so-cart");
  const container = document.querySelector(".product-list");
  renderListWithTemplate(cartItemTemplate, container, cartItems);
  const total = calculateListTotal(cartItems);
  displayCartTotal(total);
}

function displayCartTotal(total) {
  if (total > 0) {
    document.querySelector(".list-footer").classList.remove("hide");
    document.querySelector(".list-total").innerText += ` $${total}`;
  } else {
    document.querySelector(".list-footer").classList.add("hide");
  }
}

function calculateListTotal(list) {
  const amounts = list.map((item) => item.FinalPrice);
  const total = amounts.reduce((sum, item) => sum + item, 0);
  return total;
}

// TODO fix quantity
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${
      item.Id
    }" class="cart-card__image">
      <img src="${item.Images.PrimarySmall}" alt="Image of ${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName || "N/A"}</p>
    <p class="cart-card__quantity">qty: ${item.Quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}
