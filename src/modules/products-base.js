
import { setProducts, updateCart } from "./checkout-modal.js";
import { createProductCard } from "./productCard.js";

export async function renderProductsBase(parent, category = "all", options = {}) {
  //  دریافت محصولات از فایل JSON
  const res = await fetch("assets/data/products.json");
  const products = await res.json();
  setProducts(products);

   // فیلتر بر اساس دسته‌بندی
  const filtered = category === "all" ? products : products.filter(p => p.category === category);

  // بررسی کنیم در کدام صفحه هستیم
  const isProductsPage = window.location.pathname.includes("products.html");

  // اگر در صفحه دوم باشیم → grid
  if (isProductsPage) {
    parent.innerHTML = `
      <div class="py-5">
        <h3 class="mt-5 fw-bold">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <div class="product-grid row g-3 py-4" id="productGrid"></div>
      </div>
    `;
  } 
  // اگر در صفحه اصلی باشیم → scroll
  else {
    parent.innerHTML = `
      <section class="py-5 px-2 px-md-5 mx-2 mx-md-5 position-relative">
        <!-- عنوان و دکمه‌ها در یک ردیف -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="fw-bold mb-0">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div class="d-flex gap-2">
            <button id="scrollLeft" class="btn btn-scroll btn-sm"><i class="bi bi-arrow-left"></i></button>
            <button id="scrollRight" class="btn btn-scroll btn-sm"><i class="bi bi-arrow-right"></i></button>
          </div>
        </div>

        <div class="product-scroll-wrapper">
          <div class="product-scroll-grid" id="productGrid"></div>
        </div>

        <div class="text-center mt-3">
          <button id="actionBtn" class="btn btn-viewAll">View All</button>
        </div>
      </section>
    `;
  }

  //  تعریف متغیرها و ذخیره‌سازی
  const grid = parent.querySelector("#productGrid");
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));
  const saveFavs = () => localStorage.setItem("favorites", JSON.stringify(favorites));

   //  رندر رابط کاربری
  function renderUI() {
    grid.innerHTML = "";
    filtered.forEach(p =>
      grid.appendChild(
        createProductCard(p, cart, favorites, saveCart, saveFavs, updateCart, renderUI, isProductsPage ? "grid" : "scroll")
      )
    );
    saveCart();
    updateCart(cart);
  }

  // ➕➖ دکمه‌های افزودن و کم‌کردن
  parent.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn?.dataset.id) return;
    const id = btn.dataset.id;

    if (btn.classList.contains("btn-plus")) cart[id] = (cart[id] || 0) + 1;
    if (btn.classList.contains("btn-minus")) cart[id] > 1 ? cart[id]-- : delete cart[id];
   
    
    renderUI();
  });

  // اگر صفحه اصلی بود → اسکرول و درگ
  if (!isProductsPage) {
    const scrollWrapper = parent.querySelector(".product-scroll-wrapper");
    const scrollAmount = 200;

    parent.querySelector("#actionBtn").addEventListener("click", () => {
      window.open("products.html?category=" + category, "_blank");
    });

    const btnLeft = parent.querySelector("#scrollLeft");
    const btnRight = parent.querySelector("#scrollRight");

    btnRight.classList.add("active-btn");

    btnLeft.addEventListener("click", () => {
      scrollWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      btnLeft.classList.add("active-btn");
      btnRight.classList.remove("active-btn");
    });

    btnRight.addEventListener("click", () => {
      scrollWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      btnRight.classList.add("active-btn");
      btnLeft.classList.remove("active-btn");
    });

     //  فعال‌سازی درگ برای اسکرول
    if (options.enableDrag) {
      import("./dragScroll.js").then(({ enableDrag }) => enableDrag(scrollWrapper));
    }
  }

   //  اجرای اولیه
  renderUI();
}
