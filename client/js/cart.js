import { apiFetch, getToken } from "./api.js";
import { openPaymentModal } from "./payment.js";

export async function loadCart() {
  const cartWrapper = document.querySelector(".cart-content");
  const indicator = document.querySelector("#indicator");

  if (!getToken()) {
    cartWrapper.innerHTML = "<p>Your Cart Is Empty</p>";
    cartWrapper.classList.add("emptyCart");
    indicator.classList.add("invisible");
    return;
  }

  try {
    const cart = await apiFetch("/cart");
    if (!cart.items.length) {
      cartWrapper.innerHTML = "<p>Your Cart Is Empty</p>";
      cartWrapper.classList.add("emptyCart");
      indicator.classList.add("invisible");
      return;
    }

    cartWrapper.classList.remove("emptyCart");
    indicator.classList.remove("invisible");

    const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);
    indicator.textContent = totalQty;

    cartWrapper.innerHTML =
      cart.items.map((item) => {
        const discounted = Math.round(item.price_cents * (1 - item.discount_pct / 100));
        const lineTotal = ((discounted * item.qty) / 100).toFixed(2);
        const unitPrice = (discounted / 100).toFixed(2);
        return `
          <div class="basket">
            <img src="images/image-product-1-thumbnail.jpg" alt="thumbnail" class="basket-thumbnail">
            <div>
              <p class="item-Name">${item.name}</p>
              <p><span>$${unitPrice}</span> x <span>${item.qty}</span> <span>$${lineTotal}</span></p>
            </div>
            <button class="delete-icon" data-product-id="${item.product_id}">
              <img src="images/icon-delete.svg" alt="remove">
            </button>
          </div>`;
      }).join("") +
      `<button id="checkout-btn" class="checkOut">Checkout</button>`;

    cartWrapper.querySelectorAll(".delete-icon").forEach((btn) => {
      btn.addEventListener("click", () => removeCartItem(btn.dataset.productId));
    });

    document.getElementById("checkout-btn").addEventListener("click", checkout);
  } catch {
    cartWrapper.innerHTML = "<p>Your Cart Is Empty</p>";
  }
}

export async function addToCart(productId, qty) {
  if (!getToken()) {
    alert("Please log in to add items to your cart.");
    return;
  }
  await apiFetch("/cart/item", {
    method: "POST",
    body: JSON.stringify({ productId, qty }),
  });
  await loadCart();
}

export async function removeCartItem(productId) {
  await apiFetch(`/cart/item/${productId}`, { method: "DELETE" });
  await loadCart();
}

async function checkout() {
  const btn = document.getElementById("checkout-btn");
  btn.disabled = true;
  btn.textContent = "Loading...";
  try {
    const { order, clientSecret } = await apiFetch("/orders", { method: "POST" });
    await openPaymentModal(clientSecret, order.total_cents);
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Checkout";
  }
}
