
export function initThemeToggle() {
  const app = document.querySelector(".app");
  const toggleBtns = document.querySelectorAll("#theme-toggle-btn"); //  همه دکمه‌های دارک مود را بگیر

  // اگر هیچ‌کدام پیدا نشد، تابع را متوقف کن
  if (!app || toggleBtns.length === 0) return;

  // 🔹 بررسی حالت ذخیره‌شده در localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    app.classList.add("dark-mode");
    toggleBtns.forEach(btn => (btn.innerHTML = '<i class="bi bi-sun"></i>'));
  }

  // 🔹 افزودن رویداد کلیک برای هر دکمه
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      app.classList.toggle("dark-mode");
      const isDark = app.classList.contains("dark-mode");

      // آیکن‌ها را در هر دو دکمه هماهنگ کن
      toggleBtns.forEach(b => {
        b.innerHTML = isDark
          ? '<i class="bi bi-sun"></i>'
          : '<i class="bi bi-moon-stars"></i>';
      });

      // ذخیره‌سازی حالت در localStorage
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });
}
