
const STORAGE_KEYS = {
  theme: "theme",
  accent: "accentTheme_v1",
  lastPage: "lastPage",
  sidebar: "sidebarCollapsed_v1",
  students: "students_v1",
  attendance: "attendanceRecords_v1",
  attendanceMeta: "attendanceMeta_v1",
  chats: "classChatMessages_v1",
  schedule: "classSchedule_v1",
  profile: "profileInfo_v1",
  language: "language_v1",
  loginRequired: "loginRequired_v1",
  rememberLogin: "rememberLogin_v1"
};

const PAGE_TITLES = {
  "truong-hoc": "Trường học",
  "tong-quan": "Tổng quan",
  "diem-danh": "Điểm danh",
  "hoc-sinh": "Quản lý học sinh",
  "thoi-khoa-bieu": "Thời khóa biểu",
  "thong-bao": "Thông báo",
  "tai-lieu": "Tài liệu",
  "dinh-huong-nghe-nghiep": "Định hướng nghề nghiệp",
  "tin-nhan": "Tin nhắn",
  "ai-hoc-tap": "Học tập cùng AI",
  "ban-do": "Bản đồ",
  "cai-dat": "Cài đặt"
};


const MAP_GUIDES = [
  {
    title: "Điểm 1 • Khu vực cổng chính",
    description: "Khung xem nhanh khu vực trước cổng trường để định hướng lối vào ban đầu.",
    embed: "https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20c%E1%BB%95ng%20ch%C3%ADnh&output=embed",
    action: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20c%E1%BB%95ng%20ch%C3%ADnh"
  },
  {
    title: "Điểm 2 • Lối đi vào sân trường",
    description: "Khung định hướng tiếp theo để quan sát đường đi từ khu vực cổng vào bên trong trường.",
    embed: "https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20l%E1%BB%91i%20v%C3%A0o&output=embed",
    action: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20l%E1%BB%91i%20v%C3%A0o"
  },
  {
    title: "Điểm 3 • Khu vực dãy lớp",
    description: "Khung cuối để theo dõi hướng di chuyển sâu hơn về khu vực lớp học hoặc cổng lớp.",
    embed: "https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20d%C3%A3y%20l%E1%BB%9Bp&output=embed",
    action: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng%20THPT%20L%C3%AA%20Qu%C3%BD%20%C4%90%C3%B4n%20-%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20d%C3%A3y%20l%E1%BB%9Bp"
  }
];

const SUBJECT_TOKENS = [
  ["toan", ["toan"]],
  ["van", ["van hoc", "ngu van", "van"]],
  ["li", ["vat li", "vat ly", "li", "ly"]],
  ["hoa", ["hoa hoc", "hoa"]],
  ["sinh", ["sinh hoc", "sinh"]],
  ["anh", ["ngoai ngu", "tieng anh", "anh"]],
  ["su", ["lich su"]],
  ["tin", ["tin hoc", "tin"]],
  ["gdtc", ["gdtc"]],
  ["gdqpan", ["gdqpan"]],
  ["tnhn", ["tnhn", "hd tnhn", "hoat dong tnhn", "hđ tnhn"]],
  ["cc", ["chao co"]]
];

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // ignore storage failures in demo mode
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));
}

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  if (!dateStr) return "--/--/----";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.body.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);

  const toggle = qs("#darkToggleSetting");
  if (toggle) toggle.checked = nextTheme === "dark";

  const fab = qs(".theme-fab");
  if (fab) {
    const isDark = nextTheme === "dark";
    fab.textContent = isDark ? "☀️" : "🌙";
    fab.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
    fab.setAttribute("title", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
  }
}

window.toggleDarkMode = function toggleDarkMode(forceTheme) {
  if (forceTheme === "dark" || forceTheme === "light") {
    setTheme(forceTheme);
    return;
  }
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
};

function setAccent(accent) {
  const allowed = ["cyan", "indigo", "pink", "emerald"];
  const nextAccent = allowed.includes(accent) ? accent : "indigo";
  document.documentElement.setAttribute("data-accent", nextAccent);
  localStorage.setItem(STORAGE_KEYS.accent, nextAccent);
  qsa(".color-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.accent === nextAccent);
  });
}

function updatePageChrome(pageId) {
  const title = qs("#pageTitle");
  if (title) title.textContent = PAGE_TITLES[pageId] || "Bảng điều khiển";

  qsa(".menu a").forEach((link) => {
    const handler = link.getAttribute("onclick") || "";
    link.classList.toggle("active", handler.includes(`'${pageId}'`));
  });

  qsa(".quick-tool").forEach((button) => {
    const active = button.dataset.page === pageId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function redrawAttendanceChartSoon() {
  if (typeof window.renderAttendancePage === "function") {
    window.requestAnimationFrame(() => window.renderAttendancePage());
  }
}

window.showPage = function showPage(pageId, sourceElement) {
  const target = qs(`#${pageId}`);
  if (!target) return;

  qsa(".page").forEach((page) => page.classList.remove("active"));
  target.classList.add("active");
  localStorage.setItem(STORAGE_KEYS.lastPage, pageId);
  updatePageChrome(pageId);

  if (sourceElement && sourceElement.classList) {
    qsa(".menu a").forEach((link) => link.classList.remove("active"));
    sourceElement.classList.add("active");
  }

  document.body.classList.remove("sidebar-open");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageId === "diem-danh") {
    redrawAttendanceChartSoon();
  }
};

window.quickOpenPage = function quickOpenPage(pageId) {
  const menuLink = qsa(".menu a").find((link) => (link.getAttribute("onclick") || "").includes(`'${pageId}'`));
  window.showPage(pageId, menuLink || null);
};

window.toggleSidebar = function toggleSidebar() {
  if (window.innerWidth <= 960) {
    document.body.classList.toggle("sidebar-open");
    return;
  }

  const collapsed = !document.body.classList.contains("sidebar-collapsed");
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  localStorage.setItem(STORAGE_KEYS.sidebar, collapsed ? "1" : "0");
};

window.filterStudents = function filterStudents(input) {
  const keyword = normalizeText(input.value || "");
  qsa("#student-list tr").forEach((row) => {
    const text = normalizeText(qs("td:nth-child(2)", row)?.textContent || "");
    row.style.display = text.includes(keyword) ? "" : "none";
  });
};

window.switchChat = function switchChat(chatKey, element) {
  const map = {
    "co-tin": "co-tin",
    "ph-an": "chat-ph-an",
    "nhom-lop": "chat-nhom-lop"
  };

  const nextId = map[chatKey];
  if (!nextId) return;

  qsa(".chat-pane").forEach((pane) => pane.classList.remove("active"));
  const pane = qs(`#${nextId}`);
  if (pane) pane.classList.add("active");

  qsa(".contact-item").forEach((item) => item.classList.remove("active"));
  if (element) element.classList.add("active");
};

function applySavedSidebarState() {
  const collapsed = localStorage.getItem(STORAGE_KEYS.sidebar) === "1";
  document.body.classList.toggle("sidebar-collapsed", collapsed && window.innerWidth > 960);
}

function getStudentRows() {
  return qsa("#student-list tr");
}

function getStudentNames() {
  return getStudentRows().map((row) => {
    const nameCell = qs("td:nth-child(2)", row);
    return (nameCell?.textContent || "").trim();
  }).filter(Boolean);
}

function syncStudentsToStorage() {
  const students = getStudentNames().map((name) => ({ name }));
  writeJSON(STORAGE_KEYS.students, students);
}

function getStudentStatusMap() {
  const map = {};
  getStudentRows().forEach((row) => {
    const name = (qs("td:nth-child(2)", row)?.textContent || "").trim();
    const badge = qs(".badge, .nonbadge", row);
    if (!name || !badge) return;
    map[name] = badge.classList.contains("nonbadge") ? "absent" : "present";
  });
  return map;
}

function updateStudentCount() {
  const total = getStudentRows().length;
  const present = qsa("#student-list .badge").length;
  const small = qs("#hoc-sinh small");
  if (small) {
    small.textContent = `Sĩ số: ${total} học sinh | ${present} hiện diện`;
  }
}

function setStudentRowStatus(row, status) {
  const badge = qs(".badge, .nonbadge", row);
  if (!badge) return;
  const isAbsent = status === "absent";
  badge.classList.toggle("badge", !isAbsent);
  badge.classList.toggle("nonbadge", isAbsent);
  badge.textContent = isAbsent ? "Vắng học" : "Đang học";
}

function syncTodayAttendanceFromTable() {
  const records = readJSON(STORAGE_KEYS.attendance, {});
  const date = todayISO();
  records[date] = records[date] || {};

  getStudentRows().forEach((row) => {
    const name = (qs("td:nth-child(2)", row)?.textContent || "").trim();
    if (!name) return;
    records[date][name] = {
      ...(records[date][name] || {}),
      status: qs(".nonbadge", row) ? "absent" : "present"
    };
  });

  writeJSON(STORAGE_KEYS.attendance, records);
}

function applyTodayAttendanceToStudentTable() {
  const records = readJSON(STORAGE_KEYS.attendance, {});
  const daily = records[todayISO()] || {};
  getStudentRows().forEach((row) => {
    const name = (qs("td:nth-child(2)", row)?.textContent || "").trim();
    const nextStatus = daily[name]?.status;
    if (nextStatus) setStudentRowStatus(row, nextStatus);
  });
  updateStudentCount();
}

function toggleStudentRow(row) {
  const isAbsent = !!qs(".nonbadge", row);
  setStudentRowStatus(row, isAbsent ? "present" : "absent");
  updateStudentCount();
  syncTodayAttendanceFromTable();
  redrawAttendanceChartSoon();
}

function enhanceStudentActions() {
  getStudentRows().forEach((row) => {
    const actionCell = row.lastElementChild;
    if (!actionCell) return;

    if (!qs("button", actionCell)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "edit-btn";
      button.textContent = (actionCell.textContent || "✏️").trim() || "✏️";
      button.setAttribute("aria-label", "Đổi trạng thái học sinh");
      button.setAttribute("title", "Đổi trạng thái học sinh");
      actionCell.innerHTML = "";
      actionCell.appendChild(button);
    }

    const actionButton = qs("button", actionCell);
    if (actionButton && !actionButton.dataset.bound) {
      actionButton.dataset.bound = "true";
      actionButton.addEventListener("click", () => toggleStudentRow(row));
    }

    const badge = qs(".badge, .nonbadge", row);
    if (badge && !badge.dataset.bound) {
      badge.dataset.bound = "true";
      badge.style.cursor = "pointer";
      badge.title = "Bấm để đổi trạng thái";
      badge.addEventListener("click", () => toggleStudentRow(row));
    }
  });
}

function getAttendanceRecords() {
  return readJSON(STORAGE_KEYS.attendance, {});
}

function saveAttendanceRecords(records) {
  writeJSON(STORAGE_KEYS.attendance, records);
}

function getActiveAttendanceDate() {
  const input = qs("#attendanceDate");
  if (!input) return todayISO();
  if (!input.value) input.value = todayISO();
  return input.value;
}

function ensureAttendanceDefaults(date) {
  const records = getAttendanceRecords();
  records[date] = records[date] || {};
  const todayMap = getStudentStatusMap();

  getStudentNames().forEach((name) => {
    if (!records[date][name]) {
      records[date][name] = {
        status: date === todayISO() ? (todayMap[name] || "present") : "present"
      };
    }
  });

  saveAttendanceRecords(records);
  return records;
}

function renderAbsenceChart(records) {
  const canvas = qs("#absenceChart");
  if (!canvas) return;
  const ctx = typeof canvas.getContext === "function" ? canvas.getContext("2d") : null;
  if (!ctx) return;
  const width = canvas.clientWidth || 400;
  const height = Number(canvas.getAttribute("height")) || 240;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const dates = Object.keys(records).sort().slice(-7);
  if (!dates.length) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#64748b";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("Chưa có dữ liệu để hiển thị.", 18, 28);
    return;
  }

  const values = dates.map((date) => Object.values(records[date] || {}).filter((item) => (item?.status || "present") === "absent").length);
  const labels = dates.map((date) => date.slice(5).replace("-", "/"));
  const maxValue = Math.max(1, ...values);
  const padding = 28;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 18;
  const step = chartWidth / values.length;
  const barWidth = Math.min(46, step * 0.6);
  const isDark = document.body.classList.contains("dark");
  const lineColor = isDark ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.24)";
  const textColor = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || (isDark ? "#94a3b8" : "#64748b");
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6366f1";
  const accentStrong = getComputedStyle(document.documentElement).getPropertyValue("--accent-strong").trim() || "#4f46e5";

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= maxValue; i += 1) {
    const y = padding + chartHeight - (chartHeight * (i / maxValue));
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  values.forEach((value, index) => {
    const x = padding + index * step + (step - barWidth) / 2;
    const barHeight = (value / maxValue) * chartHeight;
    const y = padding + chartHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, y + Math.max(barHeight, 12));
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, accentStrong);

    const radius = Math.min(12, barWidth / 2, Math.max(12, barHeight) / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + barWidth, y, x + barWidth, y + Math.max(barHeight, 12), radius);
    ctx.arcTo(x + barWidth, y + Math.max(barHeight, 12), x, y + Math.max(barHeight, 12), radius);
    ctx.arcTo(x, y + Math.max(barHeight, 12), x, y, radius);
    ctx.arcTo(x, y, x + barWidth, y, radius);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(value), x + barWidth / 2, y - 8);
    ctx.fillText(labels[index], x + barWidth / 2, height - 8);
  });
}

