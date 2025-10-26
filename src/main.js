import { initAuth } from "./modules/auth.js";
import { renderNavbar } from "./modules/navbar.js";
import { renderHeroSection } from "./modules/hero.js";
import { renderCheckout } from "./modules/checkout-modal.js";
import { renderProductsBase } from "./modules/products-base.js";
import { initThemeToggle } from "./modules/theme.js";
import { renderContactForm } from "./modules/contact.js";
import { renderFooter } from "./modules/footer.js";

// ✅ اضافه کردن ماژول چت بات
import { Chatbot } from "./modules/chatbot.js";

document.addEventListener("DOMContentLoaded", async () => {
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  const productsEl = document.getElementById("products");
  const contact = document.getElementById("contact-section");
  const footerContainer = document.getElementById("footer-container");

  renderNavbar(navbar);
  initAuth();
  initThemeToggle();

  renderHeroSection(hero);
  renderCheckout(document.body);

  const categories = ["men", "women", "kids"];
  const products = []; // آرایه محصولات واقعی خودت
  categories.forEach(cat => {
    const section = document.createElement("div");
    productsEl.appendChild(section);
    renderProductsBase(section, cat, { enableDrag: true });
    // برای چت بات، محصولات دسته را به آرایه اضافه کن
    const prodList = Array.from(section.querySelectorAll(".product-card")).map(card => ({
      title: card.dataset.title,
      category: cat,
      price: card.dataset.price,
      image: card.dataset.image,
      href: card.dataset.href
    }));
    products.push(...prodList);
  });

  renderContactForm(contact);
  renderFooter(footerContainer);

  // ✅ ایجاد و نمایش چت بات
  new Chatbot("chatbot-container", products);
});
