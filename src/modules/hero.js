//  اطلاعات بخش هیرو
const heroData = {
  title: "Find the Best Online Deals & Trusted Products Across the Globe", // عنوان اصلی
  subtitle:
    "Every purchase allows you to access quality products at great prices, enjoy fast and reliable delivery, and experience a seamless shopping journey that meets all your daily needs.", // توضیح کوتاه
  image: "assets/images/hero-picc.jpg", // تصویر هیرو
};

//  تابع رندر بخش هیرو
export function renderHeroSection(parent) {
  const section = document.createElement("section");
  section.className = "hero-section py-5"; // کلاس برای استایل بخش

  //  ساختار اصلی HTML بخش هیرو
  section.innerHTML = `
    <div class="container">
      <div class="row align-items-center">
        <!-- متن سمت چپ -->
        <div class="col-lg-6 text-white order-2 order-lg-1">
          <h1 class="fw-bold mb-2 mt-4 pt-5">${heroData.title}</h1> <!-- عنوان -->
          <p class="mb-4">${heroData.subtitle}</p> <!-- توضیح -->
        </div>

        <!-- Right image - تصویر سمت راست -->
        <div class="col-lg-6 text-center order-1 order-lg-2">
          <img src="${heroData.image}" alt="Hero Image" class="img-fluid hero-image">
        </div>
      </div>
    </div>
  `;

  // Adding to parent - اضافه کردن به المنت والد
  parent.appendChild(section);
}
