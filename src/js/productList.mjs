import { getProductsByCategory, getAllProducts } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  updateCartBadge,
} from "./utils.mjs";

let originalProducts = [];

export default async function productList(selector, category, searchTerm = "") {
  const container = document.querySelector(selector);
  let products = [];

  // 1. Fetch appropriate data
  if (searchTerm) {
    products = await getAllProducts(); // search = search across all
  } else if (category) {
    products = await getProductsByCategory(category);
  }

  // 2. Filter search results if applicable
  let filteredProducts = [...products];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProducts = products.filter((product) =>
      product.NameWithoutBrand.toLowerCase().includes(term)
    );
  }

  // 3. Save original list for sorting
  originalProducts = [...filteredProducts];

  // 4. Render
  renderListWithTemplate(productCardTemplate, container, filteredProducts);

  // 5. Update page heading
  document.querySelector(".title").textContent =
    searchTerm && filteredProducts.length === 0
      ? `No results for "${searchTerm}"`
      : searchTerm
      ? `Results for "${searchTerm}"`
      : category || "All Products";

  // 6. Enable sorting
  setupSorting(container);
  return filteredProducts;
}

function setupSorting(container) {
  const select = document.querySelector("#sort-select");
  if (!select) return;

  select.addEventListener("change", () => {
    let sortedProducts = [...originalProducts];
    const option = select.value;

    if (option === "name") {
      sortedProducts.sort((a, b) =>
        a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
      );
    } else if (option === "price") {
      sortedProducts.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }

    renderListWithTemplate(productCardTemplate, container, sortedProducts);
  });
}

function productCardTemplate(product) {
  const original = product.SuggestedRetailPrice;
  const final = product.FinalPrice;
  const hasDiscount = original > final;
  const discountPercent = hasDiscount
    ? Math.round(((original - final) / original) * 100)
    : 0;

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">
        ${
          hasDiscount
            ? `<span class="original-price">$${original.toFixed(2)}</span>`
            : ""
        }
        <span class="final-price">$${final.toFixed(2)}</span>
        ${
          hasDiscount
            ? `<span class="discount-badge">${discountPercent}% OFF</span>`
            : ""
        }
      </p>
    </a>
    <div class="product-card__buttons">
      <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
      <button class="add-to-cart-btn" data-id="${
        product.Id
      }">Add to Cart</button>
    </div>
  </li>`;
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.dataset.id;

    try {
      const product = await findProductById(productId); // <-- Full product object

      if (!product || !product.Id) throw new Error("Product not found");

      let cart = getLocalStorage("so-cart") || [];
      const index = cart.findIndex((item) => item.Id === product.Id);

      if (index > -1) {
        cart[index].Quantity = (cart[index].Quantity || 1) + 1;
      } else {
        product.Quantity = 1;
        cart.push(product);
      }

      setLocalStorage("so-cart", cart);
      alertMessage(`${product.NameWithoutBrand} added to cart!`);
      updateCartBadge();
    } catch (err) {
      console.error("Add to Cart error:", err);
      alertMessage("Sorry, there was an issue adding this product.");
    }
  }
});