function renderAttendancePage() {
  const list = qs("#attendanceList");
  if (!list) return;

  const date = getActiveAttendanceDate();
  const records = ensureAttendanceDefaults(date);
  const daily = records[date] || {};
  const students = getStudentNames();

  if (!students.length) {
    list.innerHTML = '<div class="attendance-empty">Chưa có danh sách học sinh để điểm danh.</div>';
    return;
  }

  list.innerHTML = students.map((name, index) => {
    const record = daily[name] || { status: "present" };
    const status = record.status === "absent" ? "absent" : "present";
    return `
      <div class="attendance-student" data-name="${escapeHtml(name)}">
        <div>
          <strong>${index + 1}. ${escapeHtml(name)}</strong>
          <small>${status === "absent" ? "Đang ghi nhận vắng" : "Đang ghi nhận có mặt"}</small>
        </div>
        <div class="attendance-toggle">
          <button type="button" data-status="present" class="${status === "present" ? "active present" : ""}">Có mặt</button>
          <button type="button" data-status="absent" class="${status === "absent" ? "active absent" : ""}">Vắng</button>
        </div>
      </div>
    `;
  }).join("");

  qsa(".attendance-student").forEach((row) => {
    const name = row.dataset.name || "";
    qsa("button[data-status]", row).forEach((button) => {
      button.addEventListener("click", () => {
        const allRecords = getAttendanceRecords();
        allRecords[date] = allRecords[date] || {};
        allRecords[date][name] = { ...(allRecords[date][name] || {}), status: button.dataset.status };
        saveAttendanceRecords(allRecords);
        if (date === todayISO()) {
          getStudentRows().forEach((studentRow) => {
            const studentName = (qs("td:nth-child(2)", studentRow)?.textContent || "").trim();
            if (studentName === name) setStudentRowStatus(studentRow, button.dataset.status);
          });
          updateStudentCount();
        }
        renderAttendancePage();
      });
    });
  });

  const total = students.length;
  const absent = students.filter((name) => (daily[name]?.status || "present") === "absent").length;
  const present = total - absent;

  const totalEl = qs("#attTotal");
  const presentEl = qs("#attPresent");
  const absentEl = qs("#attAbsent");
  if (totalEl) totalEl.textContent = String(total);
  if (presentEl) presentEl.textContent = String(present);
  if (absentEl) absentEl.textContent = String(absent);

  const summary = qs("#absenceSummary");
  if (summary) {
    summary.textContent = `Ngày ${formatDate(date)}: ${present} có mặt • ${absent} vắng • tổng ${total} học sinh.`;
  }

  const rankingBody = qs("#absenceTable");
  if (rankingBody) {
    const countMap = {};
    Object.values(records).forEach((day) => {
      Object.entries(day || {}).forEach(([name, record]) => {
        if ((record?.status || "present") === "absent") {
          countMap[name] = (countMap[name] || 0) + 1;
        }
      });
    });

    const ranking = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
    rankingBody.innerHTML = ranking.length
      ? ranking.map(([name, count], index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(name)}</td>
            <td><strong>${count}</strong></td>
          </tr>
        `).join("")
      : '<tr><td colspan="3" style="text-align:center; color:var(--muted);">Chưa có lượt vắng nào được ghi nhận.</td></tr>';
  }

  renderAbsenceChart(records);
}

window.renderAttendancePage = renderAttendancePage;
window.loadAttendanceForDate = renderAttendancePage;
window.saveAttendanceForDate = function saveAttendanceForDate() {
  const date = getActiveAttendanceDate();
  const records = ensureAttendanceDefaults(date);
  const owner = qs("#attendanceOwner")?.value || "";
  const meta = readJSON(STORAGE_KEYS.attendanceMeta, {});
  meta[date] = { ...(meta[date] || {}), owner };
  writeJSON(STORAGE_KEYS.attendanceMeta, meta);
  saveAttendanceRecords(records);
  alert(`Đã lưu điểm danh cho ngày ${formatDate(date)}.`);
  if (date === todayISO()) applyTodayAttendanceToStudentTable();
};
window.markAllPresent = function markAllPresent() {
  const date = getActiveAttendanceDate();
  const records = ensureAttendanceDefaults(date);
  getStudentNames().forEach((name) => {
    records[date][name] = { ...(records[date][name] || {}), status: "present" };
  });
  saveAttendanceRecords(records);
  if (date === todayISO()) applyTodayAttendanceToStudentTable();
  renderAttendancePage();
};
window.markAllAbsent = function markAllAbsent() {
  const date = getActiveAttendanceDate();
  const records = ensureAttendanceDefaults(date);
  getStudentNames().forEach((name) => {
    records[date][name] = { ...(records[date][name] || {}), status: "absent" };
  });
  saveAttendanceRecords(records);
  if (date === todayISO()) applyTodayAttendanceToStudentTable();
  renderAttendancePage();
};

function getSubjectKey(value) {
  const normalized = normalizeText(value);
  if (!normalized || normalized === "...") return "";
  for (const [key, tokens] of SUBJECT_TOKENS) {
    if (tokens.some((token) => normalized.includes(token))) {
      return key;
    }
  }
  return "";
}

function applyTimetableClasses() {
  qsa(".tkb-input").forEach((input) => {
    input.className = "tkb-input";
    const subject = getSubjectKey(input.value);
    if (subject) input.classList.add(`subject-${subject}`);
  });
}

function loadTimetable() {
  const saved = readJSON(STORAGE_KEYS.schedule, []);
  const inputs = qsa(".tkb-input");
  if (saved.length === inputs.length) {
    inputs.forEach((input, index) => {
      input.value = saved[index];
    });
  }
  applyTimetableClasses();
}

function saveTimetable() {
  const values = qsa(".tkb-input").map((input) => input.value.trim());
  writeJSON(STORAGE_KEYS.schedule, values);
  applyTimetableClasses();
  alert("Đã lưu thời khóa biểu.");
}

function appendBubble(container, text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function initChatComposer() {
  const input = qs(".chat-input");
  const sendButton = qs(".chat-send");
  if (!input || !sendButton) return;

  const savedMessages = readJSON(STORAGE_KEYS.chats, {});
  Object.entries(savedMessages).forEach(([paneId, messages]) => {
    const pane = qs(`#${paneId}`);
    const area = pane ? qs(".msg-area", pane) : null;
    if (!area) return;
    messages.forEach((message) => appendBubble(area, message, "sent"));
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    const activePane = qs(".chat-pane.active .msg-area");
    const pane = qs(".chat-pane.active");
    if (!activePane || !pane) return;

    appendBubble(activePane, text, "sent");
    const messages = readJSON(STORAGE_KEYS.chats, {});
    messages[pane.id] = messages[pane.id] || [];
    messages[pane.id].push(text);
    writeJSON(STORAGE_KEYS.chats, messages);
    input.value = "";
  }

  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });
}

const AI_SYSTEM_PROMPT = [
  "Bạn là trợ lý học tập cho học sinh lớp 12A1.",
  "Luôn trả lời hoàn toàn bằng tiếng Việt.",
  "Không dùng markdown như **, ## hoặc bảng.",
  "Nếu là bài tập, giải từng bước rõ ràng.",
  "Nếu là bài văn, trình bày mở bài, thân bài, kết bài.",
  "Nếu thiếu dữ kiện, hỏi ngắn gọn để làm rõ."
].join(" ");

window.askAI = async function askAI() {
  const input = qs("#ai-input");
  const chatBox = qs("#ai-chat-box");
  if (!input || !chatBox) return;

  const message = input.value.trim();
  if (!message) return;

  appendBubble(chatBox, message, "sent");
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "bubble received";
  loading.id = "ai-loading";
  loading.textContent = "AI đang trả lời...";
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);

    const response = await fetch("https://ai-server-orcin-three.vercel.app/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          { role: "user", content: message }
        ]
      })
    });

    window.clearTimeout(timer);
    loading.remove();

    if (!response.ok) {
      appendBubble(chatBox, "Hiện tại chưa thể kết nối tới máy chủ AI.", "received");
      return;
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "AI chưa thể trả lời ở thời điểm này.";
    appendBubble(chatBox, reply, "received");
  } catch (error) {
    loading.remove();
    appendBubble(chatBox, "Hiện tại chưa thể kết nối tới máy chủ AI.", "received");
  }
};

function applyProfile() {
  const defaults = {
    name: "Nguyễn Thế Phát",
    email: "phatnguyen262008@school.edu.vn"
  };
  const profile = { ...defaults, ...readJSON(STORAGE_KEYS.profile, {}) };

  const accountCard = qs("#cai-dat .card");
  const inputs = accountCard ? qsa(".input-field", accountCard) : [];
  const nameInput = inputs[0];
  const emailInput = inputs[1];

  if (nameInput) nameInput.value = profile.name;
  if (emailInput) emailInput.value = profile.email;

  const pill = qs(".utility-user-pill span");
  if (pill) pill.textContent = `👤 ${profile.name}`;
}

function initSettings() {
  const cards = qsa("#cai-dat .card");
  const profileCard = cards[0];
  const appearanceCard = cards[1];
  const dangerCard = cards[2];

  if (profileCard) {
    const inputs = qsa(".input-field", profileCard);
    const saveButton = qs(".btn-gradient", profileCard);
    if (saveButton && inputs.length >= 2) {
      saveButton.addEventListener("click", () => {
        writeJSON(STORAGE_KEYS.profile, {
          name: inputs[0].value.trim() || "Nguyễn Thế Phát",
          email: inputs[1].value.trim() || "phatnguyen262008@school.edu.vn"
        });
        applyProfile();
        alert("Đã lưu thông tin tài khoản.");
      });
    }
  }

  if (appearanceCard) {
    const language = qs("select.input-field", appearanceCard);
    if (language) {
      const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
      if (savedLanguage) language.value = savedLanguage;
      language.addEventListener("change", () => localStorage.setItem(STORAGE_KEYS.language, language.value));
    }

    const accentNames = ["cyan", "indigo", "pink", "emerald"];
    qsa(".color-dot", appearanceCard).forEach((dot, index) => {
      dot.dataset.accent = accentNames[index] || "indigo";
      dot.addEventListener("click", () => setAccent(dot.dataset.accent));
    });
  }

  if (dangerCard) {
    const buttons = qsa("button", dangerCard);
    const exportButton = buttons.find((button) => /csv/i.test(button.textContent || ""));
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        const rows = getStudentRows().map((row) => qsa("td", row).map((cell) => `"${(cell.textContent || "").trim().replace(/"/g, '""')}"`).join(","));
        const header = qsa("#hoc-sinh thead th").map((cell) => `"${(cell.textContent || "").trim()}"`).join(",");
        const csv = [header, ...rows].join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "du-lieu-lop-12A1.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      });
    }
  }
}

