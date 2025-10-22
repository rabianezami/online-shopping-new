//  وارد کردن تابع اصلی نمایش محصولات
import { renderProductsBase } from "./products-base.js";

// تابع رندر محصولات در صفحه اصلی
export function renderProducts(parent, category = "all") {
  renderProductsBase(parent, category, { layout: "scroll", enableDrag: true }); // 🔹 نمایش محصولات با حالت اسکرول و درگ
}
