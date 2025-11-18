// ------------------------------
// GLOBAL SCRIPTS (JS)
// ------------------------------

// ------------------------------
// AUTO YEAR UPDATE
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ------------------------------
// NAVIGATION HAMBURGER MENU
// ------------------------------
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    navMenu.classList.remove("open");
  }
});

// ------------------------------
// WHATSAPP BUTTON
// ------------------------------
document.getElementById("whatsapp-btn")?.addEventListener("click", () => {
  window.open("https://wa.me/1234567890?text=Hello!%20I%20want%20to%20learn%20more.", "_blank");
});

// ------------------------------
// SCROLL TO TOP BUTTON
// ------------------------------
const scrollBtn = document.getElementById("scroll-top-btn");

document.addEventListener("click", () => {
  scrollBtn.style.display = scrollBtn.style.display === "flex" ? "none" : "flex";
});

scrollBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ------------------------------
// LANGUAGE SWITCHER
// ------------------------------
const langSelect = document.getElementById("language-selector");

if (langSelect) {
  langSelect.addEventListener("change", () => {
    const lang = langSelect.value;

    // Simplest method → redirect to language folder
    window.location.href = `/${lang}/index.html`;
  });
}
