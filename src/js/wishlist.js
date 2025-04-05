import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  updateCartBadge,
  renderListWithTemplate,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

// Template for rendering wishlist items
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

// Render Wishlist Items
function renderWishlist() {
  const wishlistItems = getLocalStorage("so-wishlist") || [];
  const container = document.querySelector(".wishlist-list");

  renderListWithTemplate(wishlistItemTemplate, container, wishlistItems);

  // Add event listeners for remove and move to cart actions
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
  renderWishlist();
}

function moveToCart(id, wishlistItems) {
  const itemToMove = wishlistItems.find((item) => item.Id === id);
  if (!itemToMove) return;

  let cart = getLocalStorage("so-cart") || [];
  cart.push(itemToMove);
  setLocalStorage("so-cart", cart);

  // Remove from wishlist
  wishlistItems = wishlistItems.filter((item) => item.Id !== id);
  setLocalStorage("so-wishlist", wishlistItems);

  // Update the UI
  renderWishlist();
  updateCartBadge();
  alertMessage(`${itemToMove.NameWithoutBrand} moved to cart!`);
}

document.addEventListener("DOMContentLoaded", renderWishlist);

// TODO

// import {
//   getLocalStorage,
//   setLocalStorage,
//   alertMessage,
//   updateCartBadge,
//   renderListWithTemplate,
//   loadHeaderFooter, // Import this to load header/footer
// } from "./utils.mjs";

// // Call this function to load header and footer
// loadHeaderFooter();

// function wishlistItemTemplate(item) {
//   return `<li class="wishlist-card divider" data-id="${item.Id}">
//     <span class="remove-item" data-id="${item.Id}" title="Remove item">✖</span>
//     <a href="/product_pages/index.html?product=${
//       item.Id
//     }" class="wishlist-card__image">
//       <img src="${item.Images.PrimarySmall}" alt="Image of ${item.Name}" />
//     </a>
//     <a href="/product_pages/index.html?product=${item.Id}">
//       <h2 class="card__name">${item.Name}</h2>
//     </a>
//     <p class="wishlist-card__color">${item.Colors[0]?.ColorName || "N/A"}</p>
//     <p class="wishlist-card__price">Price: $${item.FinalPrice.toFixed(2)}</p>
//     <div class="wishlist-card__buttons">
//       <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
//       <button class="remove-from-wishlist" data-id="${item.Id}">Remove</button>
//     </div>
//   </li>`;
// }

// // Render Wishlist
// function renderWishlist() {
//   const wishlistItems = getLocalStorage("so-wishlist") || [];
//   const container = document.querySelector(".wishlist-list");

//   renderListWithTemplate(wishlistItemTemplate, container, wishlistItems);

//   // Remove item buttons
//   document.querySelectorAll(".remove-item").forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       const idToRemove = e.target.dataset.id;
//       removeFromWishlist(idToRemove);
//     });
//   });

//   // Move item to cart
//   document.querySelectorAll(".move-to-cart").forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       const idToMove = e.target.dataset.id;
//       moveToCart(idToMove);
//     });
//   });
// }

// // Remove from Wishlist
// function removeFromWishlist(id) {
//   let wishlist = getLocalStorage("so-wishlist") || [];
//   wishlist = wishlist.filter((item) => item.Id != id);
//   setLocalStorage("so-wishlist", wishlist);
//   renderWishlist(); // Re-render wishlist
// }

// // Move item to Cart
// function moveToCart(id) {
//   const wishlist = getLocalStorage("so-wishlist") || [];
//   const itemToMove = wishlist.find((item) => item.Id == id);
//   if (!itemToMove) return;

//   let cart = getLocalStorage("so-cart") || [];
//   cart.push(itemToMove);
//   setLocalStorage("so-cart", cart);

//   // Remove from wishlist
//   const updatedWishlist = wishlist.filter((item) => item.Id != id);
//   setLocalStorage("so-wishlist", updatedWishlist);

//   // Update the UI
//   renderWishlist();
//   updateCartBadge();
//   alertMessage(`${itemToMove.NameWithoutBrand} moved to cart!`);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   renderWishlist();
// });
