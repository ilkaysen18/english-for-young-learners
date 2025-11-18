// Auto-update footer year
function updateYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Modal control (if needed later)
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// WhatsApp message generator
function sendWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// Run essentials on page load
document.addEventListener("DOMContentLoaded", () => {
  updateYear();
});
