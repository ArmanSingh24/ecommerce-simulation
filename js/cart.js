// js/cart.js
import { products } from "./data.js";

const CART_KEY = "cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  //to update the cart badge
}


// show the cart items
function renderCart() {
  const container = document.getElementById("cart-items");
  const summaryRows = document.getElementById("summary-rows");
  const totalEl = document.getElementById("summary-total");

  container.innerHTML = "";
  summaryRows.innerHTML = "";

  const cart = readCart();

  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p><a href="index.html">Continue shopping</a></p>
      </div>`;
    totalEl.textContent = "Total: ₹0";
    return;
  }

  let grandTotal = 0;

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image || "assets/img/placeholder.png";
    img.alt = item.name || "";

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("h4");
    title.textContent = item.name;

    const priceP = document.createElement("p");
    priceP.textContent = `Price: ₹${item.price}`;

    const qtyWrap = document.createElement("div");
    qtyWrap.className = "qty-control";

    const btnMinus = document.createElement("button");
    btnMinus.textContent = "-";

    const input = document.createElement("input");
    input.type = "number";
    input.value = Number(item.qty || 1);
    input.min = 1;

    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";

    qtyWrap.appendChild(btnMinus);
    qtyWrap.appendChild(input);
    qtyWrap.appendChild(btnPlus);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginTop = "5px";
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "1px solid #eee";
    removeBtn.style.padding = "6px 8px";
    removeBtn.style.borderRadius = "6px";
    removeBtn.style.cursor = "pointer";

    info.appendChild(title);
    info.appendChild(priceP);
    info.appendChild(qtyWrap);
    info.appendChild(removeBtn);

    const rightDiv = document.createElement("div");
    rightDiv.style.textAlign = "right";
    rightDiv.style.minWidth = "90px";

    const subtotal = Number(item.price) * Number(item.qty || 1);
    rightDiv.innerHTML = `<div style="font-weight:700">₹${subtotal}</div>`;

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(rightDiv);
    container.appendChild(row);

    grandTotal += subtotal;

    btnMinus.addEventListener("click", () => {
      const cartNow = readCart();
      const it = cartNow.find(c => c.id === item.id);
      if (!it) return;

      it.qty = Math.max(1, Number(it.qty) - 1);
      writeCart(cartNow);
      renderCart();
    });

    btnPlus.addEventListener("click", () => {
      const cartNow = readCart();
      const it = cartNow.find(c => c.id === item.id);
      if (!it) return;

      it.qty = Number(it.qty) + 1;
      writeCart(cartNow);
      renderCart();
    });

    input.addEventListener("change", () => {
      const cartNow = readCart();
      const it = cartNow.find(c => c.id === item.id);
      if (!it) return;

      let v = parseInt(input.value, 10);
      if (!v || v < 1) v = 1;

      it.qty = v;
      writeCart(cartNow);
      renderCart();
    });

    removeBtn.addEventListener("click", () => {
      let cartNow = readCart();
      cartNow = cartNow.filter(c => c.id !== item.id);
      writeCart(cartNow);
      renderCart();
    });
  });

  totalEl.textContent = `Total: ₹${grandTotal}`;
}



// CHECKOUT REDIRECT
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.getElementById("btn-checkout")?.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });

  // clear cart
  document.getElementById("btn-clear")?.addEventListener("click", () => {
    if (confirm("Clear the cart?")) {
      writeCart([]);
      renderCart();
    }
  });
});
