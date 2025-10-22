
export function renderFooter(parent) {
  // لینک‌های سریع
  const quickLinks = [
    { label: "Home", href: "index.html" },
    { label: "Categories", href: "#producs" },
    { label: "Contact", href: "#contact" },
  ];

  // لینک‌های شبکه‌های اجتماعی
  const socialLinks = [
    { icon: "bi-twitter", href: "https://x.com/zia95355" },
    { icon: "bi-linkedin", href: "https://www.linkedin.com/in/rabia-zia-nezami-993989379/" },
    { icon: "bi-instagram", href: "https://www.instagram.com/?hl=en" },
  ];

  parent.innerHTML += `
    <footer class="custom-footer mt-5t">
      <div class="container py-5">
        <div class="row gy-4">

          <!-- About Us -->
          <div class="col-md-4">
            <h5 class="mb-3">About Us</h5>
            <p class="small">
              Online Shop is dedicated to providing the best shopping experience with quality products and fast delivery.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="col-md-3">
            <h5 class="mb-3 quick-links">Quick Links</h5>
            <ul class="list-unstyled small">
              ${quickLinks.map(link => `<li><a href="${link.href}" class="text-white">${link.label}</a></li>`).join("")}
            </ul>
          </div>

          <!-- Contact & Social -->
          <div class="col-md-5">
            <h5 class="mb-3">Contact Us</h5>
            <p class="small mb-1"><i class="bi bi-envelope me-3 footer-link"></i> info.online@gmail.com</p>
            <p class="small mb-3"><i class="bi bi-telephone me-2"></i> +93 748 945 001</p>
            <div>
              ${socialLinks.map(s => `<a href="${s.href}" class="text-light me-3 fs-4 footer-link"><i class="bi ${s.icon}"></i></a>`).join("")}
            </div>
          </div>

        </div>

        <hr>

        <div class="text-center small pt-3">
          &copy; 2025 Online Shop — All rights reserved.
        </div>
      </div>
    </footer>
  `;
}
