import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    localStorage.setItem("hasVisited", "true");
    showRegisterModal();
  }

  setupRegisterModal();
});

function showRegisterModal() {
  const modal = document.getElementById("registerModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function setupRegisterModal() {
  const modal = document.getElementById("registerModal");
  const closeBtn = modal?.querySelector(".close-modal");

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target.id === "registerModal") {
      modal.classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const messageEl = document.getElementById("newsletter-message");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;

      messageEl.textContent = `Thanks for subscribing, ${email}!`;
      messageEl.classList.add("success");

      form.reset();
    });
  }
});
