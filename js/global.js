const CART_KEY = "cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;

  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  badge.textContent = `(${total})`;
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
window.addEventListener("load", () => {
  document.body.classList.add("appear");
});