//  مدیریت ورود و دسترسی کاربر
import { initAuth } from "./auth.js";

// گرفتن و بروزرسانی سبد خرید برای هماهنگی با Navbar
import { getCart, dispatchCartUpdate } from "./cart.js";

export function renderFavoritesPage(parent) {
  // ایجاد بخش اصلی صفحه علاقه‌مندی‌ها
  const section = document.createElement("section");
  section.className = "container py-5 mt-5";

  section.innerHTML = `
    <h3 class="mb-4 mt-5 fw-bold">My Favorites ❤️</h3>
    <div class="row g-3" id="favoritesGrid"></div>
  `;

  const grid = section.querySelector("#favoritesGrid");
  parent.innerHTML = ""; // پاک کردن محتوای قبلی
  parent.appendChild(section);

  //  بروزرسانی شمارنده Navbar هنگام لود صفحه
  const cart = getCart();
  dispatchCartUpdate();

  // گرفتن لیست علاقه‌مندی‌ها از localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    // نمایش پیام اگر علاقه‌مندی وجود ندارد
    grid.innerHTML = `<p class="text-muted">No favorites yet.</p>`;
    return;
  }

  favorites.forEach(p => {
    // ایجاد کارت برای هر محصول
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <div class="position-relative img-wrapper">
          <img src="${p.image}" class="card-img-top rounded-3 product-img" alt="${p.title}">
          <button class="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-2 fav-btn">
            <i class="bi bi-heart-fill text-danger"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column">
          <p class="small fw-bold mb-2 text-truncate" title="${p.title}">${p.title}</p>
          <div class="mt-auto fw-bold text-dark price-product">${p.price}</div>
        </div>
      </div>
    `;

    // ❤️ حذف محصول از علاقه‌مندی‌ها و بروزرسانی صفحه و Navbar
    col.querySelector(".fav-btn").addEventListener("click", () => {
      favorites = favorites.filter(f => f.id !== p.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      // 🟢 بروزرسانی شمارنده و هماهنگی با Navbar
      dispatchCartUpdate();

      // رندر دوباره صفحه علاقه‌مندی‌ها
      renderFavoritesPage(parent);
    });

    grid.appendChild(col);
  });

  // بررسی وضعیت ورود کاربر
  initAuth();
}
