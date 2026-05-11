import { initAuth } from "./js/auth.js";
import { loadCart, addToCart } from "./js/cart.js";
import { apiFetch } from "./js/api.js";
import { initPayment } from "./js/payment.js";

// Required by onclick attributes in HTML
window.toggleSidebar = toggleSidebar;

const minusBtn = document.querySelector("#minusButton");
const btnNumber = document.querySelector(".num");
const plusBtn = document.querySelector("#plusButton");
const cartIconBtn = document.querySelector(".cart-button");
const cartContainerWrapper = document.querySelector(".cart-warp");
const modal = document.querySelector("#myModal");
const bigMainImageLightBox = document.querySelector(".lightbox-Container .mainImg");
const mainThumbnailImg = document.querySelector(".mainImg");
const closeXBtn = document.querySelector(".closeXBtn");
const previousBtn = document.querySelector(".previous-Btn");
const nextBtn = document.querySelector(".next-btn");
const images = document.querySelectorAll(".thumbnails img");

let currentNumber = 0;
let currentImg = 1;
let productId = null;

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  initAuth();
  await initPayment(loadCart);
  await loadCart();
  await loadProduct();
});

async function loadProduct() {
  try {
    const products = await apiFetch("/products");
    if (!products.length) return;
    const p = products[0];
    productId = p.id;

    document.querySelector(".title").textContent = p.brand;
    document.querySelector(".limited-Edition").textContent = p.name;
    document.querySelector(".description").textContent = p.description;

    const fullPrice = (p.price_cents / 100).toFixed(2);
    const discounted = Math.round(p.price_cents * (1 - p.discount_pct / 100));
    document.querySelector(".new-price").textContent = `$${(discounted / 100).toFixed(2)}`;
    document.querySelector(".old-price").textContent = `$${fullPrice}`;
    document.querySelector(".discount").textContent = `${p.discount_pct}%`;
  } catch {
    // falls back to static HTML values if API is unavailable
  }
}

// ── Cart ──────────────────────────────────────────────────────────────────────

cartIconBtn.addEventListener("click", () => {
  cartContainerWrapper.classList.toggle("invisible");
});

document.querySelector("#addToCartBtn").addEventListener("click", async () => {
  if (currentNumber === 0) return;
  await addToCart(productId, currentNumber);
  currentNumber = 0;
  btnNumber.innerText = 0;
});

// ── Quantity ──────────────────────────────────────────────────────────────────

minusBtn.addEventListener("click", () => {
  if (currentNumber > 0) currentNumber--;
  btnNumber.innerText = currentNumber;
});

plusBtn.addEventListener("click", () => {
  currentNumber++;
  btnNumber.innerText = currentNumber;
});

// ── Image gallery ─────────────────────────────────────────────────────────────

mainThumbnailImg.addEventListener("click", () => {
  modal.classList.remove("invisible");
});

closeXBtn.addEventListener("click", () => {
  modal.classList.add("invisible");
});

Array.from(images).forEach((image) => {
  image.addEventListener("click", () => {
    document.querySelectorAll(".selected")[0]?.classList.remove("selected");
    image.classList.add("selected");
    const src = image.getAttribute("src");
    const full = src.replace("-thumbnail", "");
    mainThumbnailImg.src = full;
    bigMainImageLightBox.src = full;
    currentImg = parseInt(full.match(/image-product-(\d)/)[1]);
  });
});

previousBtn.addEventListener("click", () => {
  currentImg = currentImg === 1 ? 4 : currentImg - 1;
  bigMainImageLightBox.src = `images/image-product-${currentImg}.jpg`;
  mainThumbnailImg.src = `images/image-product-${currentImg}.jpg`;
});

nextBtn.addEventListener("click", () => {
  currentImg = currentImg === 4 ? 1 : currentImg + 1;
  bigMainImageLightBox.src = `images/image-product-${currentImg}.jpg`;
  mainThumbnailImg.src = `images/image-product-${currentImg}.jpg`;
});

// ── Sidebar ───────────────────────────────────────────────────────────────────

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".close-btn");
  const body = document.querySelector("body");
  const overlay = document.querySelector(".overlay");

  body.classList.toggle("no-scroll");
  sidebar.classList.toggle("sidebar-active");
  closeBtn.classList.toggle("sidebar-active");
  overlay.style.opacity = sidebar.classList.contains("sidebar-active") ? 0.5 : 0;
}
