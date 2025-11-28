import { products } from "./data.js";

// Read ?type= from URL
const urlParams = new URLSearchParams(window.location.search);
const categoryType = urlParams.get("type");

const grid = document.querySelector(".grid");

const titleEl = document.querySelector(".sectiontitle");
const subtitleEl = document.querySelector(".sectionsub");

titleEl.textContent = categoryType
    ? `Products in "${categoryType.toUpperCase()}" Category`
    : "All Products";

subtitleEl.textContent = "Showing products available in this category.";

const filteredProducts = categoryType
    ? products.filter(p => p.category === categoryType)
    : products;

grid.innerHTML = "";

filteredProducts.forEach(p => {
    const card = document.createElement("a");
    card.className = "catcard"; 
    card.href = `product.html?id=${p.id}`;
 
    card.innerHTML = `
        <div class="cardmedia">
            <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="cardbody">
            <h3 class="cardtitle">${p.name}</h3>
            <p class="cardnote">₹${p.price}</p>
        </div>
    `;

    grid.appendChild(card);
});
