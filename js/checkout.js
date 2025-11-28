// js/checkout.js
import { products } from "./data.js";

const CART_KEY = "cart";
const ORDERS_KEY = "orders";

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch (e) { return []; }
}
function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
  catch (e) { return []; }
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
  // global.js updates badge
}

// basic shipping fee calc (demo)
function calcShipping(subtotal) {
  if (subtotal >= 2000) return 0;
  return 50; // flat
}

// helper to format rupee
function rupee(x) { return `₹${Number(x).toFixed(0)}`; }

document.addEventListener("DOMContentLoaded", () => {
  const summaryList = document.getElementById("summary-list");
  const subTotalEl = document.getElementById("sub-total");
  const shippingEl = document.getElementById("shipping-fee");
  const tipEl = document.getElementById("tip-amount");
  const grandEl = document.getElementById("grand-total");
  const form = document.getElementById("checkout-form");
  const tipInput = document.getElementById("tip");
  const backBtn = document.getElementById("back-to-cart");

  // render cart summary
  const cart = readCart();
  if (!cart || cart.length === 0) {
    summaryList.innerHTML = `<div class="small">Your cart is empty. <a href="index.html">Continue shopping</a></div>`;
    subTotalEl.textContent = rupee(0);
    shippingEl.textContent = rupee(0);
    tipEl.textContent = rupee(0);
    grandEl.textContent = rupee(0);
    form.querySelectorAll("input,textarea,button").forEach(el => el.disabled = true);
    return;
  }

  let subtotal = 0;
  summaryList.innerHTML = "";
  cart.forEach(it => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const title = document.createElement("div");
    title.innerHTML = `<div style="font-weight:700">${it.name}</div><div class="small">Qty: ${it.qty}</div>`;
    const price = document.createElement("div");
    price.textContent = rupee(Number(it.price) * Number(it.qty));
    row.appendChild(title);
    row.appendChild(price);
    summaryList.appendChild(row);
    subtotal += Number(it.price) * Number(it.qty);
  });

  subTotalEl.textContent = rupee(subtotal);
  const shipping = calcShipping(subtotal);
  shippingEl.textContent = rupee(shipping);
  tipEl.textContent = rupee(0);
  grandEl.textContent = rupee(subtotal + shipping);

  // update totals when tip changes
  tipInput.addEventListener("input", () => {
    let t = Number(tipInput.value || 0);
    if (!t || t < 0) t = 0;
    tipEl.textContent = rupee(t);
    grandEl.textContent = rupee(subtotal + shipping + t);
  });

  // back to cart
  backBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  // Place order handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // gather form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    let tip = Number(tipInput.value || 0);
    if (!tip || tip < 0) tip = 0;

    // simple validation
    if (!name || !address) {
      alert("Please enter your name and address.");
      return;
    }

    // build order
    const orderId = `ORD${Date.now()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: { name, email, phone, address },
      items: cart,
      subtotal: subtotal,
      shipping: shipping,
      tip: tip,
      total: subtotal + shipping + tip,
      payment: "Cash on Delivery"
    };

    // save order into orders array
    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);

    // clear cart
    clearCart();

    // show in-page thank you (replace left column content)
    const leftCol = document.getElementById("left-col");
    leftCol.innerHTML = `
      <div class="thankyou">
        <h2>Thank you for your order!</h2>
        <p class="small">Order ID: <strong>${orderId}</strong></p>
        <p class="small">A confirmation is stored in your browser (demo).</p>
        <div class="thank-actions">
          <button id="open-invoice" class="btn-primary">Open Invoice</button>
          <button id="go-home" class="btn-ghost">Back to Home</button>
        </div>
      </div>
    `;

    // update summary column to show final details (optional)
    tipEl.textContent = rupee(tip);
    grandEl.textContent = rupee(order.total);
    subTotalEl.textContent = rupee(order.subtotal);
    shippingEl.textContent = rupee(order.shipping);

    // thank you buttons
    document.getElementById("open-invoice").addEventListener("click", () => {
      window.open(`invoice.html?order=${orderId}`, "_blank");
    });
    document.getElementById("go-home").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    window.dispatchEvent(new Event("cart-changed"));
  });

});
