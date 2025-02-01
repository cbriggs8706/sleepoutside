import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

export default async function productList(selector, category) {
  const container = document.querySelector(selector);
  const products = await getData(category);
  const filteredProducts = filterTents(products);
  renderListWithTemplate(productCardTemplate, container, filteredProducts);
}

function filterTents(products) {
  const tentIds = ["880RR", "985RF", "985PR", "344YJ"];
  return products.filter((product) => tentIds.includes(product.Id));
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
    <img
      src="${product.Image}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`;
}
