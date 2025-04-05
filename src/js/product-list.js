import productList from "./productList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";
import showAlerts from "./alert.mjs";
import { findProductById } from "./externalServices.mjs";
import showBreadcrumb from "./breadcrumb.js";

// Load shared layout
loadHeaderFooter();
showAlerts();

// Get URL parameters
const category = getParam("category");
const searchTerm = getParam("search");

// Render product list
productList(".product-list", category, searchTerm).then((products) => {
  setupQuickView();

  // Show breadcrumb
  showBreadcrumb({
    type: "list",
    category: category || searchTerm || "All",
    count: products.length,
  });
});

function setupQuickView() {
  const productListElement = document.querySelector(".product-list");
  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.querySelector(".close-modal");

  if (!productListElement || !modal || !closeBtn) return;

  // Handle quick view button click
  productListElement.addEventListener("click", async (e) => {
    const button = e.target.closest(".quick-view-btn");
    if (!button) return;

    const productId = button.dataset.id;
    if (!productId) return;

    try {
      const product = await findProductById(productId);
      showQuickView(product);
    } catch (err) {
      console.error("Quick view failed:", err);
    }
  });

  // Close modal on X click
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal on background click
  modal.addEventListener("click", (e) => {
    if (e.target.id === "quickViewModal") {
      modal.classList.add("hidden");
    }
  });
}

function showQuickView(product) {
  const content = `
    <h2>${product.NameWithoutBrand}</h2>
    <h3>${product.Brand.Name}</h3>
    <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
    <p>${product.DescriptionHtmlSimple}</p>
    <p><strong>Price:</strong> $${product.FinalPrice}</p>
  `;

  document.getElementById("quickViewContent").innerHTML = content;
  document.getElementById("quickViewModal").classList.remove("hidden");
}
