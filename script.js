//.wrapper button
const minusBtn = document.querySelector("#minusButton"); //ok
const btnNumber = document.querySelector(".num"); //ok
const plusBtn = document.querySelector("#plusButton"); //ok

//Add to cart
const cartButton = document.querySelector("#addToCartBtn"); //ok
const cartWrapper = document.querySelector(".cart-content"); //ok
const indicatorNumber = document.querySelector("#indicator"); //ok

//toggle Cart button on/off
const cartIconBtn = document.querySelector(".cart-button");
const cartContainerWrapper = document.querySelector(".cart-warp"); //ok
const trashIconBtn = document.querySelector("#delete-Button");

// Modal lightBox
const modal = document.querySelector("#myModal");
const bigMainImageLightBox = document.querySelector(
  ".lightbox-Container .mainImg"
);
const mainThumbnailImg = document.querySelector(".mainImg");
const closeXBtn = document.querySelector(".closeXBtn");
const slider_img = document.querySelector(".slider-img");
const previousBtn = document.querySelector(".previous-Btn");
const nextBtn = document.querySelector(".next-btn");
const images = document.querySelectorAll(".thumbnails img");
const arrayOfImages = Array.from(images);

let currentNumber = 0; // number between the minus and plus button
let currentImg = 1;

mainThumbnailImg.addEventListener("click", () => {
  modal.classList.remove("invisible");
});

closeXBtn.addEventListener("click", () => {
  modal.classList.add("invisible");
});

cartIconBtn.addEventListener("click", () => {
  cartContainerWrapper.classList.toggle("invisible");
});

//change Images
arrayOfImages.forEach((image) => {
  image.addEventListener("click", () => {
    const previousSelected = document.querySelectorAll(".selected"); // It will also get the class name from the Modal
    if (previousSelected) {
      previousSelected[0].classList.remove("selected");
    }
    image.classList.add("selected");
    const selectedImg = document.querySelector(".selected");
    switch (selectedImg.getAttribute("src")) {
      case "images/image-product-1-thumbnail.jpg":
        mainThumbnailImg.src = "images/image-product-1.jpg";
        bigMainImageLightBox.src = "images/image-product-1.jpg";
        break;
      case "images/image-product-2-thumbnail.jpg":
        mainThumbnailImg.src = "images/image-product-2.jpg";
        bigMainImageLightBox.src = "images/image-product-2.jpg";
        break;
      case "images/image-product-3-thumbnail.jpg":
        mainThumbnailImg.src = "images/image-product-3.jpg";
        bigMainImageLightBox.src = "images/image-product-3.jpg";
        break;
      case "images/image-product-4-thumbnail.jpg":
        mainThumbnailImg.src = "images/image-product-4.jpg";
        bigMainImageLightBox.src = "images/image-product-4.jpg";
        break;
    }
  });
});

previousBtn.addEventListener("click", () => {
  if (currentImg === 1) {
    currentImg = 4;
  } else {
    currentImg--;
  }
  bigMainImageLightBox.src = `images/image-product-${currentImg}.jpg`;
  mainThumbnailImg.src = `images/image-product-${currentImg}.jpg`;
});

nextBtn.addEventListener("click", () => {
  if (currentImg === 4) {
    currentImg = 1;
  } else {
    currentImg++;
  }
  bigMainImageLightBox.src = `images/image-product-${currentImg}.jpg`;
  mainThumbnailImg.src = `images/image-product-${currentImg}.jpg`;
});

// minus and plus buttons
minusBtn.addEventListener("click", () => {
  if (currentNumber > 0) {
    currentNumber--;
  }
  btnNumber.innerText = currentNumber;
  indicatorNumber.innerText = currentNumber;
});

plusBtn.addEventListener("click", () => {
  currentNumber++;
  btnNumber.innerText = currentNumber;
  indicatorNumber.innerText = currentNumber;
});

cartButton.addEventListener("click", () => {
  if (currentNumber > 0) {
    cartWrapper.classList.remove("emptyCart");
    const total = 125 * currentNumber; // Example 125 * 3 = 375.00

    const cartBasket = `<div class="basket "> 
    <img src="images/image-product-1-thumbnail.jpg" alt="thumbnail-One" class="basket-thumbnail">
    <div>
      <p class="item-Name">Fall Limited Edition Sneakers</p>
      <p><span>$125.00</span> x <span> ${currentNumber} </span> <span>$${total.toFixed(
      2
    )} </span></p>
    </div>
    <button id="delete-Button" class="delete-icon" onclick = "removeBasketCart()">
      <img src="images/icon-delete.svg" alt="trash-can">
    </button>
  </div>
    <button id="checkout-btn" class="checkOut onclick="checkOutButton()">Checkout</button>`;

    cartWrapper.innerHTML = cartBasket;
  }
  const checkOutBtn = document.querySelector("#checkout-btn"); //ok
  checkOutBtn.addEventListener("click", checkOutButton);
  indicatorNumber.classList.remove("invisible"); // The indicator will appear in the cart
});

function removeBasketCart() {
  if (currentNumber < 0) {
    indicatorNumber.classList.remove("invisible");
    cartWrapper.classList.add("invisible");
  } else {
    indicatorNumber.classList.add("invisible");
    cartWrapper.classList.remove("invisible");
  }
  cartWrapper.innerHTML = "<p> Your Cart Is Empty </p>";
}

// toggleSidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".close-btn");
  const body = document.querySelector("body");
  const overlay = document.querySelector(".overlay");

  body.classList.toggle("no-scroll");
  sidebar.classList.toggle("sidebar-active");
  closeBtn.classList.toggle("sidebar-active");

  if (sidebar.classList.contains("sidebar-active")) {
    overlay.style.opacity = 0.5;
  } else {
    overlay.style.opacity = 0;
  }
}

function checkOutButton() {
  window.location.reload();
}
