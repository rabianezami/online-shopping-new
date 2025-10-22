export function renderContactForm(parent) {
    // نمایش فرم تماس در صفحه
  parent.innerHTML = `
    <section id="contact" class="contact-section py-5">
      <div class="container">
        <div class="text-start">
          <h2 class="mb-4 contact-title fw-bold">Get In Touch</h2>
        </div>
        <div class="row g-4 justify-content-center">
          <div>
            <div class="card contact-form bg-white p-4 shadow-md rounded-4 w-100">
              <form id="contactForm" class="p-4" novalidate>
                
                <div class="mb-5">
                  <label class="form-label fw-bold">Your Name</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                    <input type="text" name="name" class="form-control" placeholder="Michael Jackson" />
                  </div>
                  <div class="text-danger field-error" data-field="name"></div>
                </div>

                <div class="mb-5">
                  <label class="form-label fw-bold">Your Email</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                    <input type="email" name="email" class="form-control" placeholder="jackson@gmail.com" />
                  </div>
                  <div class="text-danger field-error" data-field="email"></div>
                  <div class="email-hint mt-1" style="display:none;">✓ Valid email format</div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Your Message</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-chat-left-text-fill"></i></span>
                    <textarea name="message" class="form-control" rows="4" placeholder="Write me a text..."></textarea>
                  </div>
                  <div class="text-danger field-error" data-field="message"></div>
                </div>

                <div class="text-center">
                  <button type="submit" class="btn btn-card-fill px-5 py-2 rounded-pill fw-bold">
                    Send <i class="bi bi-arrow-right-circle"></i>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  initContactFormLogic(); ; // فعال کردن منطق فرم
}

function initContactFormLogic() {
  const form = document.getElementById("contactForm");
  const fields = ["name", "email", "message"];
  const emailHint = form.querySelector(".email-hint");

  // بارگذاری داده‌های ذخیره شده
  const savedData = JSON.parse(localStorage.getItem("contactFormData") || "{}");
  fields.forEach(f => {
    if (savedData[f]) form[f].value = savedData[f];
  });

 // تابع اعتبارسنجی هر فیلد
  const validateField = (name, value) => {
    switch(name) {
      case "name": return value.trim() ? "" : "Name is required";
      case "email":
        if (!value) return "Email is required";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format";
      case "message": return value.trim() ? "" : "Message is required";
      default: return "";
    }
  };

  // بروزرسانی داده و اعتبارسنجی لحظه‌ای
  const updateField = (e) => {
    const { name, value } = e.target;

      // ذخیره در localStorage
    localStorage.setItem("contactFormData", JSON.stringify({
      ...JSON.parse(localStorage.getItem("contactFormData") || "{}"),
      [name]: value
    }));

      // اعتبارسنجی و نمایش فوری خطا
    const errorDiv = form.querySelector(`.field-error[data-field="${name}"]`);
    if (errorDiv) {
      const errMsg = validateField(name, value);
      errorDiv.textContent = errMsg; // لحظه‌ای نمایش خطا
    }

   // نمایش/مخفی کردن راهنمای ایمیل
    if(name === "email") emailHint.style.display = validateField("email", value) ? "none" : "block";
  };

  // اضافه کردن رویداد input برای هر فیلد
  fields.forEach(f => form[f].addEventListener("input", updateField));

   // اعتبارسنجی هنگام blur 
  fields.forEach(f => form[f].addEventListener("blur", e => {
    const err = validateField(e.target.name, e.target.value);
    form.querySelector(`.field-error[data-field="${e.target.name}"]`).textContent = err;
  }));

    // ارسال فرم
  form.addEventListener("submit", e => {
    e.preventDefault();
    let hasError = false;
    fields.forEach(f => {
      const err = validateField(f, form[f].value);
      form.querySelector(`.field-error[data-field="${f}"]`).textContent = err;
      if(err) hasError = true;
    });

    // اگر خطا نبود
    if(!hasError) {
      alert(`Thank you, ${form.name.value}! Your message was sent.`);
      form.reset();
      localStorage.removeItem("contactFormData");
      emailHint.style.display = "none";
    }
  });
}
