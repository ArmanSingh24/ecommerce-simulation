// import { products } from "./data.js";

// // Read ?id= from URL
// const urlParams = new URLSearchParams(window.location.search);
// const productId = parseInt(urlParams.get("id"));

// // Target where HTML will be inserted
// const productSection = document.querySelector(".product-section");

// // If no ID or invalid ID → simple fallback message
// if (!productId) {
//     productSection.innerHTML = "<p>Invalid product.</p>";
//     throw new Error("Invalid product ID in URL");
// }

// // Find product by ID
// const product = products.find(p => p.id === productId);

// // If product not found
// if (!product) {
//     productSection.innerHTML = "<p>Product not found.</p>";
//     throw new Error("Product not found");
// }

// // Insert product details into page
// productSection.innerHTML = `
//     <div class="product-left">
//         <img src="${product.image}" alt="${product.name}">
//     </div>

//     <div class="product-right">
//         <h1 class="product-title">${product.name}</h1>
//         <p class="product-category">Category: ${product.category}</p>
//         <h2 class="product-price">₹${product.price}</h2>

//         <p class="product-desc">${product.desc}</p>

//         <div class="product-buttons">
//             <button class="btn-buy">Buy Now</button>
//             <button class="btn-cart">Add to Cart</button>
//         </div>
//     </div>
// `;
import { products } from "./data.js";

/* ===== helpers (cart in localStorage) ===== */
const CART_KEY = "cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  const cart = readCart();
  const totalQty = cart.reduce((s, it) => s + Number(it.qty || 0), 0);
  badge.textContent = `(${totalQty})`;
}

/* ===== product rendering ===== */
const url = new URLSearchParams(window.location.search);
const id = parseInt(url.get("id"), 10);
const root = document.querySelector(".product-section");

if (!root) {
  // If page does not have layout inserted, create one (defensive)
  console.error("product-section element not found");
} else {
  const product = products.find(p => p.id === id);
  if (!product) {
    root.innerHTML = "<div style='padding:40px'>Product not found.</div>";
  } else {
    root.innerHTML = `
      <div class="product-left">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-right">
        <h1 class="product-title">${product.name}</h1>
        <p class="product-category">Category: ${product.category}</p>
        <h2 class="product-price">₹${product.price}</h2>
        <p class="product-desc">${product.desc}</p>

        <div style="margin-top:12px; display:flex; gap:12px; align-items:center;">
          <label style="font-weight:600;">Quantity:</label>
          <input id="prod-qty" type="number" min="1" value="1" style="width:72px;padding:6px;border-radius:6px;border:1px solid #e6e6e6;">
        </div>

        <div class="product-buttons" style="margin-top:14px;">
          <button id="btn-buy" class="btn-buy">Buy Now</button>
          <button id="btn-add" class="btn-cart">Add to Cart</button>
        </div>
      </div>
    `;
    // wire events
    const btnAdd = document.getElementById("btn-add");
    const btnBuy = document.getElementById("btn-buy");
    const qtyInput = document.getElementById("prod-qty");

    function addToCart(productObj, qty = 1) {
      const cart = readCart();
      const existing = cart.find(i => i.id === productObj.id);
      if (existing) {
        existing.qty = Number(existing.qty || 0) + Number(qty || 0);
      } else {
        cart.push({
          id: productObj.id,
          name: productObj.name,
          price: productObj.price,
          image: productObj.image,
          qty: Number(qty || 0)
        });
      }
      writeCart(cart);
      // small human-friendly feedback
      alert(`${qty} x ${productObj.name} added to cart.`);
    }

    btnAdd.addEventListener("click", () => {
      const qty = Math.max(1, Number(qtyInput.value || 1));
      addToCart(product, qty);
    });

    btnBuy.addEventListener("click", () => {
      const qty = Math.max(1, Number(qtyInput.value || 1));
      // set cart to only this product, then go to cart page
      writeCart([{
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty
      }]);
      // navigate to cart page
      window.location.href = "cart.html";
    });

    // initial badge update
    updateCartBadge();
  }
}

updateCartBadge();
