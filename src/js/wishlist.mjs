import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartBadge,
} from "./utils.mjs";

const wishlistItemTemplate = (item) => `
  <li class="cart-card divider" data-id="${item.Id}">
    <span class="remove-item" data-id="${item.Id}" title="Remove item">✖</span>
    <a href="/product_pages/index.html?product=${
      item.Id
    }" class="wishlist-card__image">
      <img src="${item.Images.PrimarySmall}" alt="Image of ${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="wishlist-card__color">${item.Colors[0]?.ColorName || "N/A"}</p>
    <p class="wishlist-card__price">Price: $${item.FinalPrice.toFixed(2)}</p>
    <div class="wishlist-card__buttons">
      <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
    </div>
  </li>
`;

export default function wishlist() {
  const wishlistItems = getLocalStorage("so-wishlist") || [];
  const container = document.querySelector(".wishlist-list");

  renderListWithTemplate(wishlistItemTemplate, container, wishlistItems);

  addEventListeners(wishlistItems);
}

function addEventListeners(wishlistItems) {
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      removeFromWishlist(e.target.dataset.id)
    );
  });

  document.querySelectorAll(".move-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      moveToCart(e.target.dataset.id, wishlistItems)
    );
  });
}

function removeFromWishlist(id) {
  let wishlist = getLocalStorage("so-wishlist") || [];
  wishlist = wishlist.filter((item) => item.Id !== id);
  setLocalStorage("so-wishlist", wishlist);
  wishlist();
}

function moveToCart(id, wishlistItems) {
  const itemToMove = wishlistItems.find((item) => item.Id === id);
  if (!itemToMove) return;

  let cart = getLocalStorage("so-cart") || [];
  cart.push(itemToMove);
  setLocalStorage("so-cart", cart);

  wishlistItems = wishlistItems.filter((item) => item.Id !== id);
  setLocalStorage("so-wishlist", wishlistItems);

  wishlist();
  updateCartBadge();
}
