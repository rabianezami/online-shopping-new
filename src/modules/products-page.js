// وارد کردن ماژول‌ها
import { initAuth } from "./auth.js";
import { renderNavbar } from "./navbar.js";
import { renderProductsBase } from "./products-base.js";
import { renderCheckout } from "./checkout-modal.js";

// 🛍 تابع نمایش صفحه محصولات
export function renderProductsPage(parent, category = "all") {
  const app = document.querySelector(".app"); // ✅ داخل app رندر شود
  renderNavbar(app); // نمایش نوار بالا داخل .app
  initAuth(); // بررسی ورود کاربر
  renderCheckout(app); // نمایش پنجره تسویه حساب داخل .app
  renderProductsBase(parent, category, { layout: "grid" }); // رندر محصولات
}
