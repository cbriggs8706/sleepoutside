import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { getParam } from "./utils.mjs";

loadHeaderFooter();
const category = getParam("category");
document.querySelector("#category-name").textContent =
  category || "All Products";

export default productList(".product-list", category);