function disableUnavailableActions() {
  qsa('a[data-disabled="true"], a[href=""]').forEach((anchor) => {
    anchor.classList.add("is-disabled");
    anchor.setAttribute("aria-disabled", "true");
    anchor.addEventListener("click", (event) => event.preventDefault());
  });

  qsa("button").forEach((button) => {
    if (/sắp có/i.test(button.textContent || "")) {
      button.disabled = true;
      button.classList.add("is-disabled");
      button.title = "Chưa có tệp đính kèm trong giao diện hiện tại";
    }
  });
}

function initLogin() {
  const modal = qs("#loginModal");
  const backdrop = qs("#loginBackdrop");
  const userInput = qs("#loginUser");
  const passInput = qs("#loginPass");
  const errorBox = qs("#loginError");
  const remember = qs("#rememberMe");
  if (!modal || !backdrop || !userInput || !passInput || !errorBox || !remember) return;

  function openLogin() {
    modal.style.display = "flex";
    backdrop.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    localStorage.setItem(STORAGE_KEYS.loginRequired, "1");
    userInput.focus();
  }

  function closeLogin() {
    modal.style.display = "none";
    backdrop.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
    errorBox.style.display = "none";
    errorBox.textContent = "";
    if (remember.checked) {
      localStorage.setItem(STORAGE_KEYS.rememberLogin, "1");
    } else {
      localStorage.removeItem(STORAGE_KEYS.rememberLogin);
    }
  }

  window.logout = function logout() {
    sessionStorage.removeItem("auth_ok");
    if (!remember.checked) {
      localStorage.removeItem("auth_ok");
    }
    openLogin();
  };

  window.doLogin = function doLogin() {
    const username = userInput.value.trim();
    const password = passInput.value.trim();
    const valid = username === "admin" && password === "1234";

    if (!valid) {
      errorBox.textContent = "Tên đăng nhập hoặc mật khẩu chưa đúng.";
      errorBox.style.display = "block";
      return;
    }

    sessionStorage.setItem("auth_ok", "1");
    if (remember.checked) {
      localStorage.setItem("auth_ok", "1");
    } else {
      localStorage.removeItem("auth_ok");
    }
    localStorage.removeItem(STORAGE_KEYS.loginRequired);
    closeLogin();
  };

  passInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") window.doLogin();
  });

  backdrop.addEventListener("click", () => {
    if (sessionStorage.getItem("auth_ok") === "1" || localStorage.getItem("auth_ok") === "1") {
      closeLogin();
    }
  });

  const loginRequired = localStorage.getItem(STORAGE_KEYS.loginRequired) === "1";
  const authenticated = sessionStorage.getItem("auth_ok") === "1" || localStorage.getItem("auth_ok") === "1";
  if (loginRequired && !authenticated) openLogin();
}

function initCommonEvents() {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('.menu a[href="#"]');
    if (anchor) event.preventDefault();

    if (event.target.classList.contains("sidebar-backdrop")) {
      document.body.classList.remove("sidebar-open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) document.body.classList.remove("sidebar-open");
    applySavedSidebarState();
    renderAttendancePage();
  });

  window.addEventListener("storage", (event) => {
    if (!event.key || event.key === STORAGE_KEYS.theme) {
      setTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light");
    }
    if (!event.key || event.key === STORAGE_KEYS.accent) {
      setAccent(localStorage.getItem(STORAGE_KEYS.accent) || "indigo");
    }
    if (!event.key || event.key === STORAGE_KEYS.attendance) {
      renderAttendancePage();
      applyTodayAttendanceToStudentTable();
    }
  });
}

function initPageState() {
  const savedPage = localStorage.getItem(STORAGE_KEYS.lastPage) || "truong-hoc";
  window.showPage(savedPage, qsa(".menu a").find((link) => (link.getAttribute("onclick") || "").includes(`'${savedPage}'`)) || null);
}

function initAttendanceOwner() {
  const owner = qs("#attendanceOwner");
  if (!owner) return;
  const date = getActiveAttendanceDate();
  const meta = readJSON(STORAGE_KEYS.attendanceMeta, {});
  if (meta[date]?.owner) owner.value = meta[date].owner;
  owner.addEventListener("change", () => {
    const allMeta = readJSON(STORAGE_KEYS.attendanceMeta, {});
    allMeta[getActiveAttendanceDate()] = { ...(allMeta[getActiveAttendanceDate()] || {}), owner: owner.value };
    writeJSON(STORAGE_KEYS.attendanceMeta, allMeta);
  });
}



