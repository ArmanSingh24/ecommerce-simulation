// 
const CART_KEY = "cart";

// ================= Cart Reading ==================
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

// ================== Cart Badge Update =================
function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;

  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  badge.textContent = `(${total})`;
}

// Run animation
window.addEventListener("load", () => {
  document.body.classList.add("appear");
});

// ================== Component Loader ==================
async function loadComponent(id, file, callback) {
  const element = document.getElementById(id);
  const html = await fetch(file).then(res => res.text());
  element.innerHTML = html;

  if (callback) callback(); // <-- IMPORTANT
}

// load navbar + update cart AFTER it loads
loadComponent("navbar", "components/navbar.html", () => {
  updateCartBadge();   // <-- now navbar exists
});

// Load footer
loadComponent("footer", "components/footer.html");
