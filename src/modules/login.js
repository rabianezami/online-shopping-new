
document.addEventListener("DOMContentLoaded", () => {
  // گرفتن عناصر از صفحه
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const userError = document.getElementById("userError");
  const passError = document.getElementById("passError");
  const togglePassword = document.getElementById("togglePassword");

  // بررسی ورود کاربر، جلوگیری از دسترسی با back browser
  if (localStorage.getItem("isLoggedIn") !== "true" && window.location.pathname !== "/login.html") {
    window.location.replace("login.html");
  }

  // نمایش/عدم نمایش پسورد
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
  });

  // رویداد ارسال فرم
  form.addEventListener("submit", e => {
    e.preventDefault(); // جلوگیری از رفرش شدن صفحه

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    userError.textContent = "";
    passError.textContent = "";

    let valid = true; // وضعیت اعتبارسنجی

    // بررسی خالی بودن فیلدها
    if (!username) {
      userError.textContent = "Username is required";
      valid = false;
    }
    if (!password) {
      passError.textContent = "Password is required";
      valid = false;
    }
    if (!valid) return;

    // بررسی الگوهای مجاز
    const usernameValid = /^[a-zA-Z0-9]{3,20}$/.test(username);
    const passwordValid = /^[\S]{4,20}$/.test(password);

    // اگر نام کاربر معتبر نباشد
    if (!usernameValid) {
      userError.textContent = "Username must be 3-20 letters or numbers";
      return;
    }
    // اگر پسورد معتبر نباشد
    if (!passwordValid) {
      passError.textContent = "Password must be 4-20 characters with no spaces";
      return;
    }

    // اعتبارسنجی نهایی (ورود کاربر)
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("showWelcome", "true");

      // انیمیشن محو فرم
      form.style.transition = "opacity 0.5s";
      form.style.opacity = "0";

      // هدایت به صفحه اصلی
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    } else {
      passError.textContent = "Invalid username or password";
    }
  });

  // ======= Logout Modal =======
  const userButtons = document.querySelectorAll(".bi-person, .logout-btn"); // دکمه‌های کاربر
  userButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault(); // جلوگیری از رفتار پیش‌فرض لینک
      if (localStorage.getItem("isLoggedIn") === "true") {
        // نمایش پیام تایید خروج
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
          // حذف داده‌های کاربر از localStorage
          ["isLoggedIn", "username", "showWelcome"].forEach(k => localStorage.removeItem(k));
          window.location.replace("login.html"); // هدایت به صفحه لاگین
        }
      } else {
        // اگر کاربر لاگین نیست
        window.location.replace("login.html");
      }
    });
  });
});
