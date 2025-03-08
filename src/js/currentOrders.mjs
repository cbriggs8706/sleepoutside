import { checkLogin } from "../js/auth.mjs";
import { loadHeaderFooter } from "../js/utils.mjs";
import { getOrders } from "./externalServices.mjs";

loadHeaderFooter();
const token = checkLogin();
currentOrders("#orders", token);

export default async function currentOrders(selector, token) {
  try {
    const orders = await getOrders(token);
    const parent = document.querySelector(`${selector} tbody`);
    parent.innerHTML = orders.map(orderTemplate).join("");
  } catch (err) {
    console.log(err);
  }
}

function orderTemplate(order) {
  const itemCount = Array.isArray(order.items) ? order.items.length : 0;
  return `<tr><td>${order.id}</td>
  <td>${new Date(order.orderDate).toLocaleDateString("en-US")}</td>
  <td>${itemCount}</td>
  <td>${order.orderTotal}</td></tr>`;
}
