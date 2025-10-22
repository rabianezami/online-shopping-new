import { updateCartCount } from "./cart.js";

// گرفتن cart از localStorage یا ایجاد جدید
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let products = [];

// تنظیم محصولات و رندر اولیه
export function setProducts(list) {
  products = list;
  renderCart(); // نمایش سبد
}

// بروزرسانی cart و انتشار رویداد
export function updateCart(newCart) {
  cart = { ...newCart };
  saveCart();       // ذخیره در localStorage
  renderCart();     // بروزرسانی سبد
  updateCartCount(); // بروزرسانی شمارنده
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart })); // اطلاع سایر ماژول‌ها
}

// ذخیره cart در localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// المان‌های DOM
let cartItems, cartTotal, cartCount, checkoutBtn, continueBtn, modalCartItems, modalTotal, checkoutForm, checkoutModalEl, checkoutModal;

// ایجاد و رندر سایدبار و مودال چک‌اوت
export function renderCheckout() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("app"); 
  wrapper.innerHTML = `
    <!-- سایدبار سبد خرید -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="cartSidebar">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Your Cart (<span id="cart-count">0</span>)</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <ul id="cart-items" class="list-group mb-3"></ul>
        <div class="d-flex justify-content-between fw-bold mb-3">
          <span>Total:</span>
          <span id="cart-total">0؋</span>
        </div>
        <button class="btn btn-outline w-100 mb-2" id="continueShoppingBtn">Continue Shopping</button>
        <button class="btn btn-card-fill w-100 mt-3" id="checkoutBtn">Checkout</button>
      </div>
    </div>

    <!-- مودال چک‌اوت -->
    <div class="modal fade" id="checkoutModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Checkout</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ul id="modal-cart-items" class="list-group mb-3"></ul>
            <form id="checkoutForm" novalidate>
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="name" required>
              </div>
              <div class="mb-3">
                <label for="card" class="form-label">Card Number</label>
                <input type="text" class="form-control" id="card" required>
              </div>
              <div class="mb-3">
                <label for="expiry" class="form-label">Expiry Date</label>
                <input type="month" class="form-control" id="expiry" required>
              </div>
              <button type="submit" class="btn btn-card-fill w-100">
                Pay <span id="modalTotal">0</span>؋
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // 🌟 گرفتن المان‌ها
  cartItems = document.getElementById("cart-items");
  cartTotal = document.getElementById("cart-total");
  cartCount = document.getElementById("cart-count");
  checkoutBtn = document.getElementById("checkoutBtn");
  continueBtn = document.getElementById("continueShoppingBtn");
  modalCartItems = document.getElementById("modal-cart-items");
  modalTotal = document.getElementById("modalTotal");
  checkoutForm = document.getElementById("checkoutForm");
  checkoutModalEl = document.getElementById("checkoutModal");
  checkoutModal = new bootstrap.Modal(checkoutModalEl);

  renderCart(); // نمایش اولیه سبد

  // 🌟 ادامه خرید
  continueBtn.addEventListener("click", () => {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById("cartSidebar"));
    bsOffcanvas.hide();
    window.location.href = "products.html"; // لینک صفحه محصولات
  });

  // 🌟 دکمه چک‌اوت
  checkoutBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Cart is empty ⚠️");
      return;
    }
    renderModalCart(); // نمایش سبد در مودال
    const totalAmount = Object.keys(cart).reduce((sum, id) => {
      const p = products.find(pr => pr.id == id);
      if (!p) return sum;
      const price = parseInt(p.price.toString().replace(/[^\d]/g, ""));
      return sum + price * cart[id];
    }, 0);
    modalTotal.textContent = totalAmount;
    checkoutModal.show(); // نمایش مودال
  });

  // 🌟 ولیدیشن فرم چک‌اوت
  checkoutForm.addEventListener("submit", e => {
    e.preventDefault();

    // پاک کردن پیام‌های قبلی
    const errorEls = checkoutForm.querySelectorAll(".error-msg");
    errorEls.forEach(el => el.remove());

    let isValid = true;
    const nameInput = document.getElementById("name");
    const cardInput = document.getElementById("card");
    const expiryInput = document.getElementById("expiry");

    // نام
    if (!nameInput.value.trim()) {
      const msg = document.createElement("div");
      msg.classList.add("error-msg", "text-danger", "mt-1");
      msg.textContent = "Full name is required.";
      nameInput.after(msg);
      isValid = false;
    }

    // کارت
    const cardNumber = cardInput.value.replace(/\D/g, "");
    if (!/^\d{16}$/.test(cardNumber)) {
      const msg = document.createElement("div");
      msg.classList.add("error-msg", "text-danger", "mt-1");
      msg.textContent = "Card number must be 16 digits.";
      cardInput.after(msg);
      isValid = false;
    }

    // تاریخ
    if (!expiryInput.value) {
      const msg = document.createElement("div");
      msg.classList.add("error-msg", "text-danger", "mt-1");
      msg.textContent = "Expiry date is required.";
      expiryInput.after(msg);
      isValid = false;
    } else {
      const today = new Date();
      const [year, month] = expiryInput.value.split("-").map(Number);
      const expiryDate = new Date(year, month - 1, 1);
      if (expiryDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
        const msg = document.createElement("div");
        msg.classList.add("error-msg", "text-danger", "mt-1");
        msg.textContent = "Card has expired.";
        expiryInput.after(msg);
        isValid = false;
      }
    }

    if (!isValid) return;

    // موفق
    checkoutModal.hide();
    alert("Your order has been successfully placed ✅");

    cart = {};
    saveCart();
    renderCart();
    updateCartCount();
    checkoutForm.reset();
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
  });

  // 🌟 تغییر تعداد / حذف محصول در سایدبار
  cartItems.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn?.dataset.id) return;
    const id = btn.dataset.id;

    if (btn.classList.contains("btn-plus")) cart[id] = (cart[id] || 0) + 1;
    if (btn.classList.contains("btn-minus")) cart[id] > 1 ? cart[id]-- : delete cart[id];
    if (btn.classList.contains("btn-remove")) delete cart[id];

    saveCart();       // ذخیره تغییرات
    renderCart();     // بروزرسانی سبد
    updateCartCount(); // بروزرسانی شمارنده
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
  });
}

// 🌟 رندر سبد در سایدبار
function renderCart() {
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  Object.keys(cart).forEach(id => {
    const p = products.find(pr => pr.id == id);
    if (!p) return;
    const qty = cart[id];
    count += qty;
    const price = parseInt(p.price.toString().replace(/[^\d]/g, ""));
    total += price * qty;

    cartItems.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${p.title}</strong>
          <span class="badge bg-secondary ms-2">${qty}</span>
          <div class="mt-1">
            <button class="btn btn-sm btn-card btn-minus" data-id="${p.id}">
              <i class="bi bi-dash-lg"></i>
            </button>
            <button class="btn btn-sm btn-card btn-plus" data-id="${p.id}">
              <i class="bi bi-plus-lg"></i>
            </button>
            <button class="btn btn-sm btn-card btn-remove" data-id="${p.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <span>${qty * price}؋</span>
      </li>`;
  });

  cartTotal.textContent = `${total}؋`;
  cartCount.textContent = count;
  updateCartCount(); // بروزرسانی شمارنده
}

// 🌟 رندر سبد در مودال چک‌اوت
function renderModalCart() {
  modalCartItems.innerHTML = Object.keys(cart)
    .map(id => {
      const p = products.find(pr => pr.id == id);
      if (!p) return "";
      const price = parseInt(p.price.toString().replace(/[^\d]/g, ""));
      return `<li class="list-group-item d-flex justify-content-between">
        <span>${p.title} × ${cart[id]}</span>
        <strong>${price * cart[id]}؋</strong>
      </li>`;
    })
    .join("");
}