function renderMapGuides() {
  const grid = qs("#mapGuideGrid");
  if (!grid) return;

  grid.innerHTML = MAP_GUIDES.map((item) => `
    <article class="map-guide-card">
      <div class="map-guide-media">
        ${item.embed ? `<iframe title="${escapeHtml(item.title)}" src="${item.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<div class="map-guide-fallback"><span>🎬</span><strong>${escapeHtml(item.title)}</strong><span>Thêm liên kết Street View để hiển thị.</span></div>`}
      </div>
      <div class="map-guide-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="btn-download map-guide-link" href="${item.action || '#'}" target="_blank" rel="noopener noreferrer">Mở toàn màn hình</a>
      </div>
    </article>
  `).join("");
}


function runSafeInit(label, initializer) {
  try {
    initializer();
  } catch (error) {
    console.error(`[init:${label}]`, error);
  }
}

function initDocumentButtons() {
  qsa("button").forEach((button) => {
    if ((button.textContent || "").includes("Drive") && !button.dataset.bound) {
      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const folderGrid = qs("#tai-lieu .grid-4");
        if (folderGrid) {
          folderGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  runSafeInit("theme", () => setTheme(localStorage.getItem(STORAGE_KEYS.theme) || "light"));
  runSafeInit("accent", () => setAccent(localStorage.getItem(STORAGE_KEYS.accent) || "indigo"));
  runSafeInit("sidebar-state", applySavedSidebarState);
  runSafeInit("common-events", initCommonEvents);
  runSafeInit("page-state", initPageState);

  runSafeInit("students-sync", syncStudentsToStorage);
  runSafeInit("student-actions", enhanceStudentActions);
  runSafeInit("student-count", updateStudentCount);
  runSafeInit("today-attendance", applyTodayAttendanceToStudentTable);
  runSafeInit("timetable-load", loadTimetable);
  runSafeInit("profile", applyProfile);
  runSafeInit("settings", initSettings);
  runSafeInit("chat-composer", initChatComposer);
  runSafeInit("attendance-owner", initAttendanceOwner);
  runSafeInit("login", initLogin);
  runSafeInit("disable-actions", disableUnavailableActions);
  runSafeInit("document-buttons", initDocumentButtons);
  runSafeInit("map-guides", renderMapGuides);

  const attendanceDate = qs("#attendanceDate");
  if (attendanceDate) {
    attendanceDate.value = attendanceDate.value || todayISO();
    attendanceDate.addEventListener("change", () => {
      runSafeInit("attendance-owner", initAttendanceOwner);
      runSafeInit("attendance-page", renderAttendancePage);
    });
  }

  const timetableSave = qs("#thoi-khoa-bieu .btn.btn-primary");
  if (timetableSave) timetableSave.addEventListener("click", saveTimetable);
  qsa(".tkb-input").forEach((input) => input.addEventListener("input", applyTimetableClasses));

  runSafeInit("attendance-page", renderAttendancePage);
});


/* ===== BEAUTIFIED CUSTOM LAYER ===== */
const INTRO_STORAGE_KEY = 'homeIntroProfiles_v1';
const DOC_FILTER_STORAGE_KEY = 'documentFilter_v1';
const DOC_SEARCH_STORAGE_KEY = 'documentSearch_v1';
const AI_CHAT_STORAGE_KEY = 'aiChatHistory_v1';

const DEFAULT_INTRO_CARDS = [
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' },
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' },
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' }
];

const baseSetTheme = setTheme;
setTheme = function setThemeEnhanced(theme) {
  baseSetTheme(theme);
  const status = qs('#settingsThemeStatus');
  if (status) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark');
    status.textContent = isDark ? 'Tối' : 'Sáng';
  }
};

const baseApplyProfile = applyProfile;
applyProfile = function applyProfileEnhanced() {
  baseApplyProfile();
  const defaults = {
    name: 'Nguyễn Thế Phát',
    email: 'phatnguyen262008@school.edu.vn'
  };
  const profile = { ...defaults, ...readJSON(STORAGE_KEYS.profile, {}) };
  const summaryName = qs('#settingsSummaryName');
  const summaryEmail = qs('#settingsSummaryEmail');
  if (summaryName) summaryName.textContent = profile.name;
  if (summaryEmail) summaryEmail.textContent = profile.email;
};

function mergeIntroCards(values) {
  const safeValues = Array.isArray(values) ? values : [];
  return DEFAULT_INTRO_CARDS.map((defaults, index) => ({
    ...defaults,
    ...(safeValues[index] || {})
  }));
}

function readIntroCards() {
  return mergeIntroCards(readJSON(INTRO_STORAGE_KEY, DEFAULT_INTRO_CARDS));
}

function setIntroImage(index, dataUrl) {
  const preview = qs(`[data-intro-preview="${index}"]`);
  const wrap = qs(`[data-intro-avatar="${index}"]`);
  if (!preview || !wrap) return;
  preview.src = dataUrl || '';
  preview.dataset.image = dataUrl || '';
  wrap.classList.toggle('has-image', !!dataUrl);
}

function populateIntroBoard() {
  const cards = readIntroCards();
  cards.forEach((item, index) => {
    qsa(`.intro-input[data-intro-index="${index}"]`).forEach((input) => {
      const field = input.dataset.introField;
      input.value = item[field] || '';
    });
    setIntroImage(index, item.image || '');
  });
}

function collectIntroCards() {
  return qsa('.intro-profile-card').map((card, index) => {
    const data = { ...DEFAULT_INTRO_CARDS[index] };
    qsa('.intro-input', card).forEach((input) => {
      data[input.dataset.introField] = input.value.trim();
    });
    data.image = qs(`[data-intro-preview="${index}"]`)?.dataset.image || '';
    return data;
  });
}

function saveIntroBoard(showNotice = false) {
  writeJSON(INTRO_STORAGE_KEY, collectIntroCards());
  if (showNotice) alert('Đã lưu phần giới thiệu trên Trang chủ.');
}

let introAutosaveTimer = 0;
function queueIntroAutosave() {
  window.clearTimeout(introAutosaveTimer);
  introAutosaveTimer = window.setTimeout(() => saveIntroBoard(false), 220);
}

function resizeImageToSquare(file, size = 320) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        const scale = Math.max(size / image.width, size / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const offsetX = (size - drawWidth) / 2;
        const offsetY = (size - drawHeight) / 2;
        context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      image.onerror = () => reject(new Error('image-load-failed'));
      image.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('file-read-failed'));
    reader.readAsDataURL(file);
  });
}

function initIntroBoard() {
  if (!qs('.home-intro-board')) return;
  populateIntroBoard();

  const saveButton = qs('#saveIntroBoard');
  if (saveButton && !saveButton.dataset.bound) {
    saveButton.dataset.bound = 'true';
    saveButton.addEventListener('click', () => saveIntroBoard(true));
  }

  qsa('.intro-input').forEach((input) => {
    if (input.dataset.bound) return;
    input.dataset.bound = 'true';
    input.addEventListener('input', queueIntroAutosave);
    input.addEventListener('change', () => saveIntroBoard(false));
  });

  qsa('[data-intro-upload]').forEach((input) => {
    if (input.dataset.bound) return;
    input.dataset.bound = 'true';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const imageData = await resizeImageToSquare(file, 320);
        setIntroImage(input.dataset.introUpload, imageData);
        saveIntroBoard(false);
      } catch (error) {
        alert('Không thể đọc ảnh đại diện. Vui lòng thử lại với một ảnh khác.');
      }
      input.value = '';
    });
  });
}

function setActiveDocFilter(filter) {
  qsa('.doc-filter-chip').forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  localStorage.setItem(DOC_FILTER_STORAGE_KEY, filter);
  applyDocumentFilters();
}

function applyDocumentFilters() {
  const searchInput = qs('#documentSearch');
  const keyword = normalizeText(searchInput?.value || '');
  const activeFilter = qs('.doc-filter-chip.active')?.dataset.filter || localStorage.getItem(DOC_FILTER_STORAGE_KEY) || 'all';
  const folderLinks = qsa('.doc-folder-link');
  const fileRows = qsa('.doc-file-row');
  let visibleFolders = 0;
  let visibleFiles = 0;

  folderLinks.forEach((link) => {
    const text = normalizeText(link.textContent || '');
    const matchesKeyword = !keyword || text.includes(keyword);
    const matchesFilter = activeFilter === 'all' || activeFilter === 'folders' || activeFilter === 'zip';
    const visible = matchesKeyword && matchesFilter;
    link.style.display = visible ? '' : 'none';
    if (visible) visibleFolders += 1;
  });

  fileRows.forEach((row) => {
    const text = normalizeText(row.textContent || '');
    const type = normalizeText(qs('.file-type', row)?.textContent || '');
    const matchesKeyword = !keyword || text.includes(keyword);
    const matchesFilter = activeFilter === 'all' || type.includes(activeFilter);
    const visible = matchesKeyword && matchesFilter && activeFilter !== 'folders' && activeFilter !== 'zip';
    row.style.display = visible ? '' : 'none';
    if (visible) visibleFiles += 1;
  });

  const summary = qs('#documentResultSummary');
  if (summary) {
    if (!keyword && activeFilter === 'all') {
      summary.textContent = `Đang hiển thị ${visibleFolders} thư mục và ${visibleFiles} tài liệu.`;
    } else {
      summary.textContent = `Kết quả hiện tại: ${visibleFolders} thư mục • ${visibleFiles} tài liệu phù hợp.`;
    }
  }

  const emptyState = qs('#documentEmptyState');
  if (emptyState) emptyState.hidden = visibleFolders + visibleFiles > 0;
}

function initDocumentFilters() {
  const searchInput = qs('#documentSearch');
  if (!searchInput) return;
  searchInput.value = localStorage.getItem(DOC_SEARCH_STORAGE_KEY) || '';
  searchInput.addEventListener('input', () => {
    localStorage.setItem(DOC_SEARCH_STORAGE_KEY, searchInput.value);
    applyDocumentFilters();
  });

  const savedFilter = localStorage.getItem(DOC_FILTER_STORAGE_KEY) || 'all';
  qsa('.doc-filter-chip').forEach((button) => {
    if (!button.dataset.bound) {
      button.dataset.bound = 'true';
      button.addEventListener('click', () => setActiveDocFilter(button.dataset.filter || 'all'));
    }
    button.classList.toggle('active', button.dataset.filter === savedFilter);
  });

  applyDocumentFilters();
}

const baseSwitchChat = window.switchChat;
window.switchChat = function switchChatEnhanced(chatKey, element) {
  baseSwitchChat(chatKey, element);
  const input = qs('.chat-input');
  if (!input) return;
  const placeholders = {
    'co-tin': 'Viết tin nhắn cho cô giáo Tin học...',
    'ph-an': 'Viết tin nhắn cho phụ huynh em An...',
    'nhom-lop': 'Gửi tin nhắn vào nhóm lớp 12A1...'
  };
  input.placeholder = placeholders[chatKey] || 'Viết tin nhắn...';
  input.focus();
};

function initChatShortcuts() {
  qsa('.chat-chip').forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const input = qs('.chat-input');
      if (!input) return;
      input.value = button.dataset.quickMessage || '';
      input.focus();
    });
  });
}

function saveAiMessage(role, text) {
  const history = readJSON(AI_CHAT_STORAGE_KEY, []);
  history.push({ role, text });
  writeJSON(AI_CHAT_STORAGE_KEY, history.slice(-40));
}

function renderAiHistory() {
  const chatBox = qs('#ai-chat-box');
  if (!chatBox) return;
  const history = readJSON(AI_CHAT_STORAGE_KEY, []);
  if (!history.length || chatBox.childElementCount) return;
  history.forEach((item) => {
    appendBubble(chatBox, item.text, item.role === 'assistant' ? 'received' : 'sent');
  });
}

window.clearAiChat = function clearAiChat() {
  writeJSON(AI_CHAT_STORAGE_KEY, []);
  const chatBox = qs('#ai-chat-box');
  if (chatBox) chatBox.innerHTML = '';
};

window.askAI = async function askAIEnhanced() {
  const input = qs('#ai-input');
  const chatBox = qs('#ai-chat-box');
  if (!input || !chatBox) return;

  const message = input.value.trim();
  if (!message) return;

  appendBubble(chatBox, message, 'sent');
  saveAiMessage('user', message);
  input.value = '';

  const loading = document.createElement('div');
  loading.className = 'bubble received';
  loading.id = 'ai-loading';
  loading.textContent = 'AI đang trả lời...';
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);

    const response = await fetch('https://ai-server-orcin-three.vercel.app/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: message }
        ]
      })
    });

    window.clearTimeout(timer);
    loading.remove();

    if (!response.ok) {
      const fallback = 'Hiện tại chưa thể kết nối tới máy chủ AI.';
      appendBubble(chatBox, fallback, 'received');
      saveAiMessage('assistant', fallback);
      return;
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'AI chưa thể trả lời ở thời điểm này.';
    appendBubble(chatBox, reply, 'received');
    saveAiMessage('assistant', reply);
  } catch (error) {
    loading.remove();
    const fallback = 'Hiện tại chưa thể kết nối tới máy chủ AI.';
    appendBubble(chatBox, fallback, 'received');
    saveAiMessage('assistant', fallback);
  }
};

function initAiEnhancements() {
  renderAiHistory();
  const input = qs('#ai-input');

  qsa('.ai-suggestion-chip').forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      if (!input) return;
      input.value = button.dataset.aiPrompt || '';
      input.focus();
    });
  });

  const clearButton = qs('#clearAiChat');
  if (clearButton && !clearButton.dataset.bound) {
    clearButton.dataset.bound = 'true';
    clearButton.addEventListener('click', () => window.clearAiChat());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initIntroBoard();
  initDocumentFilters();
  initChatShortcuts();
  initAiEnhancements();
  applyProfile();
  setTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'light');
});



/* ===== SCHOOL GALLERY + CLASS COMMUNITY ===== */
const LEADERSHIP_PROFILES = [
  {
    name: 'Hiệu trưởng',
    tag: 'Ban giám hiệu',
    title: 'Đầu tàu định hướng chiến lược phát triển nhà trường',
    description: 'Phụ trách định hướng chung, giữ vững chất lượng giáo dục và xây dựng môi trường học đường kỷ cương, an toàn, hạnh phúc.',
    image: 'images/tatca/bgh_01.jpg'
  },
  {
    name: 'Phó Hiệu trưởng',
    tag: 'Chuyên môn',
    title: 'Phụ trách chất lượng dạy học và đổi mới phương pháp',
    description: 'Theo dõi công tác chuyên môn, hỗ trợ giáo viên triển khai các hoạt động học tập, STEM và ứng dụng công nghệ trong dạy học.',
    image: 'images/tatca/bgh_02.jpg'
  },
  {
    name: 'Phó Hiệu trưởng',
    tag: 'Nề nếp - hoạt động',
    title: 'Đồng hành với học sinh trong nề nếp, phong trào và kỹ năng',
    description: 'Phụ trách công tác nền nếp, hoạt động tập thể và phối hợp với giáo viên chủ nhiệm để tạo nên môi trường học đường tích cực.',
    image: 'images/tatca/bgh_03.jpg'
  }
];

const HOMEROOM_PROFILE = {
  name: 'Lê Thị Hồng Hạnh',
  tag: 'GVCN lớp 12A1',
  title: 'Giáo viên chủ nhiệm đồng hành cùng tập thể 12A1',
  description: 'Là người kết nối học sinh, phụ huynh và giáo viên bộ môn; đồng thời định hướng học tập, nề nếp và tinh thần đoàn kết của lớp.',
  image: 'images/tatca/gvcn_12a1.jpg'
};

const SUBJECT_TEACHER_PROFILES = [
  { name: 'Nguyễn Văn Danh', tag: 'Toán học', title: 'Tư duy logic • phân tích • giải quyết vấn đề', description: 'Phụ trách củng cố kiến thức trọng tâm và chiến lược làm bài theo từng chuyên đề.', image: 'images/tatca/gvbm_01.jpg' },
  { name: 'Huỳnh Thị Thanh Hương', tag: 'Tin học', title: 'Công nghệ số • thuật toán • kỹ năng ứng dụng', description: 'Đồng hành trong các nội dung về CNTT, ứng dụng số và tư duy công nghệ cho học sinh.', image: 'images/tatca/gvbm_02.jpg' },
  { name: 'Lê Thị Hồng Hạnh', tag: 'Vật lí', title: 'Hiểu bản chất hiện tượng qua mô hình trực quan', description: 'Chú trọng nền tảng kiến thức và khả năng vận dụng vào bài tập, thực tiễn.', image: 'images/tatca/gvbm_03.jpg' },
  { name: 'Võ Phước Thọ', tag: 'Ngữ văn', title: 'Cảm thụ • lập luận • diễn đạt mạch lạc', description: 'Rèn kỹ năng đọc hiểu, viết nghị luận và trình bày suy nghĩ có chiều sâu.', image: 'images/tatca/gvbm_04.jpg' },
  { name: 'Trần Quốc Chấn', tag: 'Hóa học', title: 'Hệ thống hóa kiến thức và kỹ năng giải nhanh', description: 'Tập trung giúp học sinh nắm chắc lý thuyết và xử lý bài tập theo dạng.', image: 'images/tatca/gvbm_05.jpg' },
  { name: 'Nguyễn Trung Tín', tag: 'Sinh học', title: 'Kiến thức nền tảng gắn với tư duy khoa học', description: 'Tăng khả năng ghi nhớ, phân tích sơ đồ và vận dụng kiến thức vào đề thi.', image: 'images/tatca/gvbm_06.jpg' },
  { name: 'Phạm Thanh Hoàng', tag: 'Tiếng Anh', title: 'Ngôn ngữ • phản xạ • kỹ năng làm đề', description: 'Bồi dưỡng từ vựng, ngữ pháp và chiến lược đọc hiểu theo định hướng thi cử.', image: 'images/tatca/gvbm_07.jpg' },
  { name: 'Trần Thị Tâm', tag: 'Lịch sử', title: 'Mốc sự kiện • tư duy hệ thống • ghi nhớ nhanh', description: 'Giúp học sinh học lịch sử theo trục thời gian, chủ đề và tư duy liên hệ.', image: 'images/tatca/gvbm_08.jpg' },
  { name: 'Lê Văn Tuấn', tag: 'GDQP', title: 'Sơ đồ hóa kiến thức và đọc hiểu Atlat hiệu quả', description: 'Tập trung kỹ năng xử lý số liệu, biểu đồ và nhận diện vấn đề địa lí.', image: 'images/tatca/gvbm_09.jpg' },
  { name: 'Lê Thị Trang', tag: 'HĐTNHN', title: 'Sơ đồ hóa kiến thức và đọc hiểu Atlat hiệu quả', description: 'Tập trung kỹ năng xử lý số liệu, biểu đồ và nhận diện vấn đề địa lí.', image: 'images/tatca/gvbm_10.jpg' },
  { name: 'Phan Thị Minh', tag: 'Thể dục', title: 'Rèn thể lực • tinh thần • kỷ luật tích cực', description: 'Tạo nhịp cân bằng giữa học tập và vận động, duy trì năng lượng tích cực cho lớp.', image: 'images/tatca/gvbm_11.jpg' }
  
];


// Chỉnh 3 thẻ giới thiệu nhóm làm web tại đây
const CAREER_TEAM_PROFILES = [
  {
    name: 'Nguyễn Thế Phát',
    role: 'Tư duy logic • Xử lý dữ liệu',
    age: '18',
    futureUniversity: 'Đại học Bách khoa Hà Nội',
    major: 'Toán - Tin',
    strengths: 'Học sinh lớp 12A1 có nền tảng tư duy logic tốt, mạnh về xử lý dữ liệu và tối ưu hóa hiệu suất.',
    bio: 'Huy chương vàng olympic Vật Lí, giải Nhì HSG cấp trường, Điểm đánh giá tư duy 70+ (thuộc top 2%), Tân Sinh Viên K71 Khoa Toán - Tin Đại học Bách khoa Hà Nội 2027.',
    quote: 'Trên con đường thành công không có dấu chân của kẻ lười biếng.',
    chips: ['HTML/CSS', 'Responsive', 'UI Design'],
    accent: 'violet',
    image: 'images/tatca/hs_24.jpg'
  },
  {
    name: 'Huynh Khánh Việt',
    role: 'Kinh Tế • Công ty niêm yết',
    age: '17',
    futureUniversity: 'Đại học Kinh Tế TP.HCM - UEH',
    major: 'Quản trị kinh doanh',
    strengths: 'Học sinh lớp 12A1 có nền tảng kiến thức kinh tế vững chắc, đặc biệt quan tâm đến các công ty niêm yết và thị trường tài chính.',
    bio: 'Ưu tiên các trải nghiệm rõ ràng, gọn gàng.',
    quote: 'Kinh tế không chỉ là con số, mà còn là câu chuyện đằng sau mỗi giao dịch.',
    chips: ['JavaScript', 'Interaction', 'Optimization'],
    accent: 'cyan',
    image: 'images/tatca/hs_42.jpg'
  },
  {
    name: 'Phan Bảo Lâm',
    role: 'Nội dung • Kiểm thử',
    age: '17',
    futureUniversity: 'Đại học FPT',
    major: 'Thiết kế mỹ thuật số',
    strengths: 'Học sinh lớp 12A1 có khả năng sáng tạo nội dung tốt, chú trọng đến sự hài hòa giữa hình ảnh và cảm xúc khi trải nghiệm web.',
    bio: 'Quan tâm đến sự hài hòa giữa nội dung, hình ảnh và cảm xúc khi xem; luôn muốn trang web vừa đẹp vừa kể được câu chuyện riêng của nhóm.',
    quote: 'Một website tốt không chỉ đúng chức năng mà còn phải tạo được ấn tượng riêng.',
    chips: ['Content', 'Testing', 'Visual Story'],
    accent: 'rose',
    image: 'images/tatca/hs_15.jpg'
  }
];

let schoolGalleryItems = [];
let schoolGalleryIndex = 0;

function hashHue(value) {
  let hash = 0;
  const text = String(value || 'avatar');
  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(name) {
  return String(name || 'HS')
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'HS';
}

function createAvatarData(name, tone = 'student') {
  const hue = hashHue(`${tone}-${name}`);
  const hue2 = (hue + 48) % 360;
  const initials = getInitials(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="${initials}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="hsl(${hue} 78% 58%)" offset="0%" />
          <stop stop-color="hsl(${hue2} 82% 62%)" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="64" fill="url(#g)"/>
      <circle cx="160" cy="124" r="54" fill="rgba(255,255,255,0.26)"/>
      <path d="M65 275c12-48 54-76 95-76s83 28 95 76" fill="rgba(255,255,255,0.22)"/>
      <text x="160" y="182" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800" fill="#fff">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getCardImage(item, tone) {
  return item.image || createAvatarData(item.name || item.title || 'A', tone);
}

const STUDENT_IMAGE_FOLDER = 'images/tatca';

function getStudentImageByOrder(order) {
  return `${STUDENT_IMAGE_FOLDER}/hs_${String(order).padStart(2, '0')}.jpg`;
}

window.handlePhotoImageFallback = function handlePhotoImageFallback(image, fallback) {
  if (!image) return;
  const nextFallback = fallback || image.dataset.fallback || '';
  if (nextFallback && image.getAttribute('src') !== nextFallback) {
    image.onerror = null;
    image.src = nextFallback;
    return;
  }
  image.onerror = null;
};

window.openPhotoPreview = function openPhotoPreview(src, title = 'Xem ảnh', fallback = '') {
  const modal = qs('#photoPreviewModal');
  const image = qs('#photoPreviewImage');
  const heading = qs('#photoPreviewTitle');
  if (!modal || !image) return;

  const safeSrc = src || fallback;
  if (!safeSrc) return;

  image.src = safeSrc;
  image.alt = title || 'Xem ảnh';
  image.dataset.fallback = fallback || '';
  image.onerror = function handlePreviewError() {
    window.handlePhotoImageFallback(image, fallback);
  };

  if (heading) heading.textContent = title || 'Xem ảnh';

  modal.classList.add('open');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('photo-preview-open');
};

window.closePhotoPreview = function closePhotoPreview() {
  const modal = qs('#photoPreviewModal');
  const image = qs('#photoPreviewImage');
  if (!modal) return;
  modal.classList.remove('open');
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('photo-preview-open');
  if (image) {
    image.src = '';
    image.alt = 'Xem ảnh';
    image.dataset.fallback = '';
    image.onerror = null;
  }
};

document.addEventListener('keydown', (event) => {
  const modal = qs('#photoPreviewModal');
  if (!modal || !modal.classList.contains('open')) return;
  if (event.key === 'Escape') window.closePhotoPreview();
});

function bindPhotoPreviewCards(scope = document) {
  qsa('.photo-preview-trigger', scope).forEach((card) => {
    if (card.dataset.previewBound === 'true') return;
    card.dataset.previewBound = 'true';
    card.setAttribute('role', card.getAttribute('role') || 'button');
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

    const open = () => {
      const src = card.dataset.photoSrc || '';
      const fallback = card.dataset.photoFallback || '';
      const title = card.dataset.photoTitle || 'Xem ảnh';
      window.openPhotoPreview(src, title, fallback);
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      open();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a, button')) return;
      event.preventDefault();
      open();
    });
  });
}

function initStaticTeacherPreviewCards() {
  qsa('.school-teacher-card').forEach((card, index) => {
    const image = qs('.school-teacher-thumb', card);
    const name = (qs('h4', card)?.textContent || '').trim() || `Giáo viên ${index + 1}`;
    const fallback = createAvatarData(name, 'teacher-card');
    if (image) {
      image.setAttribute('onerror', `window.handlePhotoImageFallback(this, '${escapeAttr(fallback)}')`);
    }
    card.classList.add('photo-preview-trigger');
    card.dataset.photoSrc = image?.getAttribute('src') || fallback;
    card.dataset.photoFallback = fallback;
    card.dataset.photoTitle = name;
    card.setAttribute('aria-label', `Xem ảnh ${name}`);
  });

  bindPhotoPreviewCards(document);
}

function renderCommunityCards(containerSelector, items, options = {}) {
  const container = qs(containerSelector);
  if (!container) return;
  const tone = options.tone || 'community';
  const featured = options.featured ? ' featured' : '';
  container.innerHTML = items.map((item) => {
    const fallback = createAvatarData(item.name || item.title || 'A', tone);
    const src = item.image || fallback;
    return `
      <article class="community-person-card${featured} photo-preview-trigger" data-photo-src="${escapeAttr(src)}" data-photo-fallback="${escapeAttr(fallback)}" data-photo-title="${escapeAttr(item.name || 'Giới thiệu')}" aria-label="Xem ảnh ${escapeHtml(item.name || 'giới thiệu')}">
        <img class="community-person-photo" src="${src}" alt="${escapeHtml(item.name)}" onerror="window.handlePhotoImageFallback(this, '${escapeAttr(fallback)}')" />
        <div class="community-person-body">
          <span class="community-person-tag">${escapeHtml(item.tag || 'Giới thiệu')}</span>
          <h5 class="community-person-name">${escapeHtml(item.name)}</h5>
          <div class="community-person-title">${escapeHtml(item.title || '')}</div>
          <div class="community-person-text">${escapeHtml(item.description || '')}</div>
        </div>
      </article>
    `;
  }).join('');

  bindPhotoPreviewCards(container);
}


function getCareerTeamImage(item, index) {
  return item.image || createAvatarData(item.name || `TV ${index + 1}`, `career-${item.accent || index + 1}`);
}

function renderCareerTeamSection() {
  const container = qs('#careerTeamGrid');
  if (!container) return;

  container.innerHTML = CAREER_TEAM_PROFILES.map((item, index) => {
    const chips = Array.isArray(item.chips)
      ? item.chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')
      : '';
    const fallback = createAvatarData(item.name || `TV ${index + 1}`, `career-${item.accent || index + 1}`);
    const imageSrc = getCareerTeamImage(item, index);

    return `
      <article class="career-team-card theme-${escapeHtml(item.accent || 'violet')} photo-preview-trigger" data-photo-src="${escapeAttr(imageSrc)}" data-photo-fallback="${escapeAttr(fallback)}" data-photo-title="${escapeAttr(item.name)}" aria-label="Xem ảnh ${escapeHtml(item.name)}">
        <div class="career-team-photo-wrap">
          <img class="career-team-photo" src="${imageSrc}" alt="${escapeHtml(item.name)}" onerror="window.handlePhotoImageFallback(this, '${escapeAttr(fallback)}')" />
          <span class="career-team-role-pill">${escapeHtml(item.role || 'Nhóm phát triển website')}</span>
        </div>
        <div class="career-team-body">
          <div class="career-team-head">
            <span class="career-team-badge">Nhóm phát triển website</span>
            <h4>${escapeHtml(item.name)}</h4>
            <p>${escapeHtml(item.strengths || '')}</p>
          </div>
          <div class="career-team-meta-grid">
            <div class="career-team-meta-item">
              <span>Tuổi</span>
              <strong>${escapeHtml(item.age || '--')}</strong>
            </div>
            <div class="career-team-meta-item">
              <span>Đại học tương lai</span>
              <strong>${escapeHtml(item.futureUniversity || 'Đang cập nhật')}</strong>
            </div>
            <div class="career-team-meta-item career-team-meta-wide">
              <span>Ngành mong muốn</span>
              <strong>${escapeHtml(item.major || 'Đang cập nhật')}</strong>
            </div>
          </div>
          <div class="career-team-about">
            <span>Giới thiệu nhanh</span>
            <p>${escapeHtml(item.bio || '')}</p>
          </div>
          ${chips ? `<div class="career-team-chip-row">${chips}</div>` : ''}
          ${item.quote ? `<blockquote class="career-team-quote">“${escapeHtml(item.quote)}”</blockquote>` : ''}
        </div>
      </article>
    `;
  }).join('');

  bindPhotoPreviewCards(container);
}

function buildStudentCommunityCards() {
  return getStudentRows().map((row, index) => {
    const name = (qs('td:nth-child(2)', row)?.textContent || '').trim();
    const birthday = (qs('td:nth-child(3)', row)?.textContent || '').trim();
    const gender = (qs('td:nth-child(4)', row)?.textContent || '').trim();
    const role = (qs('td:nth-child(5)', row)?.textContent || '').trim();
    const status = (qs('td:nth-child(6)', row)?.textContent || '').trim();
    const fallback = createAvatarData(name, gender.includes('Nữ') ? 'female' : 'male');
    return {
      name,
      birthday,
      gender,
      role,
      status,
      image: getStudentImageByOrder(index + 1),
      fallback,
      order: String(index + 1).padStart(2, '0')
    };
  }).filter((item) => item.name);
}

function renderStudentCommunityGrid() {
  const container = qs('#studentCommunityGrid');
  if (!container) return;
  const students = buildStudentCommunityCards();
  container.innerHTML = students.map((student) => `
    <article class="student-mini-card photo-preview-trigger" data-photo-src="${escapeAttr(student.image)}" data-photo-fallback="${escapeAttr(student.fallback || '')}" data-photo-title="${escapeAttr(student.name)}" aria-label="Xem ảnh ${escapeHtml(student.name)}">
      <img class="student-mini-avatar" src="${student.image}" alt="${escapeHtml(student.name)}" onerror="window.handlePhotoImageFallback(this, '${escapeAttr(student.fallback || '')}')" />
      <div class="student-mini-body">
        <h5 class="student-mini-name">${escapeHtml(student.order)}. ${escapeHtml(student.name)}</h5>
        <span class="student-mini-meta">${escapeHtml(student.gender)} • ${escapeHtml(student.birthday)}</span>
        <span class="student-mini-role">${escapeHtml(student.role || student.status || 'Học sinh')}</span>
      </div>
    </article>
  `).join('');

  bindPhotoPreviewCards(container);
}

function initClassCommunitySection() {
  renderCommunityCards('#leadershipCards', LEADERSHIP_PROFILES, { featured: true, tone: 'leader' });
  renderCommunityCards('#homeroomCards', [HOMEROOM_PROFILE], { featured: true, tone: 'homeroom' });
  renderCommunityCards('#subjectTeacherCards', SUBJECT_TEACHER_PROFILES, { tone: 'subject' });
  renderStudentCommunityGrid();
  renderCareerTeamSection();
}

function getSchoolGalleryItems() {
  const source = qs('#schoolGallerySource');
  if (!source) return [];
  return qsa('img', source).map((img, index) => ({
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt') || `Ảnh ${index + 1}`,
    title: img.dataset.title || img.getAttribute('alt') || `Ảnh ${index + 1}`,
    caption: img.dataset.caption || img.getAttribute('alt') || `Ảnh ${index + 1}`,
    story: img.dataset.story || img.dataset.caption || img.getAttribute('alt') || `Ảnh ${index + 1}`
  }));
}

function renderSchoolGallery() {
  const modal = qs('#schoolGalleryModal');
  if (!modal || !schoolGalleryItems.length) return;
  const item = schoolGalleryItems[schoolGalleryIndex];
  const mainImage = qs('#galleryMainImage');
  const title = qs('#galleryTitle');
  const counter = qs('#galleryCounter');
  const caption = qs('#galleryCaption');
  const story = qs('#galleryStory');
  const thumbs = qs('#galleryThumbs');
  if (mainImage) {
    mainImage.src = item.src;
    mainImage.alt = item.alt || item.title;
  }
  if (title) title.textContent = item.title;
  if (caption) caption.textContent = item.caption;
  if (story) story.textContent = item.story;
  if (counter) counter.textContent = `${schoolGalleryIndex + 1}/${schoolGalleryItems.length}`;
  if (thumbs) {
    thumbs.innerHTML = schoolGalleryItems.map((thumb, index) => `
      <button class="gallery-thumb ${index === schoolGalleryIndex ? 'active' : ''}" type="button" onclick="openSchoolGallery(${index})" aria-label="${escapeHtml(thumb.title)}">
        <img src="${thumb.src}" alt="${escapeHtml(thumb.alt)}" />
      </button>
    `).join('');
  }
}

window.openSchoolGallery = function openSchoolGallery(index = 0) {
  schoolGalleryItems = getSchoolGalleryItems();
  if (!schoolGalleryItems.length) return;
  schoolGalleryIndex = Math.max(0, Math.min(index, schoolGalleryItems.length - 1));
  const modal = qs('#schoolGalleryModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderSchoolGallery();
};

window.changeSchoolGallery = function changeSchoolGallery(step) {
  if (!schoolGalleryItems.length) return;
  schoolGalleryIndex = (schoolGalleryIndex + step + schoolGalleryItems.length) % schoolGalleryItems.length;
  renderSchoolGallery();
};

window.closeSchoolGallery = function closeSchoolGallery() {
  const modal = qs('#schoolGalleryModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

function initSchoolGallery() {
  schoolGalleryItems = getSchoolGalleryItems();
  qsa('.school-gallery-grid img').forEach((img, index) => {
    if (img.dataset.bound === 'true') return;
    img.dataset.bound = 'true';
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    if (!img.getAttribute('onclick')) img.setAttribute('onclick', `openSchoolGallery(${index})`);
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.openSchoolGallery(index);
      }
    });
  });
}

document.addEventListener('keydown', (event) => {
  const modal = qs('#schoolGalleryModal');
  if (!modal || !modal.classList.contains('open')) return;
  if (event.key === 'Escape') window.closeSchoolGallery();
  if (event.key === 'ArrowRight') window.changeSchoolGallery(1);
  if (event.key === 'ArrowLeft') window.changeSchoolGallery(-1);
});

document.addEventListener('DOMContentLoaded', () => {
  initSchoolGallery();
  initClassCommunitySection();
});

/* ===== DOCUMENT VIDEO SLOT ENHANCEMENT ===== */
const DOC_VIDEO_STORAGE_KEY = 'documentLectureVideos_v1';

function getDocumentVideoStore() {
  return readJSON(DOC_VIDEO_STORAGE_KEY, {});
}

function saveDocumentVideoStore(store) {
  writeJSON(DOC_VIDEO_STORAGE_KEY, store);
}

function parseDocumentVideo(value) {
  const raw = String(value || '').trim();
  if (!raw) return { kind: 'empty', src: '' };

  try {
    const url = new URL(raw, window.location.href);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = url.pathname.replace(/^\//, '').split(/[?#]/)[0];
    } else if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v') || '';
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/embed/')[1].split(/[?#]/)[0];
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/shorts/')[1].split(/[?#]/)[0];
      }
    }

    if (videoId) {
      return {
        kind: 'iframe',
        src: `https://www.youtube.com/embed/${videoId}`
      };
    }

    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(url.href)) {
      return { kind: 'video', src: url.href };
    }

    return { kind: 'link', src: url.href };
  } catch (error) {
    return { kind: 'link', src: raw };
  }
}

