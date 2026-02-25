// ===============================
// App core (tối ưu + không bị thừa)
// ===============================

(function () {
  const THEME_KEY = "theme";

  const STUDENTS_KEY = "students_v1";

  // Đồng bộ danh sách học sinh từ bảng #student-list -> localStorage (để trang điểm danh lấy)
  function syncStudentsFromTable() {
    const tbody = document.getElementById("student-list");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    const names = rows
      .map((tr) => {
        const strong = tr.querySelector("td:nth-child(2) strong");
        const cell = tr.querySelector("td:nth-child(2)");
        const txt = (strong || cell)?.textContent || "";
        return txt.trim();
      })
      .filter(Boolean);

    // unique, giữ thứ tự
    const seen = new Set();
    const list = [];
    for (const n of names) {
      if (seen.has(n)) continue;
      seen.add(n);
      list.push({ name: n });
    }

    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
    } catch (e) {}
  }


  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);
    const toggle = document.getElementById("darkToggle");
    if (toggle) toggle.checked = isDark;
  }

  // Expose to inline HTML
  window.toggleDarkMode = function toggleDarkMode() {
    const isDark = !document.body.classList.contains("dark");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  };

  window.showPage = function showPage(pageId, element) {
    // 1) Hide all pages
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

    // 2) Show target
    const target = document.getElementById(pageId);
    if (target) target.classList.add("active");

    // 3) Active menu
    document.querySelectorAll(".menu a").forEach(a => a.classList.remove("active"));
    if (element) element.classList.add("active");

    // 4) Mobile: đóng sidebar sau khi chọn
    document.body.classList.remove("sidebar-open");
  };

  window.filterStudents = function filterStudents(input) {
    const filter = (input.value || "").toUpperCase();
    const rows = document.querySelectorAll("#student-list tr");
    rows.forEach(row => {
      const nameCell = row.querySelector("td:nth-child(2)");
      if (!nameCell) return;
      const text = (nameCell.textContent || "").toUpperCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  };

  window.switchChat = function switchChat(chatKey, element) {
    document.querySelectorAll(".chat-pane").forEach(p => p.classList.remove("active"));

    const map = {
      "co-tin": "co-tin",
      "ph-an": "chat-ph-an",
      "nhom-lop": "chat-nhom-lop",
    };
    const id = map[chatKey];
    if (id) {
      const pane = document.getElementById(id);
      if (pane) pane.classList.add("active");
    }

    document.querySelectorAll(".contact-item").forEach(i => i.classList.remove("active"));
    if (element) element.classList.add("active");
  };

  window.toggleSidebar = function toggleSidebar() {
    document.body.classList.toggle("sidebar-open");
  };

  document.addEventListener("click", (e) => {
    // Prevent '#' jump for menu links
    const a = e.target.closest(".menu a[href='#']");
    if (a) e.preventDefault();

    // click backdrop closes sidebar
    if (e.target.classList.contains("sidebar-backdrop")) {
      document.body.classList.remove("sidebar-open");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme
    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    // Sync students list for attendance page
    syncStudentsFromTable();

    // Default: click the currently active menu, else first menu
    const activeMenu = document.querySelector(".menu a.active");
    const firstMenu = document.querySelector(".menu a");
    (activeMenu || firstMenu)?.click?.();

    // Close sidebar on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) document.body.classList.remove("sidebar-open");
    });
  });
})();
