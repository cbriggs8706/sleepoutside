import { loadHeaderFooter } from "./utils.mjs";
import shoppingCart from "./shoppingCart.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  shoppingCart();
});
