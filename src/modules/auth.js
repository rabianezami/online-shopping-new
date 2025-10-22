export function initAuth() {
  // مدیریت کلیک روی دکمه پروفایل یا خروج
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".bi-person, .logout-btn");
    if (!btn) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      // اگر کاربر وارد شده، تایید خروج بگیر
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        // حذف اطلاعات کاربر از localStorage
        ["isLoggedIn", "username", "showWelcome"].forEach((k) => localStorage.removeItem(k));
        window.location.replace("login.html"); // رفتن به صفحه لاگین
      }
    } else {
      // اگر وارد نشده، مستقیم به صفحه لاگین برو
      window.location.replace("login.html");
    }
  });

  // بررسی وضعیت ورود کاربر در هنگام بارگذاری صفحه
  const onLoginPage = window.location.pathname.endsWith("login.html");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn && !onLoginPage) {
    // اگر وارد نشده و در صفحه لاگین نیست، بفرست به لاگین
    window.location.replace("login.html");
  }

  if (isLoggedIn && onLoginPage) {
    // اگر وارد شده و در صفحه لاگین هست، بفرست به خانه
    window.location.replace("index.html");
  }
}
