export default async function showAlerts() {
  try {
    const response = await fetch("/json/alerts.json");
    if (!response.ok) throw new Error("Failed to fetch alerts");

    const alerts = await response.json();
    if (alerts.length === 0) return;

    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background || "var(--primary-color)";
      p.style.color = alert.color || "white";
      p.classList.add("alert-item");
      section.appendChild(p);
    });

    const main = document.querySelector("main");
    if (main) {
      main.prepend(section);
    }
  } catch (err) {
    console.error("Alert system failed:", err);
  }
}
