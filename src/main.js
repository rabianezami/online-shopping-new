import { initAuth } from "./modules/auth.js"; // اعتبارسنجی کاربر
import { renderNavbar } from "./modules/navbar.js"; // نمایش ناوبار
import { renderHeroSection } from "./modules/hero.js"; // نمایش بخش هرو
import { renderCheckout } from "./modules/checkout-modal.js"; // نمایش چک‌اوت
import { renderProductsBase } from "./modules/products-base.js"; // نمایش محصولات
import { initThemeToggle } from "./modules/theme.js"; // فعال‌سازی دارک/لایت مود
import { renderContactForm } from "./modules/contact.js"; // فرم تماس
import { renderFooter } from "./modules/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar"); // عنصر ناوبار
  const hero = document.getElementById("hero"); // عنصر هرو
  const products = document.getElementById("products"); // عنصر محصولات
  const contact = document.getElementById("contact-section"); //  عنصر تماس
  const footerContainer = document.getElementById("footer-container");

  renderNavbar(navbar); // رندر ناوبار
  initAuth(); // اعتبارسنجی کاربر
  initThemeToggle(); // فعال‌سازی دارک/لایت مود

  renderHeroSection(hero); // رندر بخش هرو
  renderCheckout(document.body); // رندر چک‌اوت

  const categories = ["men", "women", "kids"]; // دسته‌بندی محصولات
  categories.forEach(cat => {
    const section = document.createElement("div"); // ساخت بخش جدید برای هر دسته
    products.appendChild(section); // اضافه کردن به بخش محصولات
    renderProductsBase(section, cat, { enableDrag: true }); // رندر محصولات دسته با امکان درگ
  });

  renderContactForm(contact); // رندر تماس
  renderFooter(footerContainer); // رندر فوتر
});
