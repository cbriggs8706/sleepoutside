export default function showBreadcrumb({
  type,
  category = "",
  count = 0,
  productName = "",
}) {
  console.log("✅ showBreadcrumb called:", {
    type,
    category,
    count,
    productName,
  });

  const el = document.querySelector("#breadcrumb");
  if (!el) {
    console.warn("🚫 Breadcrumb element not found in DOM");
    return;
  }

  if (type === "home") {
    el.classList.add("hidden");
    return;
  }

  const capCategory = capitalize(category);

  if (type === "list") {
    const capCategory = capitalize(category);
    el.innerHTML = `
      <a href="/product-list/index.html?category=${category.toLowerCase()}">${capCategory}</a> → (${count} items)
    `;
    el.classList.remove("hidden");
  }

  if (type === "product") {
    el.innerHTML = `
      <a href="/">Home</a> → 
      <a href="/product-list/index.html?category=${category.toLowerCase()}">${capCategory}</a> 
      → <strong>${productName}</strong>
    `;
    el.classList.remove("hidden");
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
