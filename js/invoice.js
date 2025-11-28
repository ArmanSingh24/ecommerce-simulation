// js/invoice.js
const ORDERS_KEY = "orders";

function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
  catch (e) { return []; }
}

function rupee(x) { return `₹${Number(x).toFixed(0)}`; }

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("invoice-root");
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order");

  const orders = readOrders();
  const order = orders.find(o => o.id === orderId) || orders[orders.length - 1];

  if (!order) {
    root.innerHTML = `<div style="padding:30px;text-align:center;">Invoice not found.</div>`;
    return;
  }

  // build HTML
  const d = new Date(order.createdAt);
  const dateStr = d.toLocaleString();

  let html = `
    <div class="invoice-head">
      <div>
        <h2>Shop</h2>
        <div class="invoice-meta">Invoice #: <strong>${order.id}</strong></div>
        <div class="invoice-meta">Date: ${dateStr}</div>
      </div>
      <div style="text-align:right">
        <div><strong>${order.customer.name}</strong></div>
        <div class="invoice-meta">${order.customer.address}</div>
        <div class="invoice-meta">${order.customer.phone || ''}</div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
      </thead>
      <tbody>
  `;

  order.items.forEach(it => {
    const subtotal = Number(it.price) * Number(it.qty);
    html += `<tr>
      <td>${it.name}</td>
      <td>${it.qty}</td>
      <td>${rupee(it.price)}</td>
      <td>${rupee(subtotal)}</td>
    </tr>`;
  });

  html += `</tbody></table>`;

  html += `
    <div style="margin-top:14px;">
      <div style="display:flex; justify-content:space-between;"><div>Subtotal</div><div>${rupee(order.subtotal)}</div></div>
      <div style="display:flex; justify-content:space-between;"><div>Shipping</div><div>${rupee(order.shipping)}</div></div>
      <div style="display:flex; justify-content:space-between;"><div>Tip</div><div>${rupee(order.tip)}</div></div>
      <div class="total-row" style="margin-top:8px;">Total: ${rupee(order.total)}</div>
    </div>

    <div class="invoice-actions">
      <button id="btn-print" class="btn btn-print">Print / Save as PDF</button>
      <button id="btn-home" class="btn btn-home">Back to Home</button>
    </div>
  `;

  root.innerHTML = html;

  document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
  });
  document.getElementById("btn-home").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
