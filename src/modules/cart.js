
// گرفتن cart از localStorage یا ایجاد جدید
let cart = JSON.parse(localStorage.getItem("cart")) || {}; // {id: qty}

// اضافه کردن محصول به سبد
export function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();          // ذخیره در localStorage
  dispatchCartUpdate(); // بروزرسانی و اطلاع سایر ماژول‌ها
}

// حذف محصول از سبد
export function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  dispatchCartUpdate();
}

// خالی کردن سبد
export function clearCart() {
  cart = {};
  saveCart();
  dispatchCartUpdate();
}

// گرفتن وضعیت فعلی سبد
export function getCart() {
  return cart;
}

// ذخیره سبد در localStorage
export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// بروزرسانی شمارنده cart در Navbar
export function updateCartCount() {
  const count = Object.values(cart).reduce((acc, qty) => acc + qty, 0);

  // بروزرسانی دسکتاپ
  const badgeDesktop = document.getElementById("navbar-cart-count");
  if (badgeDesktop) badgeDesktop.textContent = count;

  // بروزرسانی موبایل
  const badgeMobile = document.getElementById("navbar-cart-count-mobile");
  if (badgeMobile) badgeMobile.textContent = count;
}

// انتشار رویداد cartUpdated برای هماهنگی ماژول‌ها
export function dispatchCartUpdate() {
  updateCartCount(); // بروزرسانی شمارنده
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart })); // اطلاع سایر ماژول‌ها
}

// گوش دادن به تغییرات خارجی cart
window.addEventListener("cartUpdated", e => {
  cart = e.detail;    // همگام سازی با تغییرات
  updateCartCount();  // بروزرسانی شمارنده
});
