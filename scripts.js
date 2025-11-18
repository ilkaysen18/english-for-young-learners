// Global Scripts for English Training Hub

// Auto-update footer year
export function updateYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Modal control
export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// WhatsApp message generator
export function sendWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// Run essentials on page load
document.addEventListener("DOMContentLoaded", () => {
  updateYear();
});
