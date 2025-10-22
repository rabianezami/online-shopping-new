
export function initLogoutModal() {
  // اگر مودال هنوز اضافه نشده، اضافه کن
  if (!document.getElementById("logoutModal")) {
    const modalHTML = `
      <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="logoutModalLabel">Confirm Logout</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to logout?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button id="confirmLogout" type="button" class="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const logoutModalEl = document.getElementById("logoutModal");
  const confirmBtn = document.getElementById("confirmLogout");

  // event listener برای دکمه logout
  confirmBtn.addEventListener("click", () => {
    ["isLoggedIn", "username", "showWelcome"].forEach(k => localStorage.removeItem(k));
    window.location.replace("login.html");
  });

  // اگر میخوای با Bootstrap باز شود:
  const bootstrapModal = new bootstrap.Modal(logoutModalEl);

  return bootstrapModal; // می‌توانی از آن برای باز کردن مودال استفاده کنی
}
