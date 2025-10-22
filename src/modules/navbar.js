export function renderNavbar(parent) {
  // لینک‌های ناوبار → Categories حذف شد، Contact Us اضافه شد
  const links = [
    { label: "Contact Us", href: "#contact" },
  ];

  // دکمه‌های سمت راست ناوبار (بدون آیکن جستجو)
  const rightButtons = [
    { label: '<i class="bi bi-moon-stars"></i>', class: "btn btn-custom rounded-3 px-3 py-2", id: "theme-toggle-btn" },
    { label: '<i class="bi bi-cart"></i>', class: "btn btn-custom rounded-3 px-3 py-2 position-relative", id: "navbar-cart-btn", toggle: "offcanvas", target: "#cartSidebar" },
    { label: '<i class="bi bi-heart-fill"></i>', class: "btn btn-custom rounded-3 px-3 py-2 text-danger", href: "favorites.html" },
    { label: '<i class="bi bi-person"></i>', class: "btn btn-custom rounded-3 px-3 py-2" }
  ];

  // ساخت عنصر اصلی ناوبار
  const nav = document.createElement("nav");
  nav.className = "glassNavbar navbar navbar-expand-lg";
  nav.setAttribute("aria-label", "Main navbar");

  // ساختار داخلی ناوبار
  nav.innerHTML = `
    <div class="container d-flex align-items-center py-2">
      <!-- لوگو -->
      <a class="navbar-brand d-flex align-items-center me-3 mobile-logo mobile-hide-on-toggle" href="index.html">
        <img src="assets/images/shopping-logo.png" alt="logo" width="30" height="30" class="me-2" onerror="this.style.display='none'">
        <span class="fw-bold">Online Shopping</span>
      </a>

      <!-- دکمه‌ها و منوی موبایل -->
      <div class="d-flex align-items-center gap-2 d-lg-none ms-auto mobile-toggle-buttons">
        ${rightButtons.map((b, i) => i < 2 ? `
          <button class="${b.class} btn-sm"
            ${b.toggle ? ` data-bs-toggle="${b.toggle}"` : ""}
            ${b.target ? ` data-bs-target="${b.target}"` : ""}
            ${b.id ? ` id="${b.id}"` : ""}>
            ${b.label}
            ${b.id === "navbar-cart-btn" ? `<span id="navbar-cart-count-mobile" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>` : ""}
          </button>
        ` : "").join("")}
        <button class="navbar-toggler btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- بخش دسکتاپ -->
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-lg-0 align-items-center"></ul>
        <div class="d-flex align-items-center gap-2 nav-actions"></div>
      </div>
    </div>

    <!-- منوی موبایل -->
    <div class="collapse" id="mobileMenu">
      <div class="menu-header d-flex justify-content-between align-items-center position-absolute start-0 w-100 px-5 py-2">
        <button class="btn btn-sm btn-outline-secondary mobile-signup"><i class="bi bi-person"></i></button>
        <button class="btn btn-sm btn-outline-secondary mobile-close" data-bs-toggle="collapse" data-bs-target="#mobileMenu"><i class="bi bi-x-lg"></i></button>
      </div>
      <ul class="list-unstyled p-3 mb-0 mt-5">
        ${links.map(l => `<li><a href="${l.href}" class="d-block nav-link py-2">${l.label}</a></li>`).join("")}
        <li><a href="favorites.html" class="d-block nav-link py-2 text-danger">❤️ Favorites</a></li>
      </ul>
    </div>
  `;

  // افزودن لینک‌ها و دکمه‌ها برای دسکتاپ
  const ul = nav.querySelector(".navbar-nav");
  links.forEach(l => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link px-2 text-dark" href="${l.href}">${l.label}</a>`;
    ul.appendChild(li);
  });

  const actions = nav.querySelector(".nav-actions");
  rightButtons.forEach(b => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = b.href
      ? `<a href="${b.href}" class="${b.class}">${b.label}</a>`
      : `<button type="button" class="${b.class}"
          ${b.toggle ? `data-bs-toggle="${b.toggle}"` : ""}
          ${b.target ? `data-bs-target="${b.target}"` : ""}
          ${b.id ? `id="${b.id}"` : ""}>
          ${b.label}
          ${b.id === "navbar-cart-btn"
            ? `<span id="navbar-cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>`
            : ""}
        </button>`;
    actions.appendChild(wrapper.firstElementChild);
  });

  // اضافه کردن ناوبار به صفحه
  parent.appendChild(nav);

  // کنترل باز و بسته شدن منوی موبایل
  const mobileMenu = nav.querySelector('#mobileMenu');
  const mobileToggleButtons = nav.querySelectorAll('.mobile-toggle-buttons button, .mobile-toggle-buttons a');
  const mobileLogo = nav.querySelector('.mobile-hide-on-toggle');

  mobileMenu.addEventListener('show.bs.collapse', () => {
    mobileToggleButtons.forEach(btn => btn.style.display = 'none');
    mobileLogo.classList.add('hide');
  });

  mobileMenu.addEventListener('hide.bs.collapse', () => {
    mobileToggleButtons.forEach(btn => btn.style.display = 'inline-block');
    mobileLogo.classList.remove('hide');
  });

  // هنگام تغییر اندازه صفحه
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      mobileMenu.classList.remove('show');
      mobileMenu.setAttribute('aria-expanded', 'false');
      const bsCollapse = bootstrap.Collapse.getInstance(mobileMenu);
      if (bsCollapse) bsCollapse.hide();
      mobileToggleButtons.forEach(btn => btn.style.display = 'inline-block');
      mobileLogo.classList.remove('hide');
    }
  });
}
