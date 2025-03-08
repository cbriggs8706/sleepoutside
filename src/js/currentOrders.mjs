import { checkLogin } from "../js/auth.mjs";
import { loadHeaderFooter } from "../js/utils.mjs";
import { getOrders } from "./externalServices.mjs";

loadHeaderFooter();
document.addEventListener("DOMContentLoaded", async () => {
  const token = checkLogin();
  console.log("Token retrieved:", token);
  if (token) {
    await currentOrders("#orders", token);
  }
});

export default async function currentOrders(selector, token) {
  try {
    console.log("Fetching orders...");
    const orders = await getOrders(token);
    console.log("Orders received:", orders);

    const parent = document.querySelector(`${selector} tbody`);
    if (!parent) {
      console.error(`Element ${selector} tbody not found`);
      return;
    }
    console.log("Rendering orders...");
    //TODO remove limit?
    const maxOrders = 50;
    parent.innerHTML = orders.slice(0, maxOrders).map(orderTemplate).join("");
    // parent.innerHTML = orders.map(orderTemplate).join("");
    console.log("Rendering completed");
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

function orderTemplate(order) {
  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  return `<tr><td>${order.id}</td>
  <td>${new Date(order.orderDate).toLocaleDateString("en-US")}</td>
  <td>${itemCount}</td>
  <td>${order.orderTotal}</td></tr>`;
}
