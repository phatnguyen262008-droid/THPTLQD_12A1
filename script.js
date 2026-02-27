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
    localStorage.setItem("lastPage", pageId);
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
    
    const savedPage = localStorage.getItem("lastPage");
    if(savedPage){
        const target = document.getElementById(savedPage);
        if(target){
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            target.classList.add("active");
            const menuLink = document.querySelector('.menu a[onclick*="' + savedPage + '"]');
            if(menuLink){
                document.querySelectorAll(".menu a").forEach(a=>a.classList.remove("active"));
                menuLink.classList.add("active");
            }
        }
    } else {
        (activeMenu || firstMenu)?.click?.();
    }
    

    // Close sidebar on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) document.body.classList.remove("sidebar-open");
    });
  });
})();
// ===============================
// AI HỌC TẬP (FREE - OpenRouter)
// ===============================

window.askAI = async function () {
  const input = document.getElementById("ai-input");
  const chatBox = document.getElementById("ai-chat-box");

  const message = input.value.trim();
  if (!message) return;

  // Tin nhắn người dùng
  chatBox.innerHTML += `
    <div class="bubble sent">
      ${message}
    </div>
  `;

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Loading
  chatBox.innerHTML += `
    <div class="bubble received" id="ai-loading">
      AI đang trả lời...
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
const response = await fetch("https://ai-server-phi.vercel.app/api/ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "openchat/openchat-3.5-0106",
    messages: [
      {
        role: "system",
        content: `Bạn là trợ lý AI chuyên hỗ trợ học sinh lớp 12A1 Lê Quý Đôn.


QUY TẮC BẮT BUỘC:
- Luôn trả lời hoàn toàn bằng tiếng Việt.
- Không dùng tiếng Anh.
- Không chèn ký tự lạ.
- Không dùng markdown như ** hoặc ##.
- Viết câu rõ ràng, tự nhiên, đúng ngữ pháp tiếng Việt.
- Nếu là bài văn: phải có mở bài, thân bài, kết bài.
- Nếu là bài tập: giải từng bước rõ ràng.`
      },
      {
        role: "user",
        content: message
      }
    ]
  })
});

    const data = await response.json();

    document.getElementById("ai-loading")?.remove();

    const aiReply =
      data.choices?.[0]?.message?.content ||
      "AI chưa thể trả lời.";

    chatBox.innerHTML += `
      <div class="bubble received">
        ${aiReply}
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    document.getElementById("ai-loading")?.remove();

    chatBox.innerHTML += `
      <div class="bubble received">
        ⚠️ Lỗi kết nối AI.
      </div>
    `;
  }
};

// ===============================
// QUẢN LÝ TRẠNG THÁI HỌC SINH PRO
// ===============================

window.toggleStatus = function(button){
    const row = button.closest("tr");
    if(!row) return;

    const badge = row.querySelector(".badge, .nonbadge");
    if(!badge) return;

    if(badge.classList.contains("nonbadge")){
        badge.classList.remove("nonbadge");
        badge.classList.add("badge");
        badge.textContent = "Đang học";
    } else {
        badge.classList.remove("badge");
        badge.classList.add("nonbadge");
        badge.textContent = "Vắng học";
    }

    updateAttendanceCount();
    saveStatus();
};

function updateAttendanceCount(){
    const total = document.querySelectorAll("#student-list tr").length;
    const present = document.querySelectorAll("#student-list .badge").length;

    const small = document.querySelector("#hoc-sinh small");
    if(small){
        small.textContent = "Sĩ số: " + total + " học sinh | " + present + " hiện diện";
    }
}

function saveStatus(){
    const rows = document.querySelectorAll("#student-list tr");
    const data = [];

    rows.forEach(row => {
        const name = row.querySelector("td:nth-child(2)")?.innerText.trim();
        const isPresent = row.querySelector(".badge") ? true : false;
        data.push({name, isPresent});
    });

    localStorage.setItem("studentStatus", JSON.stringify(data));
}

function loadStatus(){
    const today = new Date().toISOString().slice(0,10);
    const records = JSON.parse(localStorage.getItem("attendanceRecords_v1") || "{}");
    const todayData = records[today] || {};

    const rows = document.querySelectorAll("#student-list tr");

    rows.forEach(row => {
        const name = row.querySelector("td:nth-child(2)")?.innerText.trim();
        const badge = row.querySelector(".badge, .nonbadge");
        if(!badge) return;

        const rec = todayData[name];

        if(rec && rec.status === "absent"){
            badge.classList.remove("badge");
            badge.classList.add("nonbadge");
            badge.textContent = "Vắng học";
        } else {
            badge.classList.remove("nonbadge");
            badge.classList.add("badge");
            badge.textContent = "Đang học";
        }
    });

    updateAttendanceCount();
}

document.addEventListener("DOMContentLoaded", function(){
    loadStatus();
    updateAttendanceCount();
});

