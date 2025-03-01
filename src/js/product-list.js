import productList from "./productList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
const category = getParam("category");
productList(".product-list", category);
// document.querySelector("#category-name").textContent =
//   category || "All Products";

// export default productList(".product-list", category);