function getDocumentRowTitle(row) {
  return (qs('td:first-child div div div', row)?.textContent || qs('td:first-child', row)?.textContent || 'Tài liệu').trim();
}

function getDocumentVideoKey(row, index) {
  const fromData = row.dataset.videoKey;
  if (fromData) return fromData;
  const title = normalizeText(getDocumentRowTitle(row)).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const key = title || `tai-lieu-${index + 1}`;
  row.dataset.videoKey = key;
  return key;
}

function escapeAttr(text) {
  return String(text || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderDocumentVideoSlots() {
  const store = getDocumentVideoStore();

  qsa('#tai-lieu .doc-file-row').forEach((row, index) => {
    const slot = qs('.doc-video-slot', row);
    if (!slot) return;

    const title = getDocumentRowTitle(row);
    const key = getDocumentVideoKey(row, index);
    const parsed = parseDocumentVideo(store[key]);
    slot.dataset.videoKey = key;
    slot.dataset.videoTitle = title;

    if (parsed.kind === 'iframe') {
      slot.innerHTML = `
        <div class="doc-video-preview">
          <iframe class="doc-video-embed-frame" src="${escapeAttr(parsed.src)}" title="Video bài giảng ${escapeHtml(title)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <div class="doc-video-meta">
            <span class="doc-video-slot-title">🎥 Đã gắn video</span>
            <div class="doc-video-actions">
              <button type="button" data-doc-video-action="edit">Đổi link</button>
              <button type="button" data-doc-video-action="clear">Xóa</button>
            </div>
          </div>
        </div>
      `;
    } else if (parsed.kind === 'video') {
      slot.innerHTML = `
        <div class="doc-video-preview">
          <video class="doc-video-embed" controls preload="metadata">
            <source src="${escapeAttr(parsed.src)}" />
          </video>
          <div class="doc-video-meta">
            <span class="doc-video-slot-title">🎥 Đã gắn video</span>
            <div class="doc-video-actions">
              <button type="button" data-doc-video-action="edit">Đổi link</button>
              <button type="button" data-doc-video-action="clear">Xóa</button>
            </div>
          </div>
        </div>
      `;
    } else if (parsed.kind === 'link' && parsed.src) {
      slot.innerHTML = `
        <div class="doc-video-preview">
          <div class="doc-video-meta">
            <span class="doc-video-slot-title">🎥 Liên kết video</span>
            <div class="doc-video-actions">
              <button type="button" data-doc-video-action="edit">Đổi link</button>
              <button type="button" data-doc-video-action="clear">Xóa</button>
            </div>
          </div>
          <a class="doc-video-link-fallback" href="${escapeAttr(parsed.src)}" target="_blank" rel="noopener noreferrer">Mở video bài giảng</a>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <div class="doc-video-slot-inner">
          <span class="doc-video-slot-title">🎥 Video bài giảng</span>
          <small>Chỗ gắn video cho ${escapeHtml(title)}</small>
          <button class="doc-video-attach" type="button" data-doc-video-action="edit">Gắn link video</button>
        </div>
      `;
    }

    qsa('[data-doc-video-action]', slot).forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (button.dataset.docVideoAction === 'clear') {
          const nextStore = getDocumentVideoStore();
          delete nextStore[key];
          saveDocumentVideoStore(nextStore);
          renderDocumentVideoSlots();
          return;
        }
        const nextStore = getDocumentVideoStore();
        const nextValue = window.prompt(`Dán link video bài giảng cho: ${title}`, nextStore[key] || '');
        if (nextValue === null) return;
        const trimmed = nextValue.trim();
        if (!trimmed) {
          delete nextStore[key];
        } else {
          nextStore[key] = trimmed;
        }
        saveDocumentVideoStore(nextStore);
        renderDocumentVideoSlots();
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDocumentVideoSlots();
});


/* ===== 2026-03-28: enhanced homeroom + career tools ===== */
const CAREER_CALC_STORAGE_KEY = 'careerScoreCalculator_v2';
const CAREER_SUGGESTION_STORAGE_KEY = 'careerSuggestionWizard_v1';

Object.assign(HOMEROOM_PROFILE, {
  note: 'Mục tiêu ưu tiên là theo sát học lực, tâm lý và định hướng sau THPT để mỗi học sinh có lộ trình phù hợp, không bị chênh vênh trong giai đoạn cuối cấp.',
  supportFocus: ['Đồng hành học tập', 'Ổn định nề nếp', 'Kết nối phụ huynh', 'Định hướng sau THPT'],
  highlights: [
    { label: 'Vai trò', value: 'Giáo viên chủ nhiệm lớp 12A1' },
    { label: 'Phong cách', value: 'Gần gũi • kỷ luật • lắng nghe' },
    { label: 'Trọng tâm', value: 'Học lực • tâm lý • định hướng nghề nghiệp' }
  ]
});

const CAREER_FIELD_LABELS = {
  subject: {
    'toan': 'Toán',
    'van': 'Ngữ văn',
    'anh': 'Tiếng Anh',
    'tin': 'Tin học',
    'li': 'Vật lí',
    'hoa': 'Hóa học',
    'sinh': 'Sinh học',
    'xa-hoi': 'Lịch sử / Địa lí / GDCD'
  },
  strength: {
    'logic': 'tư duy logic',
    'giao-tiep': 'giao tiếp tốt',
    'sang-tao': 'sáng tạo ý tưởng',
    'can-than': 'cẩn thận, tỉ mỉ',
    'kien-tri': 'kiên trì, bền bỉ',
    'dong-cam': 'biết lắng nghe, đồng cảm'
  },
  interest: {
    'cong-nghe': 'máy tính, công nghệ, hệ thống',
    'kinh-doanh': 'kinh doanh, tổ chức, thương mại',
    'truyen-thong': 'viết, nói, truyền thông, nội dung',
    'suc-khoe': 'nghiên cứu, chăm sóc sức khỏe',
    'ho-tro': 'dạy học, tư vấn, hỗ trợ người khác',
    'thiet-ke': 'thiết kế, hình ảnh, sáng tạo số'
  },
  environment: {
    'he-thong': 'làm việc với số liệu, quy trình, hệ thống',
    'nang-dong': 'năng động, giao tiếp nhiều',
    'sang-tao': 'sáng tạo, nhiều ý tưởng mới',
    'ti-mi': 'ổn định, cần sự chính xác, tỉ mỉ',
    'cong-dong': 'gắn với cộng đồng, hỗ trợ con người'
  }
};

const CAREER_PATH_LIBRARY = [
  {
    key: 'tech',
    icon: '💻',
    title: 'Kỹ thuật • CNTT',
    majors: ['CNTT', 'Kỹ thuật phần mềm', 'An toàn thông tin', 'Tự động hóa'],
    summary: 'Hợp với bạn thích logic, công nghệ và cách vận hành của hệ thống.',
    next: 'Nên ưu tiên xem thêm các trường mạnh về kỹ thuật, công nghệ và những nơi có bài thi tư duy hoặc tổ hợp Toán - Lý - Tin/Anh.',
    subjects: ['toan', 'li', 'tin', 'anh'],
    strengths: ['logic', 'can-than', 'kien-tri'],
    interests: ['cong-nghe'],
    environments: ['he-thong', 'ti-mi']
  },
  {
    key: 'business',
    icon: '📊',
    title: 'Kinh tế • Quản trị • Marketing',
    majors: ['Quản trị kinh doanh', 'Marketing', 'Tài chính', 'Thương mại điện tử'],
    summary: 'Phù hợp với bạn thích môi trường năng động, có tính tổ chức và giao tiếp.',
    next: 'Hãy xem thêm học phí, cơ hội thực tập, câu lạc bộ và mức độ dùng tiếng Anh của từng trường.',
    subjects: ['toan', 'anh', 'van'],
    strengths: ['giao-tiep', 'logic', 'kien-tri'],
    interests: ['kinh-doanh'],
    environments: ['nang-dong', 'he-thong']
  },
  {
    key: 'media',
    icon: '📰',
    title: 'Truyền thông • Luật • Khoa học xã hội',
    majors: ['Truyền thông đa phương tiện', 'Luật', 'Quan hệ công chúng', 'Báo chí'],
    summary: 'Hợp với bạn thích ngôn ngữ, lập luận, nội dung và tương tác với con người.',
    next: 'Bạn nên xem kỹ chương trình đào tạo, cơ hội thực hành, kỹ năng nói - viết và các học phần nghề nghiệp.',
    subjects: ['van', 'anh', 'xa-hoi'],
    strengths: ['giao-tiep', 'sang-tao', 'dong-cam'],
    interests: ['truyen-thong'],
    environments: ['nang-dong', 'sang-tao', 'cong-dong']
  },
  {
    key: 'health',
    icon: '🩺',
    title: 'Sức khỏe • Sinh học ứng dụng',
    majors: ['Điều dưỡng', 'Kỹ thuật xét nghiệm', 'Công nghệ sinh học', 'Dinh dưỡng'],
    summary: 'Phù hợp với bạn có sự kiên trì, cẩn thận và muốn theo hướng chăm sóc, nghiên cứu.',
    next: 'Hãy kiểm tra thêm ngưỡng học lực, điều kiện riêng của ngành và mức độ thực hành của từng trường.',
    subjects: ['sinh', 'hoa', 'toan'],
    strengths: ['can-than', 'kien-tri', 'dong-cam'],
    interests: ['suc-khoe'],
    environments: ['ti-mi', 'cong-dong']
  },
  {
    key: 'education',
    icon: '📚',
    title: 'Giáo dục • Tâm lý • Công tác xã hội',
    majors: ['Sư phạm', 'Tâm lý học', 'Công tác xã hội', 'Giáo dục đặc biệt'],
    summary: 'Rất hợp với bạn thích hỗ trợ người khác, kiên nhẫn và biết lắng nghe.',
    next: 'Bạn nên xem thêm yêu cầu phẩm chất, cơ hội việc làm tại địa phương và định hướng phát triển lâu dài.',
    subjects: ['van', 'anh', 'xa-hoi', 'sinh'],
    strengths: ['dong-cam', 'giao-tiep', 'kien-tri'],
    interests: ['ho-tro'],
    environments: ['cong-dong', 'nang-dong']
  },
  {
    key: 'design',
    icon: '🎨',
    title: 'Thiết kế • Mỹ thuật số • Nội dung sáng tạo',
    majors: ['Thiết kế đồ họa', 'Thiết kế UI/UX', 'Mỹ thuật số', 'Sản xuất nội dung'],
    summary: 'Hợp với bạn thích sáng tạo hình ảnh, ý tưởng mới và môi trường làm việc linh hoạt.',
    next: 'Nên tìm thêm yêu cầu portfolio, kỹ năng phần mềm, học phần dự án và cơ hội thực tập thực tế.',
    subjects: ['tin', 'van', 'anh'],
    strengths: ['sang-tao', 'giao-tiep', 'can-than'],
    interests: ['thiet-ke', 'truyen-thong'],
    environments: ['sang-tao', 'nang-dong']
  }
];

function renderFallbackCommunityCards(containerSelector, items, options = {}) {
  const container = qs(containerSelector);
  if (!container) return;
  const tone = options.tone || 'community';
  const featured = options.featured ? ' featured' : '';
  container.innerHTML = items.map((item) => {
    const fallback = createAvatarData(item.name || item.title || 'A', tone);
    const src = item.image || fallback;
    return `
      <article class="community-person-card${featured} photo-preview-trigger" data-photo-src="${escapeAttr(src)}" data-photo-fallback="${escapeAttr(fallback)}" data-photo-title="${escapeAttr(item.name || 'Giới thiệu')}" aria-label="Xem ảnh ${escapeHtml(item.name || 'giới thiệu')}">
        <img class="community-person-photo" src="${src}" alt="${escapeHtml(item.name)}" onerror="window.handlePhotoImageFallback(this, '${escapeAttr(fallback)}')" />
        <div class="community-person-body">
          <span class="community-person-tag">${escapeHtml(item.tag || 'Giới thiệu')}</span>
          <h5 class="community-person-name">${escapeHtml(item.name)}</h5>
          <div class="community-person-title">${escapeHtml(item.title || '')}</div>
          <div class="community-person-text">${escapeHtml(item.description || '')}</div>
        </div>
      </article>
    `;
  }).join('');

  bindPhotoPreviewCards(container);
}

function renderHomeroomCommunityCard() {
  const container = qs('#homeroomCards');
  if (!container) return;
  const item = HOMEROOM_PROFILE;
  const fallback = createAvatarData(item.name || 'GVCN', 'homeroom');
  const focus = Array.isArray(item.supportFocus)
    ? item.supportFocus.map((entry) => `<span class="homeroom-focus-chip">${escapeHtml(entry)}</span>`).join('')
    : '';
  const highlights = Array.isArray(item.highlights)
    ? item.highlights.map((entry) => `
        <div class="homeroom-highlight-card">
          <span>${escapeHtml(entry.label || 'Nội dung')}</span>
          <strong>${escapeHtml(entry.value || '')}</strong>
        </div>
      `).join('')
    : '';

  container.innerHTML = `
    <article class="community-person-card featured homeroom-feature-card photo-preview-trigger" data-photo-src="${escapeAttr(item.image || fallback)}" data-photo-fallback="${escapeAttr(fallback)}" data-photo-title="${escapeAttr(item.name || 'GVCN')}" aria-label="Xem ảnh ${escapeHtml(item.name || 'GVCN')}">
      <img class="community-person-photo" src="${item.image || fallback}" alt="${escapeHtml(item.name)}" onerror="window.handlePhotoImageFallback(this, '${escapeAttr(fallback)}')" />
      <div class="community-person-body">
        <div class="homeroom-hero-copy">
          <span class="community-person-tag">${escapeHtml(item.tag || 'GVCN')}</span>
          <h5 class="community-person-name">${escapeHtml(item.name || '')}</h5>
          <div class="community-person-title">${escapeHtml(item.title || '')}</div>
          <div class="community-person-text">${escapeHtml(item.description || '')}</div>
        </div>
        ${focus ? `<div class="homeroom-focus-row">${focus}</div>` : ''}
        ${highlights ? `<div class="homeroom-highlight-grid">${highlights}</div>` : ''}
        ${item.note ? `<div class="homeroom-note">${escapeHtml(item.note)}</div>` : ''}
      </div>
    </article>
  `;

  bindPhotoPreviewCards(container);
}

function getCareerCalcDefaultState() {
  return {
    type: 'thpt-standard',
    combination: '',
    weighted: '1',
    score1: '',
    score2: '',
    score3: '',
    priority: '0'
  };
}

function getCareerCalcState() {
  return { ...getCareerCalcDefaultState(), ...readJSON(CAREER_CALC_STORAGE_KEY, {}) };
}

function saveCareerCalcState() {
  const form = qs('#careerCalcForm');
  if (!form) return;
  writeJSON(CAREER_CALC_STORAGE_KEY, {
    type: qs('#careerCalcType')?.value || 'thpt-standard',
    combination: qs('#careerCombination')?.value || '',
    weighted: qs('#careerWeightedSubject')?.value || '1',
    score1: qs('#careerScore1')?.value || '',
    score2: qs('#careerScore2')?.value || '',
    score3: qs('#careerScore3')?.value || '',
    priority: qs('#careerPriority')?.value || '0'
  });
}

function syncCareerCalcTypeUI() {
  const type = qs('#careerCalcType')?.value || 'thpt-standard';
  const weightedField = qs('#careerWeightedSubjectField');
  if (weightedField) weightedField.hidden = type !== 'thpt-weighted';
}

function parseCareerNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).replace(',', '.').trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCareerNumber(value) {
  return Number(value || 0).toLocaleString('vi-VN', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function getCareerScoreInsight(total) {
  if (total >= 27) {
    return {
      tone: 'strong',
      label: 'Mức bứt phá',
      advice: 'Bạn có thể giữ một nhóm nguyện vọng mơ ước, nhưng vẫn nên có thêm phương án vừa sức và an toàn.'
    };
  }
  if (total >= 24) {
    return {
      tone: 'good',
      label: 'Mức khá mạnh',
      advice: 'Bạn nên chia rõ nguyện vọng theo 3 tầng và theo dõi thêm kỳ thi riêng phù hợp để mở rộng lựa chọn.'
    };
  }
  if (total >= 21) {
    return {
      tone: 'medium',
      label: 'Mức vừa sức',
      advice: 'Bạn nên mở rộng danh sách trường, cân nhắc thêm học phí, vị trí và cách quy đổi điểm của từng nơi.'
    };
  }
  return {
    tone: 'soft',
    label: 'Cần thêm phương án',
    advice: 'Hãy tính thêm nhiều kịch bản điểm, xem thêm kỳ thi riêng và giữ nhóm trường an toàn rõ ràng hơn.'
  };
}

function renderCareerCalcPlaceholder() {
  const box = qs('#careerCalcResult');
  if (!box) return;
  box.innerHTML = `
    <span class="career-result-kicker">Kết quả sẽ hiển thị ở đây</span>
    <h4>Nhập điểm để xem tổng điểm xét tuyển</h4>
    <p>Hệ thống sẽ tự áp dụng công thức phù hợp, hiển thị tổng điểm ước lượng và gợi ý cách chia nguyện vọng.</p>
    <div class="career-result-placeholder">
      <span>• Tự động đổi công thức theo dạng xét tuyển</span>
      <span>• Có mức tham khảo: an toàn • vừa sức • bứt phá</span>
      <span>• Lưu lại dữ liệu ngay trên trình duyệt</span>
    </div>
  `;
}

window.calculateCareerScore = function calculateCareerScore(showValidation = true) {
  const result = qs('#careerCalcResult');
  if (!result) return;

  const type = qs('#careerCalcType')?.value || 'thpt-standard';
  const weighted = Number(qs('#careerWeightedSubject')?.value || '1');
  const combination = (qs('#careerCombination')?.value || '').trim();
  const scores = [1, 2, 3].map((index) => parseCareerNumber(qs(`#careerScore${index}`)?.value || ''));
  const priority = parseCareerNumber(qs('#careerPriority')?.value || '0') ?? 0;

  const invalidScore = scores.some((score) => score === null || score < 0 || score > 10) || priority < 0;
  if (invalidScore) {
    if (!showValidation) return;
    result.innerHTML = `
      <span class="career-result-kicker">Cần kiểm tra lại dữ liệu</span>
      <h4>Điểm nhập chưa hợp lệ</h4>
      <div class="career-result-pill tone-error">Vui lòng nhập điểm từ 0 đến 10</div>
      <div class="career-error-note">Bạn cần nhập đủ 3 môn và đảm bảo mọi điểm đều nằm trong khoảng 0 đến 10. Điểm ưu tiên nên lớn hơn hoặc bằng 0.</div>
    `;
    return;
  }

  let total = 0;
  let formula = 'M1 + M2 + M3 + điểm ưu tiên';
  let typeLabel = 'Thi THPT • 3 môn';

  if (type === 'thpt-weighted') {
    const weightedIndex = Math.min(3, Math.max(1, weighted)) - 1;
    const weightedScores = [...scores];
    weightedScores[weightedIndex] = weightedScores[weightedIndex] * 2;
    total = ((weightedScores[0] + weightedScores[1] + weightedScores[2]) / 4) * 3 + priority;
    formula = `[((M1 + M2 + M3 nhân 2) / 4) × 3] + điểm ưu tiên • nhân hệ số ở môn ${weightedIndex + 1}`;
    typeLabel = 'Thi THPT • có 1 môn nhân hệ số';
  } else if (type === 'hoc-ba') {
    total = scores[0] + scores[1] + scores[2] + priority;
    formula = 'TB môn 1 + TB môn 2 + TB môn 3 + điểm ưu tiên';
    typeLabel = 'Học bạ • 3 môn';
  } else {
    total = scores[0] + scores[1] + scores[2] + priority;
  }

  total = Math.round(total * 100) / 100;
  const insight = getCareerScoreInsight(total);
  const percent = Math.max(0, Math.min(100, Math.round((total / 30) * 100)));
  const combinationText = combination || 'Chưa ghi tổ hợp cụ thể';

  result.innerHTML = `
    <span class="career-result-kicker">Kết quả ước lượng</span>
    <div class="career-score-total">${formatCareerNumber(total)}</div>
    <div class="career-score-meter"><span style="width:${percent}%"></span></div>
    <div class="career-result-pill tone-${insight.tone}">${escapeHtml(insight.label)}</div>
    <ul class="career-result-list">
      <li><strong>Dạng xét tuyển:</strong> ${escapeHtml(typeLabel)}</li>
      <li><strong>Tổ hợp đang tính:</strong> ${escapeHtml(combinationText)}</li>
      <li><strong>Công thức áp dụng:</strong> ${escapeHtml(formula)}</li>
      <li><strong>Gợi ý tiếp theo:</strong> ${escapeHtml(insight.advice)}</li>
    </ul>
    <div class="career-result-note">Kết quả này chỉ dùng để ước lượng nhanh. Khi nộp hồ sơ, bạn vẫn cần đối chiếu đề án chính thức của từng trường.</div>
  `;

  saveCareerCalcState();
};

window.resetCareerCalculator = function resetCareerCalculator() {
  const state = getCareerCalcDefaultState();
  const mapping = {
    '#careerCalcType': state.type,
    '#careerCombination': state.combination,
    '#careerWeightedSubject': state.weighted,
    '#careerScore1': state.score1,
    '#careerScore2': state.score2,
    '#careerScore3': state.score3,
    '#careerPriority': state.priority
  };
  Object.entries(mapping).forEach(([selector, value]) => {
    const input = qs(selector);
    if (input) input.value = value;
  });
  syncCareerCalcTypeUI();
  writeJSON(CAREER_CALC_STORAGE_KEY, state);
  renderCareerCalcPlaceholder();
};

function getCareerSuggestionDefaultState() {
  return {
    subject: '',
    strength: '',
    interest: '',
    environment: ''
  };
}

function getCareerSuggestionState() {
  return { ...getCareerSuggestionDefaultState(), ...readJSON(CAREER_SUGGESTION_STORAGE_KEY, {}) };
}

function saveCareerSuggestionState() {
  const form = qs('#careerFitForm');
  if (!form) return;
  writeJSON(CAREER_SUGGESTION_STORAGE_KEY, {
    subject: qs('#careerFavoriteSubject')?.value || '',
    strength: qs('#careerStrength')?.value || '',
    interest: qs('#careerInterest')?.value || '',
    environment: qs('#careerEnvironment')?.value || ''
  });
}

function renderCareerSuggestionPlaceholder() {
  const box = qs('#careerSuggestionResult');
  if (!box) return;
  box.innerHTML = `
    <span class="career-result-kicker">Gợi ý cá nhân hóa</span>
    <h4>Chưa có dữ liệu để phân tích</h4>
    <p>Điền 4 thông tin bên trái để hệ thống gợi ý 3 nhóm ngành gần bạn nhất và đưa ra bước tiếp theo.</p>
    <div class="career-result-placeholder">
      <span>• Trả về top 3 nhóm ngành phù hợp</span>
      <span>• Có giải thích vì sao gợi ý</span>
      <span>• Gợi ý tiếp bước cần làm sau khi xem kết quả</span>
    </div>
  `;
}

function getCareerSelectionLabels(selection) {
  return {
    subject: CAREER_FIELD_LABELS.subject[selection.subject] || 'môn bạn chọn',
    strength: CAREER_FIELD_LABELS.strength[selection.strength] || 'điểm mạnh bạn chọn',
    interest: CAREER_FIELD_LABELS.interest[selection.interest] || 'sở thích bạn chọn',
    environment: CAREER_FIELD_LABELS.environment[selection.environment] || 'môi trường bạn chọn'
  };
}

function scoreCareerPath(path, selection) {
  const labels = getCareerSelectionLabels(selection);
  let score = 0;
  const reasons = [];

  if (path.subjects.includes(selection.subject)) {
    score += 3;
    reasons.push(`Bạn đang tự tin ở môn ${labels.subject}`);
  }
  if (path.strengths.includes(selection.strength)) {
    score += 3;
    reasons.push(`Điểm mạnh ${labels.strength} khá hợp với nhóm này`);
  }
  if (path.interests.includes(selection.interest)) {
    score += 4;
    reasons.push(`Sở thích ${labels.interest} là tín hiệu rất phù hợp`);
  }
  if (path.environments.includes(selection.environment)) {
    score += 2;
    reasons.push(`Bạn hợp môi trường ${labels.environment}`);
  }

  if (score >= 7 && path.subjects.includes(selection.subject) && path.interests.includes(selection.interest)) {
    score += 1;
  }

  return {
    ...path,
    score,
    percent: Math.min(100, Math.round((score / 13) * 100)),
    reasons: reasons.length ? reasons : [path.summary]
  };
}

window.generateCareerSuggestions = function generateCareerSuggestions(showValidation = true) {
  const box = qs('#careerSuggestionResult');
  if (!box) return;

  const selection = {
    subject: qs('#careerFavoriteSubject')?.value || '',
    strength: qs('#careerStrength')?.value || '',
    interest: qs('#careerInterest')?.value || '',
    environment: qs('#careerEnvironment')?.value || ''
  };

  const completed = Object.values(selection).every(Boolean);
  if (!completed) {
    if (!showValidation) return;
    box.innerHTML = `
      <span class="career-result-kicker">Thiếu thông tin</span>
      <h4>Bạn cần chọn đủ 4 mục</h4>
      <div class="career-result-pill tone-error">Vui lòng hoàn thành đủ thông tin</div>
      <div class="career-error-note">Hệ thống cần cả 4 dữ liệu: môn mạnh, điểm mạnh, sở thích và môi trường mong muốn để gợi ý sát hơn.</div>
    `;
    return;
  }

  const matches = CAREER_PATH_LIBRARY
    .map((path) => scoreCareerPath(path, selection))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'vi'))
    .slice(0, 3);

  box.innerHTML = `
    <span class="career-result-kicker">Top 3 nhóm ngành gần bạn nhất</span>
    <div class="career-suggestion-grid">
      ${matches.map((item, index) => `
        <article class="career-suggestion-item">
          <div class="career-suggestion-top">
            <span class="career-suggestion-rank">#${index + 1}</span>
            <span class="career-suggestion-score">${item.percent}% phù hợp</span>
          </div>
          <h4>${escapeHtml(item.icon)} ${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.summary)}</p>
          <p>${escapeHtml(item.reasons.join(' • '))}</p>
          <div class="career-pill-group">${item.majors.map((major) => `<span>${escapeHtml(major)}</span>`).join('')}</div>
          <div class="career-suggestion-next"><strong>Bước tiếp theo:</strong> ${escapeHtml(item.next)}</div>
        </article>
      `).join('')}
    </div>
    <div class="career-result-note">Đây là gợi ý định hướng ban đầu dựa trên 4 thông tin bạn đã chọn. Trước khi chốt nguyện vọng, hãy đối chiếu thêm điểm số, chi phí, vị trí trường và đề án tuyển sinh.</div>
  `;

  saveCareerSuggestionState();
};

window.resetCareerSuggestion = function resetCareerSuggestion() {
  const defaults = getCareerSuggestionDefaultState();
  const mapping = {
    '#careerFavoriteSubject': defaults.subject,
    '#careerStrength': defaults.strength,
    '#careerInterest': defaults.interest,
    '#careerEnvironment': defaults.environment
  };
  Object.entries(mapping).forEach(([selector, value]) => {
    const input = qs(selector);
    if (input) input.value = value;
  });
  writeJSON(CAREER_SUGGESTION_STORAGE_KEY, defaults);
  renderCareerSuggestionPlaceholder();
};

function initCareerTools() {
  const calcForm = qs('#careerCalcForm');
  if (calcForm && !calcForm.dataset.enhancedBound) {
    calcForm.dataset.enhancedBound = 'true';
    qsa('input, select', calcForm).forEach((field) => {
      field.addEventListener('change', () => {
        syncCareerCalcTypeUI();
        saveCareerCalcState();
      });
      field.addEventListener('input', saveCareerCalcState);
    });
  }

  const suggestionForm = qs('#careerFitForm');
  if (suggestionForm && !suggestionForm.dataset.enhancedBound) {
    suggestionForm.dataset.enhancedBound = 'true';
    qsa('select', suggestionForm).forEach((field) => {
      field.addEventListener('change', () => {
        saveCareerSuggestionState();
        generateCareerSuggestions(false);
      });
    });
  }

  const calcState = getCareerCalcState();
  const calcMapping = {
    '#careerCalcType': calcState.type,
    '#careerCombination': calcState.combination,
    '#careerWeightedSubject': calcState.weighted,
    '#careerScore1': calcState.score1,
    '#careerScore2': calcState.score2,
    '#careerScore3': calcState.score3,
    '#careerPriority': calcState.priority
  };
  Object.entries(calcMapping).forEach(([selector, value]) => {
    const input = qs(selector);
    if (input) input.value = value;
  });
  syncCareerCalcTypeUI();
  if ([calcState.score1, calcState.score2, calcState.score3].every((value) => value !== '')) {
    calculateCareerScore(false);
  } else {
    renderCareerCalcPlaceholder();
  }

  const suggestionState = getCareerSuggestionState();
  const suggestionMapping = {
    '#careerFavoriteSubject': suggestionState.subject,
    '#careerStrength': suggestionState.strength,
    '#careerInterest': suggestionState.interest,
    '#careerEnvironment': suggestionState.environment
  };
  Object.entries(suggestionMapping).forEach(([selector, value]) => {
    const input = qs(selector);
    if (input) input.value = value;
  });
  if (Object.values(suggestionState).every(Boolean)) {
    generateCareerSuggestions(false);
  } else {
    renderCareerSuggestionPlaceholder();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderFallbackCommunityCards('#leadershipCards', LEADERSHIP_PROFILES, { featured: true, tone: 'leader' });
  renderHomeroomCommunityCard();
  renderFallbackCommunityCards('#subjectTeacherCards', SUBJECT_TEACHER_PROFILES, { tone: 'subject' });
  renderStudentCommunityGrid();
  renderCareerTeamSection();
  initCareerTools();
});


document.addEventListener('DOMContentLoaded', () => {
  initStaticTeacherPreviewCards();
  bindPhotoPreviewCards(document);
});
