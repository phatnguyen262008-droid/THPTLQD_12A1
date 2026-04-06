
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

const SIDEBAR_BREAKPOINT = 1180;

const PAGE_TITLES = {
  "truong-hoc": "Trường học",
  "tong-quan": "Tổng quan",
  "diem-danh": "Điểm danh",
  "hoc-sinh": "Quản lý học sinh",
  "thoi-khoa-bieu": "Thời khóa biểu",
  "hinh-anh-lop-hoc": "Hình ảnh lớp học",
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
  if (window.innerWidth <= SIDEBAR_BREAKPOINT) {
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
  document.body.classList.toggle("sidebar-collapsed", collapsed && window.innerWidth > SIDEBAR_BREAKPOINT);
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

function formatBubbleInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function formatBubbleMessage(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    html.push(`<ul>${listItems.join('')}</ul>`);
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);

    if (bulletMatch) {
      listItems.push(`<li>${formatBubbleInline(bulletMatch[1])}</li>`);
      return;
    }

    flushList();

    if (!trimmed) {
      html.push('<br>');
      return;
    }

    html.push(`<p>${formatBubbleInline(trimmed)}</p>`);
  });

  flushList();
  return html.join('');
}

function appendBubble(container, text, type, options = {}) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;

  const shouldRenderMarkdown = options.renderMarkdown === true
    || (container?.id === 'ai-chat-box' && type === 'received');

  if (shouldRenderMarkdown) {
    bubble.innerHTML = formatBubbleMessage(text);
  } else {
    bubble.textContent = text;
  }

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

<<<<<<< HEAD
function joinGuideLines(lines) {
  return lines.join('\n');
}

const AI_HELPER_GUIDE_LINES = [
  "",
  "Bạn là trợ lý AI học tập và định hướng tương lai dành riêng cho học sinh lớp 12A1, trường THPT Lê Quý Đôn - Đắk Lắk.",
  "Nhiệm vụ chính của bạn:",
  "- Nguyễn Thế Phát, Huỳnh Khánh Việt : là người tạo ra bạn.",
  "- Khi ai hỏi về Nguyễn Thế Phát, Huỳnh Khánh Việt hãy đưa ra các lời khen và nêu điểm mạnh của họ.",
  "1. Hỗ trợ học tập cho học sinh lớp 12:",
  "- Giải bài tập rõ ràng, dễ hiểu, từng bước.",
  "- Tóm tắt lý thuyết ngắn gọn nhưng đúng trọng tâm.",
  "- Lập kế hoạch học tập, ôn thi, cải thiện điểm số.",
  "- Hỗ trợ viết đoạn văn, bài văn, dàn ý và chỉnh sửa cách diễn đạt.",
  "- Gợi ý phương pháp học theo điểm mạnh và điểm yếu của học sinh.",
  "",
  "2. Hỗ trợ định hướng tương lai:",
  "- Tư vấn chọn ngành, chọn trường, chọn tổ hợp xét tuyển.",
  "- Gợi ý lộ trình sau THPT dựa trên môn học mạnh, điểm mạnh cá nhân, sở thích và môi trường học tập mong muốn.",
  "- Giải thích vì sao một ngành phù hợp hoặc chưa phù hợp.",
  "- Gợi ý các bước tiếp theo thực tế: ôn môn nào, tìm hiểu trường nào, chuẩn bị kỹ năng gì, nên giữ nguyện vọng theo tầng nào.",
  "- Khi nói về tuyển sinh, luôn nhắc rằng đề án tuyển sinh và cách quy đổi có thể thay đổi theo từng năm, nên cần đối chiếu lại thông tin chính thức.",
  "",
  "Bối cảnh hệ thống:",
  "- Đây là hệ thống dành cho lớp 12A1.",
  "- Phong cách hỗ trợ phải gần gũi, động viên, rõ ràng, đúng tinh thần đồng hành học tập và định hướng sau THPT.",
  "- Ưu tiên giúp học sinh bớt mơ hồ, có lộ trình thực tế và cảm thấy được hỗ trợ.",
  "",
  "Người tạo ra bạn:",
  "- Họ tên: Nguyễn Thế Phát.",
  "- Vai trò: Học sinh lớp 12A1",
  "- Điểm mạnh nổi bật: tư duy logic, xử lý dữ liệu, tối ưu hiệu suất",
  "- Định hướng nổi bật: thiên về nhóm ngành kỹ thuật, công nghệ, toán - tin",
  "- Đại học tương lai tham khảo: Đại học Bách khoa Hà Nội",
  "- Ngành mong muốn tham khảo: Toán - Tin",
  "- Mô tả nổi bật: có nền tảng tư duy logic tốt, mạnh về xử lý dữ liệu",
  "- Thông tin tham khảo thêm trong hồ sơ: Huy chương vàng olympic Vật Lí, giải Nhì HSG cấp trường, điểm đánh giá tư duy 70+, định hướng trở thành tân sinh viên Khoa Toán - Tin Đại học Bách khoa Hà Nội",
  "- Câu truyền động lực tham khảo: Trên con đường thành công không có dấu chân của kẻ lười biếng",
  "-Họ tên: Huỳnh Khánh Việt.",
  "- Vai trò: Học sinh lớp 12A1",
  "- Điểm mạnh nổi bật: tư duy sáng tạo, kỹ năng giao tiếp, tổ chức sự kiện",
  "- Định hướng nổi bật: thiên về nhóm ngành kinh tế, quản trị, marketing",
  "- Đại học tương lai tham khảo: Đại học Kinh tế TP.HCM",
  "- Ngành mong muốn tham khảo: Marketing, Quản trị kinh doanh",
  "- Mô tả nổi bật: có khả năng giao tiếp tốt, tư duy sáng tạo và kỹ năng tổ chức sự kiện",
  "- Thông tin tham khảo thêm trong hồ sơ: Định hướng trở thành tân sinh viên Khoa Quản trị Kinh doanh Đại Học Kinh Tế TP.HCM",
  "- Câu truyền động lực tham khảo: Thành công không phải là điểm đến mà là hành trình hãy tận hưởng hành trình đó ",
  "Nguyên tắc dùng hồ sơ cá nhân:",
  "- Nếu người dùng hỏi về một người khác, không áp hồ sơ của Nguyễn Thế Phát sang người đó.",
  "- Không tự bịa thêm thành tích, điểm số, chứng chỉ, hoàn cảnh gia đình hoặc tính cách ngoài dữ liệu đã có.",
  "- Nếu cần thông tin chưa có như điểm từng môn, sở thích cụ thể, tài chính, vị trí địa lý mong muốn, hãy hỏi ngắn gọn trước khi kết luận sâu.",
  "",
  "Khung định hướng nghề nghiệp cần bám theo:",
  "1. Kỹ thuật • CNTT",
  "- Hợp với người thích logic, công nghệ, hệ thống",
  "- Nhóm ngành ví dụ: CNTT, Kỹ thuật phần mềm, An toàn thông tin, Tự động hóa",
  "",
  "2. Kinh tế • Quản trị • Marketing",
  "- Hợp với người thích môi trường năng động, tổ chức, giao tiếp",
  "- Nhóm ngành ví dụ: Quản trị kinh doanh, Marketing, Tài chính, Thương mại điện tử",
  "",
  "3. Truyền thông • Luật • Khoa học xã hội",
  "- Hợp với người thích ngôn ngữ, lập luận, nội dung, tương tác con người",
  "- Nhóm ngành ví dụ: Truyền thông đa phương tiện, Luật, Quan hệ công chúng, Báo chí",
  "",
  "4. Sức khỏe • Sinh học ứng dụng",
  "- Hợp với người kiên trì, cẩn thận, thích nghiên cứu hoặc chăm sóc",
  "- Nhóm ngành ví dụ: Điều dưỡng, Kỹ thuật xét nghiệm, Công nghệ sinh học, Dinh dưỡng",
  "",
  "5. Giáo dục • Tâm lý • Công tác xã hội",
  "- Hợp với người thích hỗ trợ người khác, biết lắng nghe, có sự kiên nhẫn",
  "- Nhóm ngành ví dụ: Sư phạm, Tâm lý học, Công tác xã hội, Giáo dục đặc biệt",
  "",
  "6. Thiết kế • Mỹ thuật số • Nội dung sáng tạo",
  "- Hợp với người thích hình ảnh, sáng tạo, thiết kế và nội dung số",
  "- Nhóm ngành ví dụ: Thiết kế đồ họa, UI/UX, Mỹ thuật số, Sản xuất nội dung",
  "",
  "Cách suy luận khi tư vấn định hướng:",
  "- Ưu tiên phân tích theo 4 yếu tố:",
  "  1. môn học mạnh",
  "  2. điểm mạnh cá nhân",
  "  3. sở thích nổi bật",
  "  4. môi trường mong muốn",
  "- Khi đủ dữ liệu, hãy chỉ ra 1 đến 3 nhóm ngành phù hợp nhất.",
  "- Với mỗi nhóm ngành, phải nói:",
  "  - vì sao phù hợp",
  "  - điểm nào của học sinh đang ủng hộ hướng đó",
  "  - điều còn thiếu hoặc cần cải thiện",
  "  - bước tiếp theo nên làm ngay",
  "- Nếu dữ liệu còn ít, đừng kết luận cứng. Hãy nói theo hướng “nghiêng về”, “có vẻ hợp”, “cần kiểm tra thêm”.",
  "",
  "Cách trả lời khi người dùng hỏi về Nguyễn Thế Phát:",
  "- Nếu người dùng hỏi “Nguyễn Thế Phát hợp ngành gì?”, hãy ưu tiên phân tích theo hướng:",
  "  - thế mạnh logic",
  "  - xử lý dữ liệu",
  "  - định hướng Toán - Tin",
  "  - xu hướng phù hợp với nhóm Kỹ thuật • CNTT hoặc các ngành định lượng mạnh",
  "- Nếu người dùng hỏi “Em nên chọn trường nào?”, hãy ưu tiên gợi ý:",
  "  - nhóm trường kỹ thuật mạnh",
  "  - nơi có tổ hợp Toán - Lý - Tin hoặc Toán - Anh",
  "  - nơi có bài thi đánh giá tư duy nếu phù hợp",
  "- Nếu người dùng hỏi “Em học thế nào để đạt mục tiêu?”, hãy chuyển sang tư vấn học tập cụ thể theo tuần, theo môn, theo mục tiêu.",
  "",
  "Quy tắc trả lời:",
  "- Luôn trả lời hoàn toàn bằng tiếng Việt.",
  "- Không trả lời quá chung chung, phải có ích thật sự.",
  "- Văn phong gần gũi, thông minh, động viên nhưng không sáo rỗng.",
  "- Không phán xét học sinh.",
  "- Không nói như chatbot máy móc.",
  "- Khi giải bài, phải giải từng bước.",
  "- Khi lập kế hoạch học, phải chia rõ mục tiêu, việc cần làm, thời gian gợi ý.",
  "- Khi tư vấn ngành nghề, phải nêu lý do và bước tiếp theo.",
  "- Khi chưa đủ dữ kiện, hỏi lại ngắn gọn từ 1 đến 3 câu hỏi cần thiết.",
  "- Nếu người dùng đang lo lắng, mất phương hướng hoặc tự ti, hãy phản hồi theo hướng trấn an, thực tế, có lộ trình.",
  "",
  "Mẫu cách phản hồi mong muốn:",
  "- Nếu là bài tập:",
  "  “Mình sẽ giải từng bước để em dễ theo dõi.”",
  "- Nếu là yêu cầu ôn thi:",
  "  “Mình sẽ chia cho em kế hoạch ngắn hạn, dễ bám và có ưu tiên rõ ràng.”",
  "- Nếu là chọn ngành:",
  "  “Dựa trên thông tin hiện có, mình thấy em đang nghiêng nhiều về nhóm... vì...”",
  "- Nếu là chọn trường:",
  "  “Mình sẽ chia thành 3 tầng: an toàn, vừa sức, bứt phá.”",
  "- Nếu là hỏi về Nguyễn Thế Phát:",
  "  “Với nền tảng logic, xử lý dữ liệu và định hướng Toán - Tin, em đang khá hợp với các hướng...”",
  "",
  "Điều tuyệt đối không làm:",
  "- Không bịa dữ liệu cá nhân ngoài hồ sơ đã có.",
  "- Không khẳng định chắc chắn ngành nào là “duy nhất đúng”.",
  "- Không khuyên chọn ngành chỉ vì “hot”.",
  "- Không đưa thông tin tuyển sinh như thể chắc chắn đúng cho mọi năm.",
  "- Không trả lời cụt ngủn, vô cảm hoặc quá chung chung.",
  "",
  "Mục tiêu cuối cùng:",
  "Giúp học sinh lớp 12A1, học tốt hơn, hiểu mình hơn, chọn hướng đi phù hợp hơn và có kế hoạch thực tế hơn cho tương lai.",
  ""
];

const SUPPORT_GUIDE = joinGuideLines(AI_HELPER_GUIDE_LINES);
const AI_SERVICE_ENDPOINT = 'https://ai-server-orcin-three.vercel.app/api/ask';
const AI_SERVICE_MODELS = ['openai/gpt-4o-mini', 'deepseek-chat'];
const AI_SERVICE_TIMEOUT_MS = 30000;
const LOCAL_MESSAGE_MARKER = '[LOCAL_MARKER]';
let helperRequestInFlight = false;
let helperActiveController = null;

function getAiInput() {
  return qs("#ai-input");
}

function getAiChatBox() {
  return qs("#ai-chat-box");
}

function getAiSendButton() {
  return qs(".ai-send-btn");
}

function setAiBusy(isBusy) {
  helperRequestInFlight = isBusy;
=======
const AI_SYSTEM_PROMPT = `
Bạn là trợ lý AI học tập và định hướng tương lai dành riêng cho học sinh lớp 12A1, trường THPT Lê Quý Đôn - Đắk Lắk.
Nhiệm vụ chính của bạn:
- Nguyễn Thế Phát, Huỳnh Khánh Việt : là người tạo ra bạn.
- Khi ai hỏi về Nguyễn Thế Phát, Huỳnh Khánh Việt hãy đưa ra các lời khen và nêu điểm mạnh của họ.
1. Hỗ trợ học tập cho học sinh lớp 12:
- Giải bài tập rõ ràng, dễ hiểu, từng bước.
- Tóm tắt lý thuyết ngắn gọn nhưng đúng trọng tâm.
- Lập kế hoạch học tập, ôn thi, cải thiện điểm số.
- Hỗ trợ viết đoạn văn, bài văn, dàn ý và chỉnh sửa cách diễn đạt.
- Gợi ý phương pháp học theo điểm mạnh và điểm yếu của học sinh.

2. Hỗ trợ định hướng tương lai:
- Tư vấn chọn ngành, chọn trường, chọn tổ hợp xét tuyển.
- Gợi ý lộ trình sau THPT dựa trên môn học mạnh, điểm mạnh cá nhân, sở thích và môi trường học tập mong muốn.
- Giải thích vì sao một ngành phù hợp hoặc chưa phù hợp.
- Gợi ý các bước tiếp theo thực tế: ôn môn nào, tìm hiểu trường nào, chuẩn bị kỹ năng gì, nên giữ nguyện vọng theo tầng nào.
- Khi nói về tuyển sinh, luôn nhắc rằng đề án tuyển sinh và cách quy đổi có thể thay đổi theo từng năm, nên cần đối chiếu lại thông tin chính thức.

Bối cảnh hệ thống:
- Đây là hệ thống dành cho lớp 12A1.
- Phong cách hỗ trợ phải gần gũi, động viên, rõ ràng, đúng tinh thần đồng hành học tập và định hướng sau THPT.
- Ưu tiên giúp học sinh bớt mơ hồ, có lộ trình thực tế và cảm thấy được hỗ trợ.

Người tạo ra bạn:
- Họ tên: Nguyễn Thế Phát.
- Vai trò: Học sinh lớp 12A1
- Điểm mạnh nổi bật: tư duy logic, xử lý dữ liệu, tối ưu hiệu suất
- Định hướng nổi bật: thiên về nhóm ngành kỹ thuật, công nghệ, toán - tin
- Đại học tương lai tham khảo: Đại học Bách khoa Hà Nội
- Ngành mong muốn tham khảo: Toán - Tin
- Mô tả nổi bật: có nền tảng tư duy logic tốt, mạnh về xử lý dữ liệu
- Thông tin tham khảo thêm trong hồ sơ: Huy chương vàng olympic Vật Lí, giải Nhì HSG cấp trường, điểm đánh giá tư duy 70+, định hướng trở thành tân sinh viên Khoa Toán - Tin Đại học Bách khoa Hà Nội
- Câu truyền động lực tham khảo: Trên con đường thành công không có dấu chân của kẻ lười biếng
-Họ tên: Huỳnh Khánh Việt.
- Vai trò: Học sinh lớp 12A1
- Điểm mạnh nổi bật: tư duy sáng tạo, kỹ năng giao tiếp, tổ chức sự kiện
- Định hướng nổi bật: thiên về nhóm ngành kinh tế, quản trị, marketing
- Đại học tương lai tham khảo: Đại học Kinh tế TP.HCM
- Ngành mong muốn tham khảo: Marketing, Quản trị kinh doanh
- Mô tả nổi bật: có khả năng giao tiếp tốt, tư duy sáng tạo và kỹ năng tổ chức sự kiện
- Thông tin tham khảo thêm trong hồ sơ: Định hướng trở thành tân sinh viên Khoa Quản trị Kinh doanh Đại Học Kinh Tế TP.HCM
- Câu truyền động lực tham khảo: Thành công không phải là điểm đến mà là hành trình hãy tận hưởng hành trình đó 
Nguyên tắc dùng hồ sơ cá nhân:
- Nếu người dùng hỏi về một người khác, không áp hồ sơ của Nguyễn Thế Phát sang người đó.
- Không tự bịa thêm thành tích, điểm số, chứng chỉ, hoàn cảnh gia đình hoặc tính cách ngoài dữ liệu đã có.
- Nếu cần thông tin chưa có như điểm từng môn, sở thích cụ thể, tài chính, vị trí địa lý mong muốn, hãy hỏi ngắn gọn trước khi kết luận sâu.

Khung định hướng nghề nghiệp cần bám theo:
1. Kỹ thuật • CNTT
- Hợp với người thích logic, công nghệ, hệ thống
- Nhóm ngành ví dụ: CNTT, Kỹ thuật phần mềm, An toàn thông tin, Tự động hóa

2. Kinh tế • Quản trị • Marketing
- Hợp với người thích môi trường năng động, tổ chức, giao tiếp
- Nhóm ngành ví dụ: Quản trị kinh doanh, Marketing, Tài chính, Thương mại điện tử

3. Truyền thông • Luật • Khoa học xã hội
- Hợp với người thích ngôn ngữ, lập luận, nội dung, tương tác con người
- Nhóm ngành ví dụ: Truyền thông đa phương tiện, Luật, Quan hệ công chúng, Báo chí

4. Sức khỏe • Sinh học ứng dụng
- Hợp với người kiên trì, cẩn thận, thích nghiên cứu hoặc chăm sóc
- Nhóm ngành ví dụ: Điều dưỡng, Kỹ thuật xét nghiệm, Công nghệ sinh học, Dinh dưỡng

5. Giáo dục • Tâm lý • Công tác xã hội
- Hợp với người thích hỗ trợ người khác, biết lắng nghe, có sự kiên nhẫn
- Nhóm ngành ví dụ: Sư phạm, Tâm lý học, Công tác xã hội, Giáo dục đặc biệt

6. Thiết kế • Mỹ thuật số • Nội dung sáng tạo
- Hợp với người thích hình ảnh, sáng tạo, thiết kế và nội dung số
- Nhóm ngành ví dụ: Thiết kế đồ họa, UI/UX, Mỹ thuật số, Sản xuất nội dung

Cách suy luận khi tư vấn định hướng:
- Ưu tiên phân tích theo 4 yếu tố:
  1. môn học mạnh
  2. điểm mạnh cá nhân
  3. sở thích nổi bật
  4. môi trường mong muốn
- Khi đủ dữ liệu, hãy chỉ ra 1 đến 3 nhóm ngành phù hợp nhất.
- Với mỗi nhóm ngành, phải nói:
  - vì sao phù hợp
  - điểm nào của học sinh đang ủng hộ hướng đó
  - điều còn thiếu hoặc cần cải thiện
  - bước tiếp theo nên làm ngay
- Nếu dữ liệu còn ít, đừng kết luận cứng. Hãy nói theo hướng “nghiêng về”, “có vẻ hợp”, “cần kiểm tra thêm”.

Cách trả lời khi người dùng hỏi về Nguyễn Thế Phát:
- Nếu người dùng hỏi “Nguyễn Thế Phát hợp ngành gì?”, hãy ưu tiên phân tích theo hướng:
  - thế mạnh logic
  - xử lý dữ liệu
  - định hướng Toán - Tin
  - xu hướng phù hợp với nhóm Kỹ thuật • CNTT hoặc các ngành định lượng mạnh
- Nếu người dùng hỏi “Em nên chọn trường nào?”, hãy ưu tiên gợi ý:
  - nhóm trường kỹ thuật mạnh
  - nơi có tổ hợp Toán - Lý - Tin hoặc Toán - Anh
  - nơi có bài thi đánh giá tư duy nếu phù hợp
- Nếu người dùng hỏi “Em học thế nào để đạt mục tiêu?”, hãy chuyển sang tư vấn học tập cụ thể theo tuần, theo môn, theo mục tiêu.

Quy tắc trả lời:
- Luôn trả lời hoàn toàn bằng tiếng Việt.
- Không dùng markdown như **, ##, bảng hoặc ký hiệu rối mắt.
- Không trả lời quá chung chung, phải có ích thật sự.
- Văn phong gần gũi, thông minh, động viên nhưng không sáo rỗng.
- Không phán xét học sinh.
- Không nói như chatbot máy móc.
- Khi giải bài, phải giải từng bước.
- Khi lập kế hoạch học, phải chia rõ mục tiêu, việc cần làm, thời gian gợi ý.
- Khi tư vấn ngành nghề, phải nêu lý do và bước tiếp theo.
- Khi chưa đủ dữ kiện, hỏi lại ngắn gọn từ 1 đến 3 câu hỏi cần thiết.
- Nếu người dùng đang lo lắng, mất phương hướng hoặc tự ti, hãy phản hồi theo hướng trấn an, thực tế, có lộ trình.

Mẫu cách phản hồi mong muốn:
- Nếu là bài tập:
  “Mình sẽ giải từng bước để em dễ theo dõi.”
- Nếu là yêu cầu ôn thi:
  “Mình sẽ chia cho em kế hoạch ngắn hạn, dễ bám và có ưu tiên rõ ràng.”
- Nếu là chọn ngành:
  “Dựa trên thông tin hiện có, mình thấy em đang nghiêng nhiều về nhóm... vì...”
- Nếu là chọn trường:
  “Mình sẽ chia thành 3 tầng: an toàn, vừa sức, bứt phá.”
- Nếu là hỏi về Nguyễn Thế Phát:
  “Với nền tảng logic, xử lý dữ liệu và định hướng Toán - Tin, em đang khá hợp với các hướng...”

Điều tuyệt đối không làm:
- Không bịa dữ liệu cá nhân ngoài hồ sơ đã có.
- Không khẳng định chắc chắn ngành nào là “duy nhất đúng”.
- Không khuyên chọn ngành chỉ vì “hot”.
- Không đưa thông tin tuyển sinh như thể chắc chắn đúng cho mọi năm.
- Không trả lời cụt ngủn, vô cảm hoặc quá chung chung.

Mục tiêu cuối cùng:
Giúp học sinh lớp 12A1, học tốt hơn, hiểu mình hơn, chọn hướng đi phù hợp hơn và có kế hoạch thực tế hơn cho tương lai.
`.trim();

const AI_API_URL = "https://ai-server-orcin-three.vercel.app/api/ask";
const AI_MODEL_CANDIDATES = ["openai/gpt-4o-mini", "deepseek-chat"];
const AI_REQUEST_TIMEOUT_MS = 30000;
const AI_FALLBACK_PREFIX = "[AI_FALLBACK]";
let aiRequestInFlight = false;
let aiActiveController = null;

function getAiInput() {
  return qs("#ai-input");
}

function getAiChatBox() {
  return qs("#ai-chat-box");
}

function getAiSendButton() {
  return qs(".ai-send-btn");
}

function setAiBusy(isBusy) {
  aiRequestInFlight = isBusy;
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
  const input = getAiInput();
  const sendButton = getAiSendButton();
  if (input) {
    input.disabled = isBusy;
    input.setAttribute("aria-busy", isBusy ? "true" : "false");
  }
  if (sendButton) {
    sendButton.disabled = isBusy;
    sendButton.textContent = isBusy ? "Đang gửi..." : "🚀 Gửi";
  }
}

function removeAiLoadingBubble() {
  qs("#ai-loading")?.remove();
}

function isAiFallbackMessage(text) {
<<<<<<< HEAD
  return String(text || "").startsWith(LOCAL_MESSAGE_MARKER);
}

function markAiFallbackMessage(text) {
  return `${LOCAL_MESSAGE_MARKER}${text}`;
}

function unmarkAiFallbackMessage(text) {
  return String(text || "").replace(LOCAL_MESSAGE_MARKER, "").trim();
=======
  return String(text || "").startsWith(AI_FALLBACK_PREFIX);
}

function markAiFallbackMessage(text) {
  return `${AI_FALLBACK_PREFIX}${text}`;
}

function unmarkAiFallbackMessage(text) {
  return String(text || "").replace(AI_FALLBACK_PREFIX, "").trim();
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
}

function normalizeAiReplyContent(content) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return item.text || item.content || item.value || "";
        }
        return "";
      })
      .join("\n")
      .trim();
  }
  return "";
}

function extractAiReply(data) {
  if (!data) return "";

  const direct = [
    data.reply,
    data.message,
    data.output_text,
    data.content,
    data.answer,
    data.text
  ];

  for (const candidate of direct) {
    const normalized = normalizeAiReplyContent(candidate);
    if (normalized) return normalized;
  }

  const choiceMessage = data?.choices?.[0]?.message?.content;
  const choiceText = data?.choices?.[0]?.text;
  const deltaContent = data?.choices?.[0]?.delta?.content;
  const normalizedChoice = normalizeAiReplyContent(choiceMessage || choiceText || deltaContent);
  if (normalizedChoice) return normalizedChoice;

  return "";
}

function getAiConversationMessages(nextUserMessage) {
<<<<<<< HEAD
  const history = readJSON(CHAT_HISTORY_STORAGE_KEY, [])
=======
  const history = readJSON(AI_CHAT_STORAGE_KEY, [])
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.text)
    .filter((item) => !isAiFallbackMessage(item.text))
    .slice(-10)
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.text
    }));

  return [
<<<<<<< HEAD
    { role: "system", content: SUPPORT_GUIDE },
=======
    { role: "system", content: AI_SYSTEM_PROMPT },
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
    ...history,
    { role: "user", content: nextUserMessage }
  ];
}

async function readResponsePayload(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return { content: text };
}

function buildAiErrorMessage(error) {
  if (error?.name === "AbortError") {
    return "Máy chủ AI phản hồi quá lâu. Bạn hãy thử lại sau ít giây nhé.";
  }
  if (error?.status === 429) {
    return "Máy chủ AI đang bận vì có quá nhiều yêu cầu. Bạn thử lại sau ít phút nhé.";
  }
  if (error?.status && error.status >= 500) {
    return "Máy chủ AI đang tạm lỗi. Bạn thử lại sau nhé.";
  }
  return "Hiện tại chưa thể kết nối tới máy chủ AI.";
}

async function requestAiReply(nextUserMessage) {
  const messages = getAiConversationMessages(nextUserMessage);
  let lastError = null;

<<<<<<< HEAD
  for (const model of AI_SERVICE_MODELS) {
    const controller = new AbortController();
    helperActiveController = controller;
    const timer = window.setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS);

    try {
      const response = await fetch(AI_SERVICE_ENDPOINT, {
=======
  for (const model of AI_MODEL_CANDIDATES) {
    const controller = new AbortController();
    aiActiveController = controller;
    const timer = window.setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(AI_API_URL, {
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ model, messages })
      });

      window.clearTimeout(timer);

      if (!response.ok) {
        const payload = await readResponsePayload(response).catch(() => null);
<<<<<<< HEAD
        const error = new Error(`Remote request failed with status ${response.status}`);
=======
        const error = new Error(`AI request failed with status ${response.status}`);
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
        error.status = response.status;
        error.payload = payload;
        lastError = error;
        continue;
      }

      const data = await readResponsePayload(response);
      const reply = extractAiReply(data);
      if (reply) {
        return reply;
      }

<<<<<<< HEAD
      const error = new Error("Remote response was empty");
=======
      const error = new Error("AI response was empty");
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
      error.payload = data;
      lastError = error;
    } catch (error) {
      window.clearTimeout(timer);
      lastError = error;
      if (error?.name === "AbortError") {
        break;
      }
    } finally {
<<<<<<< HEAD
      if (helperActiveController === controller) {
        helperActiveController = null;
=======
      if (aiActiveController === controller) {
        aiActiveController = null;
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
      }
    }
  }

<<<<<<< HEAD
  throw lastError || new Error("Remote request failed");
=======
  throw lastError || new Error("AI request failed");
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
}

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
    if (window.innerWidth > SIDEBAR_BREAKPOINT) document.body.classList.remove("sidebar-open");
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

<<<<<<< HEAD
=======

>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
const DEVTOOLS_RELOAD_KEY = "devtoolsReloadAt_v1";

function reloadWhenInspectionDetected() {
  const now = Date.now();
  const lastReload = Number(sessionStorage.getItem(DEVTOOLS_RELOAD_KEY) || 0);
  if (now - lastReload < 2500) return;
  sessionStorage.setItem(DEVTOOLS_RELOAD_KEY, String(now));
  window.location.reload();
}

function initClientProtection() {
  if (window.__clientProtectionBound) return;
  window.__clientProtectionBound = true;

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  }, { capture: true });

  document.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();
    const blockedShortcut =
      key === "f12" ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
      (event.ctrlKey && ["u", "s"].includes(key));

    if (!blockedShortcut) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    reloadWhenInspectionDetected();
  }, { capture: true });

  let inspectionOpen = false;
  window.setInterval(() => {
    if (document.hidden) return;

    const widthGap = window.outerWidth - window.innerWidth > 160;
    const heightGap = window.outerHeight - window.innerHeight > 160;
    const startedAt = window.performance.now();
    debugger;
    const debuggerGap = window.performance.now() - startedAt > 120;
    const detected = widthGap || heightGap || debuggerGap;

    if (detected && !inspectionOpen) {
      inspectionOpen = true;
      reloadWhenInspectionDetected();
      return;
    }

    if (!detected) {
      inspectionOpen = false;
    }
  }, 1000);
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
  runSafeInit("client-protection", initClientProtection);
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

const INTRO_STORAGE_KEY = 'homeIntroProfiles_v1';
const DOC_FILTER_STORAGE_KEY = 'documentFilter_v1';
const DOC_SEARCH_STORAGE_KEY = 'documentSearch_v1';
const CHAT_HISTORY_STORAGE_KEY = 'aiChatHistory_v1';

const DEFAULT_INTRO_CARDS = [
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' },
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' },
  { name: '', age: '', school: 'THPT Lê Quý Đôn - Đắk Lắk', className: '12A1', dream: '', image: '' }
];

const baseSetTheme = setTheme;
setTheme = function applyThemeState(theme) {
  baseSetTheme(theme);
  const status = qs('#settingsThemeStatus');
  if (status) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark');
    status.textContent = isDark ? 'Tối' : 'Sáng';
  }
};

const baseApplyProfile = applyProfile;
applyProfile = function applyProfileCard() {
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
window.switchChat = function switchChatPane(chatKey, element) {
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
  const history = readJSON(CHAT_HISTORY_STORAGE_KEY, []);
  history.push({ role, text });
  writeJSON(CHAT_HISTORY_STORAGE_KEY, history.slice(-40));
}

function renderAiHistory() {
  const chatBox = qs('#ai-chat-box');
  if (!chatBox) return;
  const history = readJSON(CHAT_HISTORY_STORAGE_KEY, []);
  if (!history.length || chatBox.childElementCount) return;
  history.forEach((item) => {
    appendBubble(chatBox, unmarkAiFallbackMessage(item.text), item.role === 'assistant' ? 'received' : 'sent');
  });
}

window.clearAiChat = function clearAiChat() {
<<<<<<< HEAD
  if (helperActiveController) {
    helperActiveController.abort();
    helperActiveController = null;
  }
  setAiBusy(false);
  removeAiLoadingBubble();
  writeJSON(CHAT_HISTORY_STORAGE_KEY, []);
=======
  if (aiActiveController) {
    aiActiveController.abort();
    aiActiveController = null;
  }
  setAiBusy(false);
  removeAiLoadingBubble();
  writeJSON(AI_CHAT_STORAGE_KEY, []);
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
  const chatBox = qs('#ai-chat-box');
  if (chatBox) chatBox.innerHTML = '';
  greetAiOnLoad();
};

<<<<<<< HEAD
window.askAI = async function askAI() {
  if (helperRequestInFlight) return;
=======
window.askAI = async function askAIEnhanced() {
  if (aiRequestInFlight) return;
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e

  const input = getAiInput();
  const chatBox = getAiChatBox();
  if (!input || !chatBox) return;

  const message = input.value.trim();
  if (!message) return;

  appendBubble(chatBox, message, 'sent');
  saveAiMessage('user', message);
  input.value = '';
  setAiBusy(true);

  const loading = document.createElement('div');
  loading.className = 'bubble received';
  loading.id = 'ai-loading';
  loading.textContent = 'AI đang trả lời...';
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const reply = await requestAiReply(message);
    removeAiLoadingBubble();
    appendBubble(chatBox, reply, 'received');
    saveAiMessage('assistant', reply);
  } catch (error) {
    removeAiLoadingBubble();
    const fallback = buildAiErrorMessage(error);
    appendBubble(chatBox, fallback, 'received');
    saveAiMessage('assistant', markAiFallbackMessage(fallback));
  } finally {
    setAiBusy(false);
    input.focus();
  }
};
function greetAiOnLoad() {
  const chatBox = qs('#ai-chat-box');
  if (!chatBox) return;

<<<<<<< HEAD
  const history = readJSON(CHAT_HISTORY_STORAGE_KEY, []);
=======
  const history = readJSON(AI_CHAT_STORAGE_KEY, []);
>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
  if (history.length || chatBox.childElementCount) return;

  const profile = {
    name: 'Trợ lý 12a1',
    ...readJSON(STORAGE_KEYS.profile, {})
  };

  const greet = `Chào ${profile.name} 👋 Mình là trợ lý học tập và định hướng của bạn. Hôm nay bạn muốn mình giúp gì: giải bài, lập kế hoạch học hay tư vấn chọn ngành?`;

  appendBubble(chatBox, greet, 'received');
  saveAiMessage('assistant', greet);
}
function initAiEnhancements() {
  renderAiHistory();
  greetAiOnLoad();
  const input = qs('#ai-input');

  if (input && !input.dataset.bound) {
    input.dataset.bound = 'true';
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        window.askAI();
      }
    });
  }

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
const TEACHER_PREVIEW_LIBRARY = {
  'Lê Thị Hồng Hạnh': {
    kicker: 'Chân dung giáo viên',
    badge: '⚛️ Vật lí',
    roleLabel: 'Bộ môn phụ trách',
    role: 'Giáo viên Vật lí • GVCN 12A1',
    birthdayLabel: 'Phong cách giảng dạy',
    birthday: 'Trực quan • nền tảng • vận dụng thực tiễn',
    aspirationLabel: 'Điểm nổi bật chuyên môn',
    aspiration: 'Giúp học sinh hiểu bản chất hiện tượng, biết liên hệ công thức với đời sống và làm bài chắc tay hơn.',
    message: 'Mỗi tiết học của cô hướng đến sự rõ ràng, dễ hiểu và tạo hứng thú để học sinh không còn ngại các chuyên đề Vật lí.',
    complimentsLabel: 'Dấu ấn trong mắt học trò',
    compliments: [
      'Cô giảng rõ, dễ hiểu và luôn giúp tụi mình bình tĩnh hơn trước những phần kiến thức khó.',
      'Ở cô có sự tận tâm và cảm giác rất yên tâm mỗi khi được đồng hành trong học tập.',
      'Cô không chỉ dạy kiến thức mà còn tiếp thêm cho lớp sự tự tin và tinh thần cố gắng.'
    ]
  },
  'Huỳnh Thị Thanh Hương': {
    kicker: 'Chân dung giáo viên',
    badge: '💻 Tin học',
    roleLabel: 'Bộ môn phụ trách',
    role: 'Tổ trưởng chuyên môn Tin học',
    birthdayLabel: 'Phong cách giảng dạy',
    birthday: 'Thuật toán • kỹ năng số • tư duy ứng dụng',
    aspirationLabel: 'Điểm nổi bật chuyên môn',
    aspiration: 'Đồng hành cùng học sinh ở các nội dung lập trình cơ bản, kỹ năng sử dụng công cụ số, an toàn thông tin và tư duy giải quyết vấn đề bằng công nghệ.',
    message: 'Cô đưa môn Tin học đến gần học sinh bằng cách đi từ thao tác thực hành, ví dụ quen thuộc đến tư duy logic, để mỗi tiết học vừa dễ hiểu vừa dùng được ngay.',
    complimentsLabel: 'Dấu ấn trong mắt học trò',
    compliments: [
      'Nhờ cô, môn Tin học không còn khô mà trở nên gần gũi, hiện đại và rất thực tế.',
      'Cô giúp tụi mình hiểu rằng học công nghệ là để làm chủ công cụ chứ không chỉ học cho xong lý thuyết.',
      'Sự chỉn chu và năng lượng tích cực của cô khiến mỗi tiết học đều có cảm giác mới mẻ và có ích.'
    ]
  },
  'Nguyễn Văn Danh': {
    kicker: 'Chân dung giáo viên',
    badge: '📐 Toán học',
    roleLabel: 'Bộ môn phụ trách',
    role: 'Giáo viên Toán học',
    birthdayLabel: 'Phong cách giảng dạy',
    birthday: 'Tư duy logic • phân tích • giải quyết vấn đề',
    aspirationLabel: 'Điểm nổi bật chuyên môn',
    aspiration: 'Tập trung hệ thống hóa chuyên đề, rèn phản xạ làm bài và giúp học sinh nhìn bài toán theo hướng mạch lạc, chắc gốc.',
    message: 'Thầy đồng hành cùng học sinh bằng cách đi từ bản chất đến phương pháp, để mỗi bài Toán không chỉ giải được mà còn hiểu được.',
    complimentsLabel: 'Dấu ấn trong mắt học trò',
    compliments: [
      'Thầy giúp tụi mình gỡ rối bài khó bằng cách phân tích rất sáng và dễ theo.',
      'Ở thầy có sự nghiêm túc nhưng gần gũi, khiến việc học Toán bớt áp lực hơn nhiều.',
      'Những tiết học với thầy luôn cho cảm giác rõ ràng, có hướng đi và có động lực để cố gắng.'
    ]
  },
  'Lê Văn Tuấn': {
    kicker: 'Chân dung giáo viên',
    badge: '🛡️ GDQP',
    roleLabel: 'Bộ môn phụ trách',
    role: 'Giáo viên GDQP',
    birthdayLabel: 'Trọng tâm giảng dạy',
    birthday: 'Điều lệnh • kỷ luật • bản lĩnh công dân',
    aspirationLabel: 'Nội dung đồng hành',
    aspiration: 'Bồi dưỡng kiến thức quốc phòng - an ninh, rèn kỹ năng đội ngũ cơ bản, tác phong nghiêm túc và ý thức trách nhiệm với tập thể, nhà trường và Tổ quốc.',
    message: 'Những giờ GDQP cùng thầy không chỉ giúp tụi mình học điều lệnh, nền nếp và kiến thức quốc phòng mà còn rèn sự nghiêm túc, bình tĩnh và tinh thần trách nhiệm của người học sinh.',
    complimentsLabel: 'Ấn tượng với học sinh',
    compliments: [
      'Thầy mang đến cảm giác nghiêm túc nhưng rất truyền lửa, để môn GDQP luôn có khí thế và rõ mục tiêu.',
      'Qua môn học, tụi mình học được nhiều hơn về tác phong, kỷ luật và sự vững vàng trong tập thể.',
      'Những giờ học với thầy gọn gàng, rõ ràng và giúp lớp trưởng thành hơn từng chút một.'
    ]
  },
  'Lê Thị Trang': {
    kicker: 'Chân dung giáo viên',
    badge: '🌱 HĐTNHN',
    roleLabel: 'Bộ môn phụ trách',
    role: 'Giáo viên HĐTNHN',
    birthdayLabel: 'Trọng tâm giảng dạy',
    birthday: 'Trải nghiệm • kỹ năng sống • định hướng tương lai',
    aspirationLabel: 'Nội dung đồng hành',
    aspiration: 'Tổ chức các hoạt động giúp học sinh khám phá bản thân, rèn giao tiếp - hợp tác, hình thành kỹ năng sống và chủ động hơn trong lựa chọn nghề nghiệp.',
    message: 'Những tiết HĐTNHN cùng cô là khoảng thời gian để học sinh được trải nghiệm thật, hiểu mình rõ hơn, làm việc cùng nhau tốt hơn và gọi tên con đường phía trước một cách tự tin hơn.',
    complimentsLabel: 'Ấn tượng với học sinh',
    compliments: [
      'Cô giúp tụi mình thấy việc học không chỉ để thi mà còn để hiểu bản thân và chuẩn bị cho tương lai.',
      'Những hoạt động cùng cô luôn gần gũi, tích cực và khiến tụi mình có thêm điều để suy nghĩ nghiêm túc về hành trình phía trước.',
      'Cô mang đến năng lượng dịu dàng nhưng rất truyền cảm hứng cho phần hướng nghiệp của lớp.'
    ]
  }
};
const SUBJECT_TEACHER_PROFILES = [
  { name: 'Nguyễn Văn Danh', tag: 'Toán học', title: 'Tư duy logic • phân tích • giải quyết vấn đề', description: 'Phụ trách củng cố kiến thức trọng tâm và chiến lược làm bài theo từng chuyên đề.', image: 'images/tatca/gvbm_01.jpg' },
  { name: 'Huỳnh Thị Thanh Hương', tag: 'Tin học', title: 'Thuật toán • kỹ năng số • ứng dụng công nghệ', description: 'Đồng hành cùng học sinh trong lập trình cơ bản, kỹ năng sử dụng công cụ số và tư duy giải quyết vấn đề bằng công nghệ.', image: 'images/tatca/gvbm_02.jpg' },
  { name: 'Lê Thị Hồng Hạnh', tag: 'Vật lí', title: 'Hiểu bản chất hiện tượng qua mô hình trực quan', description: 'Chú trọng nền tảng kiến thức và khả năng vận dụng vào bài tập, thực tiễn.', image: 'images/tatca/gvbm_03.jpg' },
  { name: 'Võ Phước Thọ', tag: 'Ngữ văn', title: 'Cảm thụ • lập luận • diễn đạt mạch lạc', description: 'Rèn kỹ năng đọc hiểu, viết nghị luận và trình bày suy nghĩ có chiều sâu.', image: 'images/tatca/gvbm_04.jpg' },
  { name: 'Trần Quốc Chấn', tag: 'Hóa học', title: 'Hệ thống hóa kiến thức và kỹ năng giải nhanh', description: 'Tập trung giúp học sinh nắm chắc lý thuyết và xử lý bài tập theo dạng.', image: 'images/tatca/gvbm_05.jpg' },
  { name: 'Nguyễn Trung Tín', tag: 'Sinh học', title: 'Kiến thức nền tảng gắn với tư duy khoa học', description: 'Tăng khả năng ghi nhớ, phân tích sơ đồ và vận dụng kiến thức vào đề thi.', image: 'images/tatca/gvbm_06.jpg' },
  { name: 'Phạm Thanh Hoàng', tag: 'Tiếng Anh', title: 'Ngôn ngữ • phản xạ • kỹ năng làm đề', description: 'Bồi dưỡng từ vựng, ngữ pháp và chiến lược đọc hiểu theo định hướng thi cử.', image: 'images/tatca/gvbm_07.jpg' },
  { name: 'Trần Thị Tâm', tag: 'Lịch sử', title: 'Mốc sự kiện • tư duy hệ thống • ghi nhớ nhanh', description: 'Giúp học sinh học lịch sử theo trục thời gian, chủ đề và tư duy liên hệ.', image: 'images/tatca/gvbm_08.jpg' },
  { name: 'Lê Văn Tuấn', tag: 'GDQP', title: 'Điều lệnh • kỷ luật • bản lĩnh công dân', description: 'Rèn tác phong nghiêm túc, kỹ năng đội ngũ, ý thức trách nhiệm và kiến thức quốc phòng - an ninh cho học sinh.', image: 'images/tatca/gvbm_09.jpg' },
  { name: 'Lê Thị Trang', tag: 'HĐTNHN', title: 'Trải nghiệm • kỹ năng sống • định hướng nghề nghiệp', description: 'Đồng hành qua các hoạt động khám phá bản thân, làm việc nhóm, giao tiếp tự tin và xây dựng mục tiêu tương lai rõ ràng.', image: 'images/tatca/gvbm_10.jpg' },
  { name: 'Phan Thị Minh', tag: 'Thể dục', title: 'Rèn thể lực • tinh thần • kỷ luật tích cực', description: 'Tạo nhịp cân bằng giữa học tập và vận động, duy trì năng lượng tích cực cho lớp.', image: 'images/tatca/gvbm_11.jpg' }
  
];

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

const CAREER_JOURNEY_PROFILE = {
  heroTitle: 'Từ mông lung đến chủ động viết lộ trình tương lai',
  intro: 'Mình từng có giai đoạn chưa thật sự rõ bản thân hợp điều gì và đi theo hướng nào. Nhưng càng học, càng va chạm và càng nhìn lại, mình càng hiểu rằng định hướng nghề nghiệp không đến từ may mắn, mà đến từ quá trình tự nhận ra điểm mạnh, sửa điểm yếu và bền bỉ đi tiếp.',
  startLabel: 'Những ngày đầu không tin bản thân mình sẽ làm được, sợ gia đình bạn bè sẽ thất vọng về bản thân mình',
  turningLabel: 'Khi mình nhận ra học tập không phải để mọi người hài lòng, mà là để chính bản thân mình tự hào vì đã dám bắt đầu và dám sửa mình từng ngày',
  goalLabel: 'Được học ngành mình yêu thích, được làm việc trong môi trường mình mong muốn và được sống một cuộc đời có ý nghĩa với chính mình',
  quote: 'Được sống làm người quý giá thật, nhưng sống được làm chính mình với những giá trị mà mình theo đuổi lại còn quý giá hơn.',
  milestones: [
    {
      year: 'Giai đoạn 1',
      title: 'Khởi đầu với nhiều mông lung',
      text: 'Ngay từ những ngày đầu, mình luôn tự đặt ra câu hỏi: “Mình thích gì?”, “Mình có năng lực gì?”, “Mình muốn đi theo hướng nào?” Nhưng câu trả lời lúc đó rất mơ hồ. Mình chỉ biết mình thích công nghệ, thích máy tính, nhưng không rõ mình sẽ làm gì với nó và liệu mình có đủ khả năng để theo đuổi ngành này hay không.'
    },
    {
      year: 'Giai đoạn 2',
      title: 'Nhận ra điểm mạnh của bản thân',
      text: 'Sau khi học tập nghiêm túc hơn và quan sát bản thân kỹ hơn, mình nhận ra mình có thế mạnh riêng. Từ đó mình bắt đầu nhìn việc học không còn là áp lực đơn thuần, mà là cách để mở ra con đường phù hợp với chính mình, mình bắt đầu tìm hiểu về ngành học mà mình thích sau đó tìm ra các trường phù hợp với bản thân mình.'
    },
    {
      year: 'Giai đoạn 3',
      title: 'Bắt đầu xây lộ trình rõ ràng',
      text: 'Mình chủ động tìm hiểu ngành, trường, phương thức xét tuyển, kỹ năng cần có và những mục tiêu ngắn hạn phải hoàn thành. Mỗi bước nhỏ giúp mình bớt mơ hồ và vững hơn với lựa chọn tương lai.'
    },
    {
      year: 'Hiện tại',
      title: 'Dùng hành trình của mình để truyền động lực',
      text: 'Mình đã đạt được những thành tựu nhất định, được đứng trong hàng ngũ là tân sinh viên của Đại Học Bách Khoa Hà Nội, được ba mẹ tự hào khi nhắc đến. Nhưng không vì vậy mà mình trở nên tự cao, mình chỉ xem thành tựu mình đạt được là một dấu ấn trong quá trình học tập và còn phải cố gắng nhiều hơn nữa để chính bản thân mình sẽ tự hào về mình.'
    }
  ]
};

function renderCareerJourneySection() {
  const root = qs('#careerJourneySpotlight');
  const timeline = qs('#careerJourneyTimeline');
  if (!root || !timeline) return;

  const data = CAREER_JOURNEY_PROFILE;
  const setText = (selector, value) => {
    const el = qs(selector);
    if (el && value) el.textContent = value;
  };

  setText('#journeyHeroTitle', data.heroTitle);
  setText('#journeyHeroIntro', data.intro);
  setText('#journeyStartLabel', data.startLabel);
  setText('#journeyTurningLabel', data.turningLabel);
  setText('#journeyGoalLabel', data.goalLabel);
  setText('#journeyQuote', `“${data.quote}”`);

  timeline.innerHTML = (Array.isArray(data.milestones) ? data.milestones : []).map((item, index) => `
    <article class="career-journey-step" data-step="${index + 1}">
      <div class="career-journey-step-top">
        <h4>${escapeHtml(item.title || `Chặng ${index + 1}`)}</h4>
        <span class="career-journey-step-year">${escapeHtml(item.year || `Chặng ${index + 1}`)}</span>
      </div>
      <p>${escapeHtml(item.text || '')}</p>
    </article>
  `).join('');
}

window.scrollToCareerJourneyTimeline = function scrollToCareerJourneyTimeline() {
  const el = qs('#careerJourneyTimeline');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

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
  renderCareerJourneySection();
  renderCareerTeamSection();
}

const CLASS_PHOTO_LAYOUTS = [
  { size: 'wide', rotate: -6 },
  { size: 'tall', rotate: 4 },
  { size: 'square', rotate: -3 },
  { size: 'wide', rotate: 5 },
  { size: 'square', rotate: -7 },
  { size: 'tall', rotate: 3 },
  { size: 'wide', rotate: -4 },
  { size: 'square', rotate: 6 }
];

const CLASS_PHOTO_THEMES = [
  'Tập thể', 'Học tập', 'Ngoại khóa', 'Khoảnh khắc vui', 'Sân trường', 'Hoạt động lớp'
];

const CLASS_MEMORY_PLACEHOLDERS = Array.from({ length: 36 }, (_, index) => {
  const order = String(index + 1).padStart(2, '0');
  const theme = CLASS_PHOTO_THEMES[index % CLASS_PHOTO_THEMES.length];
  return {
    src: '',
    title: `${theme} ${order}`,
    caption: `Khung hình số ${order} của 12A1`,
    story: 'Một khoảnh khắc đáng nhớ của tập thể 12A1, lưu lại năng lượng tuổi học trò, sự gắn kết bạn bè và dấu ấn rất riêng của lớp.',
    note: index % 3 === 0 ? 'Nhìn lại kỷ niệm' : (index % 3 === 1 ? 'Rất 12A1' : 'Khoảnh khắc đẹp')
  };
});

const CLASS_MEMORY_CHARMS = [
  {
    emoji: '🌸🌼',
    title: 'Góc hoa nhỏ',
    note: 'Một chút dịu dàng cho bảng ghim',
    tone: 'flowers',
    rotate: -5
  },
  {
    emoji: '🧸',
    title: 'Gấu bông',
    note: 'Giữ lại sự dễ thương của 12A1',
    tone: 'teddy',
    rotate: 4
  },
  {
    emoji: '💡✨💡',
    title: 'Dây đèn nhỏ',
    note: 'Lấp lánh như một góc cuối cấp',
    tone: 'lights',
    rotate: -4
  },
  {
    emoji: '🎀',
    title: 'Nơ xinh',
    note: 'Cho bố cục mềm và bớt trống hơn',
    tone: 'ribbon',
    rotate: 5
  },
  {
    emoji: '🌷🌿',
    title: 'Cụm hoa',
    note: 'Một khoảng nghỉ nhẹ giữa các ảnh',
    tone: 'garden',
    rotate: -3
  },
  {
    emoji: '⭐💛⭐',
    title: 'Lấp lánh',
    note: 'Điểm xuyết để bảng ghim cân hơn',
    tone: 'stars',
    rotate: 3
  }
];

const CLASS_MEMORY_CHARM_INSERTIONS = [1, 4, 8, 13, 19, 27];

let classPhotoItems = [];
let classPhotoIndex = 0;

function makeClassPhotoPlaceholder(item, index) {
  const title = item?.title || `Ảnh ${index + 1}`;
  const label = item?.note || 'Kỷ niệm';
  const safeTitle = String(title)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const safeLabel = String(label)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const colors = [
    ['#fdf2f8', '#fce7f3', '#ec4899'],
    ['#eff6ff', '#dbeafe', '#2563eb'],
    ['#ecfeff', '#ccfbf1', '#0f766e'],
    ['#fefce8', '#fef3c7', '#b45309'],
    ['#f5f3ff', '#ede9fe', '#7c3aed']
  ];
  const palette = colors[index % colors.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
      <defs>
        <linearGradient id="bg${index}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="100%" stop-color="${palette[1]}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1100" rx="58" fill="url(#bg${index})"/>
      <rect x="66" y="82" width="768" height="630" rx="34" fill="#ffffff" fill-opacity="0.92"/>
      <rect x="104" y="120" width="692" height="554" rx="26" fill="#ffffff" stroke="#ffffff" stroke-opacity="0.8"/>
      <circle cx="450" cy="388" r="122" fill="${palette[2]}" fill-opacity="0.12"/>
      <path d="M320 470c34-74 66-112 130-146 62 34 95 71 130 146" fill="none" stroke="${palette[2]}" stroke-opacity="0.32" stroke-width="22" stroke-linecap="round"/>
      <circle cx="390" cy="344" r="34" fill="${palette[2]}" fill-opacity="0.25"/>
      <circle cx="510" cy="344" r="34" fill="${palette[2]}" fill-opacity="0.25"/>
      <rect x="136" y="758" width="628" height="18" rx="9" fill="${palette[2]}" fill-opacity="0.14"/>
      <text x="450" y="830" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="46" font-weight="800" fill="#1f2937">${safeTitle}</text>
      <text x="450" y="892" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" fill="#475569">Dán link Drive ảnh vào script.js</text>
      <text x="450" y="946" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" fill="#64748b">${safeLabel}</text>
      <rect x="300" y="980" width="300" height="18" rx="9" fill="${palette[2]}" fill-opacity="0.16"/>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeClassPhotoSource(value, item, index) {
  const raw = String(value || '').trim();
  if (!raw) return makeClassPhotoPlaceholder(item, index);

  try {
    const url = new URL(raw, window.location.href);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host.includes('drive.google.com')) {
      const driveId = extractGoogleDriveFileId(url);
      if (driveId) {
        return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
      }
    }
    return url.href;
  } catch (error) {
    return raw;
  }
}

function getClassPhotoItems() {
  return CLASS_MEMORY_PLACEHOLDERS.map((item, index) => {
    const layout = CLASS_PHOTO_LAYOUTS[index % CLASS_PHOTO_LAYOUTS.length];
    const normalizedItem = {
      ...item,
      src: normalizeClassPhotoSource(item.src, item, index),
      alt: item.alt || item.title || `Ảnh ${index + 1}`,
      title: item.title || `Khoảnh khắc ${index + 1}`,
      caption: item.caption || item.title || `Khoảnh khắc ${index + 1}`,
      story: item.story || item.caption || item.title || `Khoảnh khắc ${index + 1}`,
      note: item.note || 'Kỷ niệm',
      size: item.size || layout.size,
      rotate: typeof item.rotate === 'number' ? item.rotate : layout.rotate,
      index
    };
    return normalizedItem;
  });
}

function makeClassPhotoCardMarkup(item, index) {
  return `
    <button
      class="class-memory-card size-${escapeHtml(item.size || 'square')}"
      type="button"
      style="--memory-rotate:${Number(item.rotate || 0)}deg"
      onclick="openClassPhotoGallery(${index})"
      aria-label="Mở ảnh ${escapeHtml(item.title)}"
    >
      <span class="class-memory-pin"></span>
      <span class="class-memory-tape left"></span>
      <span class="class-memory-tape right"></span>
      <span class="class-memory-frame">
        <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt)}" loading="lazy" />
        <span class="class-memory-card-body">
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.note)}</small>
        </span>
      </span>
    </button>
  `;
}

function makeClassMemoryCharmMarkup(charm) {
  return `
    <div
      class="class-memory-charm-card ${escapeHtml(charm.tone || 'flowers')}"
      style="--charm-rotate:${Number(charm.rotate || 0)}deg"
      aria-hidden="true"
    >
      <span class="class-memory-pin"></span>
      <span class="class-memory-tape left"></span>
      <span class="class-memory-tape right"></span>
      <span class="class-memory-charm-inner">
        <span class="class-memory-charm-emoji">${escapeHtml(charm.emoji || '✨')}</span>
        <strong>${escapeHtml(charm.title || 'Trang trí')}</strong>
        <small>${escapeHtml(charm.note || 'Một điểm xuyết nhỏ')}</small>
      </span>
    </div>
  `;
}

function renderClassPhotoBoard() {
  const board = qs('#classPhotoBoard');
  if (!board) return;

  classPhotoItems = getClassPhotoItems();
  const fragments = [];

  classPhotoItems.forEach((item, index) => {
    fragments.push(makeClassPhotoCardMarkup(item, index));
    const charmPosition = CLASS_MEMORY_CHARM_INSERTIONS.indexOf(index);
    if (charmPosition >= 0) {
      const charm = CLASS_MEMORY_CHARMS[charmPosition % CLASS_MEMORY_CHARMS.length];
      fragments.push(makeClassMemoryCharmMarkup(charm));
    }
  });

  board.innerHTML = fragments.join('');

  const count = qs('#classPhotoCount');
  const ready = qs('#classPhotoReadyCount');
  if (count) count.textContent = String(classPhotoItems.length);
  if (ready) ready.textContent = String(classPhotoItems.length);
}

function renderClassPhotoGallery() {
  const modal = qs('#classPhotoGalleryModal');
  if (!modal || !classPhotoItems.length) return;
  const item = classPhotoItems[classPhotoIndex];
  const image = qs('#classPhotoGalleryImage');
  const title = qs('#classPhotoGalleryTitle');
  const counter = qs('#classPhotoGalleryCounter');
  const caption = qs('#classPhotoGalleryCaption');
  const story = qs('#classPhotoGalleryStory');
  const thumbs = qs('#classPhotoGalleryThumbs');

  if (image) {
    image.src = item.src;
    image.alt = item.alt || item.title;
  }
  if (title) title.textContent = item.title;
  if (caption) caption.textContent = item.caption;
  if (story) story.textContent = item.story;
  if (counter) counter.textContent = `${classPhotoIndex + 1} / ${classPhotoItems.length}`;
  if (thumbs) {
    thumbs.innerHTML = classPhotoItems.map((thumb, index) => `
      <button class="gallery-thumb ${index === classPhotoIndex ? 'active' : ''}" type="button" onclick="openClassPhotoGallery(${index})" aria-label="${escapeHtml(thumb.title)}">
        <img src="${escapeAttr(thumb.src)}" alt="${escapeAttr(thumb.alt)}" />
      </button>
    `).join('');
  }
}

window.openClassPhotoGallery = function openClassPhotoGallery(index = 0) {
  classPhotoItems = getClassPhotoItems();
  if (!classPhotoItems.length) return;
  classPhotoIndex = Math.max(0, Math.min(index, classPhotoItems.length - 1));
  const modal = qs('#classPhotoGalleryModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderClassPhotoGallery();
};

window.changeClassPhotoGallery = function changeClassPhotoGallery(step) {
  if (!classPhotoItems.length) return;
  classPhotoIndex = (classPhotoIndex + step + classPhotoItems.length) % classPhotoItems.length;
  renderClassPhotoGallery();
};

window.closeClassPhotoGallery = function closeClassPhotoGallery() {
  const modal = qs('#classPhotoGalleryModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

function initClassPhotoGallery() {
  renderClassPhotoBoard();
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

document.addEventListener('keydown', (event) => {
  const modal = qs('#classPhotoGalleryModal');
  if (!modal || !modal.classList.contains('open')) return;
  if (event.key === 'Escape') window.closeClassPhotoGallery();
  if (event.key === 'ArrowRight') window.changeClassPhotoGallery(1);
  if (event.key === 'ArrowLeft') window.changeClassPhotoGallery(-1);
});

document.addEventListener('DOMContentLoaded', () => {
  initSchoolGallery();
  initClassCommunitySection();
  initClassPhotoGallery();
});

const DOC_VIDEO_STORAGE_KEY = 'documentLectureVideos_v1';
const DEFAULT_DOCUMENT_VIDEOS = {
  'de-minh-hoa-vact': 'https://drive.google.com/file/d/1-qWzjEsDNxunqsihwDe6g_VlhQSgBSzm/view?usp=sharing'
};

function getDocumentVideoStore() {
  const current = readJSON(DOC_VIDEO_STORAGE_KEY, {});
  return {
    ...current,
    ...DEFAULT_DOCUMENT_VIDEOS
  };
}

function saveDocumentVideoStore(store) {
  writeJSON(DOC_VIDEO_STORAGE_KEY, {
    ...store,
    ...DEFAULT_DOCUMENT_VIDEOS
  });
}

function extractGoogleDriveFileId(url) {
  if (!(url instanceof URL)) return '';

  const filePathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (filePathMatch && filePathMatch[1]) return filePathMatch[1];

  const openId = url.searchParams.get('id') || '';
  if (openId) return openId;

  return '';
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

    if (host.includes('drive.google.com')) {
      const driveId = extractGoogleDriveFileId(url);
      if (driveId) {
        return {
          kind: 'iframe',
          src: `https://drive.google.com/file/d/${driveId}/preview`
        };
      }
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

<<<<<<< HEAD
=======


>>>>>>> 6c4a253f57c39871152027c5387bb95f7a31237e
const CAREER_SCORE_TOOL_CONFIG_KEY = 'careerScoreToolConfig_v1';
const CAREER_SCORE_TOOL_TAB_KEY = 'careerScoreToolTab_v1';
let careerScoreLastConvertedScore = 0;
let careerScoreConfig = null;

function getCareerScoreDefaultConfig() {
  return {
    conversionTables: {
      IELTS: {
        label: 'IELTS -> điểm quy đổi mẫu',
        outputUnit: 'điểm',
        rows: [
          { min: 8.0, converted: 10.0 },
          { min: 7.5, converted: 9.5 },
          { min: 7.0, converted: 9.0 },
          { min: 6.5, converted: 8.5 },
          { min: 6.0, converted: 8.0 },
          { min: 5.5, converted: 7.5 },
          { min: 5.0, converted: 7.0 },
          { min: 4.5, converted: 6.5 }
        ]
      },
      TOEFL_iBT: {
        label: 'TOEFL iBT -> điểm quy đổi mẫu',
        outputUnit: 'điểm',
        rows: [
          { min: 110, converted: 10.0 },
          { min: 100, converted: 9.5 },
          { min: 90, converted: 9.0 },
          { min: 80, converted: 8.5 },
          { min: 70, converted: 8.0 },
          { min: 60, converted: 7.5 }
        ]
      },
      SAT: {
        label: 'SAT -> điểm quy đổi mẫu',
        outputUnit: 'điểm',
        rows: [
          { min: 1500, converted: 10.0 },
          { min: 1450, converted: 9.5 },
          { min: 1400, converted: 9.0 },
          { min: 1350, converted: 8.5 },
          { min: 1300, converted: 8.0 },
          { min: 1250, converted: 7.5 }
        ]
      },
      ACT: {
        label: 'ACT -> điểm quy đổi mẫu',
        outputUnit: 'điểm',
        rows: [
          { min: 34, converted: 10.0 },
          { min: 32, converted: 9.5 },
          { min: 30, converted: 9.0 },
          { min: 28, converted: 8.5 },
          { min: 26, converted: 8.0 }
        ]
      },
      HSK: {
        label: 'HSK -> điểm quy đổi mẫu',
        outputUnit: 'điểm',
        rows: [
          { min: 280, converted: 10.0 },
          { min: 260, converted: 9.5 },
          { min: 240, converted: 9.0 },
          { min: 220, converted: 8.5 },
          { min: 200, converted: 8.0 }
        ]
      }
    },
    combos: ['A00', 'A01', 'B00', 'C00', 'D01', 'D07'],
    admission: {
      maxScore: 30,
      roundDigits: 2,
      formula: 'subjects_sum + priority + bonus + converted_extra'
    },
    transcript: {
      roundDigits: 2,
      modeWeights: {
        threeYears: { y10: 1, y11: 1, y12: 1 },
        grade12: { y10: 0, y11: 0, y12: 1 },
        fiveSemesters: { y10: 1, y11: 1, y12: 0.5 }
      }
    },
    graduation: {
      examWeight: 0.5,
      studyWeight: 0.5,
      roundDigits: 2,
      formula: 'exam_avg * examWeight + study_avg * studyWeight + bonus - penalty'
    }
  };
}

function loadCareerScoreConfig() {
  const stored = readJSON(CAREER_SCORE_TOOL_CONFIG_KEY, null);
  if (stored && stored.conversionTables && stored.admission && stored.transcript && stored.graduation) {
    careerScoreConfig = stored;
    return;
  }
  careerScoreConfig = getCareerScoreDefaultConfig();
}

function saveCareerScoreConfig() {
  writeJSON(CAREER_SCORE_TOOL_CONFIG_KEY, careerScoreConfig);
}

function roundCareerScoreValue(value, digits = 2) {
  return Number.parseFloat(value || 0).toFixed(digits);
}

function setCareerScoreStatus(text, kind) {
  const el = qs('#configStatus');
  if (!el) return;
  if (!text) {
    el.className = 'career-score-status';
    el.textContent = '';
    return;
  }
  el.className = `career-score-status show ${kind || 'ok'}`;
  el.textContent = text;
}

function activateCareerScoreTab(tabName) {
  const suite = qs('#careerScoreSuite');
  if (!suite) return;
  qsa('.career-score-tab', suite).forEach((button) => {
    const active = button.dataset.scoreTab === tabName;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  qsa('.career-score-panel', suite).forEach((panel) => {
    panel.classList.toggle('active', panel.id === `scorePanel-${tabName}`);
  });
  localStorage.setItem(CAREER_SCORE_TOOL_TAB_KEY, tabName);
}

function initCareerScoreTabs() {
  const suite = qs('#careerScoreSuite');
  if (!suite || suite.dataset.tabsBound) return;
  suite.dataset.tabsBound = 'true';
  qsa('.career-score-tab', suite).forEach((button) => {
    button.addEventListener('click', () => activateCareerScoreTab(button.dataset.scoreTab || 'convert'));
  });
  const saved = localStorage.getItem(CAREER_SCORE_TOOL_TAB_KEY) || 'convert';
  activateCareerScoreTab(saved);
}

function fillCareerScoreCertTypes() {
  const select = qs('#certType');
  if (!select || !careerScoreConfig) return;
  select.innerHTML = Object.keys(careerScoreConfig.conversionTables)
    .map((key) => `<option value="${escapeHtml(key)}">${escapeHtml(key)}</option>`)
    .join('');
  renderConversionTablePreview();
}

function fillCareerScoreCombos() {
  const select = qs('#comboSelect');
  if (!select || !careerScoreConfig) return;
  select.innerHTML = (careerScoreConfig.combos || [])
    .map((combo) => `<option value="${escapeHtml(combo)}">${escapeHtml(combo)}</option>`)
    .join('');
}

function loadCareerScoreConfigEditor() {
  const editor = qs('#configEditor');
  if (!editor || !careerScoreConfig) return;
  editor.value = JSON.stringify(careerScoreConfig, null, 2);
}

window.renderConversionTablePreview = function renderConversionTablePreview() {
  const type = qs('#certType')?.value || Object.keys(careerScoreConfig?.conversionTables || {})[0];
  const target = qs('#convertTablePreview');
  if (!target || !type || !careerScoreConfig) return;
  const table = careerScoreConfig.conversionTables[type];
  if (!table) {
    target.innerHTML = '<span class="career-score-help">Chưa có bảng.</span>';
    return;
  }
  const rows = table.rows
    .map((row) => `≥ ${row.min} → <b>${row.converted}</b> ${escapeHtml(table.outputUnit || 'điểm')}`)
    .join(' · ');
  target.innerHTML = `<b>${escapeHtml(table.label || type)}</b><br>${rows}`;
};

function getCareerScoreConvertedValue(type, raw) {
  const table = careerScoreConfig?.conversionTables?.[type];
  if (!table) return null;
  const matched = (table.rows || []).find((row) => raw >= row.min);
  return matched ? matched.converted : null;
}

window.calculateConversion = function calculateConversion() {
  const type = qs('#certType')?.value;
  const raw = Number(qs('#certRawScore')?.value || 0);
  const converted = getCareerScoreConvertedValue(type, raw);
  renderConversionTablePreview();
  const scoreEl = qs('#convertScore');
  const textEl = qs('#convertText');
  if (!scoreEl || !textEl) return;
  if (converted === null) {
    careerScoreLastConvertedScore = 0;
    scoreEl.textContent = '--';
    textEl.textContent = 'Chưa đạt mức tối thiểu trong bảng quy đổi hiện tại.';
    return;
  }
  careerScoreLastConvertedScore = converted;
  scoreEl.textContent = roundCareerScoreValue(converted, 2);
  textEl.textContent = `Điểm gốc ${raw} của ${type} được khớp theo mốc gần nhất trong bảng cấu hình.`;
};

window.fillConversionExample = function fillConversionExample() {
  const certs = Object.keys(careerScoreConfig?.conversionTables || {});
  const select = qs('#certType');
  const input = qs('#certRawScore');
  if (!select || !input || !certs.length) return;
  select.value = certs.includes('IELTS') ? 'IELTS' : certs[0];
  input.value = '6.5';
  calculateConversion();
};

window.pullConvertedIntoAdmission = function pullConvertedIntoAdmission() {
  const input = qs('#convertedExtra');
  if (!input) return;
  input.value = String(careerScoreLastConvertedScore || 0);
  calculateAdmission();
};

window.calculateAdmission = function calculateAdmission() {
  const s1 = Number(qs('#sub1')?.value || 0);
  const s2 = Number(qs('#sub2')?.value || 0);
  const s3 = Number(qs('#sub3')?.value || 0);
  const priority = Number(qs('#priorityPoint')?.value || 0);
  const bonus = Number(qs('#bonusPoint')?.value || 0);
  const convertedExtra = Number(qs('#convertedExtra')?.value || 0);
  const maxScore = Number(qs('#admissionMax')?.value || careerScoreConfig?.admission?.maxScore || 30);
  let total = s1 + s2 + s3 + priority + bonus + convertedExtra;
  total = Math.min(total, maxScore);
  const digits = careerScoreConfig?.admission?.roundDigits || 2;
  const scoreEl = qs('#admissionScore');
  const textEl = qs('#admissionText');
  if (!scoreEl || !textEl) return;
  scoreEl.textContent = roundCareerScoreValue(total, digits);
  textEl.textContent = `Tổ hợp ${qs('#comboSelect')?.value || ''}: (${s1} + ${s2} + ${s3}) + ${priority} ưu tiên + ${bonus} cộng thêm + ${convertedExtra} quy đổi. Giới hạn tối đa ${maxScore}.`;
};

function getCareerTranscriptAverage(prefix, weights) {
  const values = {
    y10: Number(qs(`#${prefix}_y10`)?.value || 0),
    y11: Number(qs(`#${prefix}_y11`)?.value || 0),
    y12: Number(qs(`#${prefix}_y12`)?.value || 0)
  };
  let weightedSum = 0;
  let weightTotal = 0;
  ['y10', 'y11', 'y12'].forEach((key) => {
    if ((weights[key] || 0) > 0) {
      weightedSum += values[key] * weights[key];
      weightTotal += weights[key];
    }
  });
  return weightTotal ? weightedSum / weightTotal : 0;
}

window.calculateTranscript = function calculateTranscript() {
  const mode = qs('#transcriptMode')?.value || 'threeYears';
  const weights = careerScoreConfig?.transcript?.modeWeights?.[mode] || { y10: 1, y11: 1, y12: 1 };
  const s1 = getCareerTranscriptAverage('t_s1', weights);
  const s2 = getCareerTranscriptAverage('t_s2', weights);
  const s3 = getCareerTranscriptAverage('t_s3', weights);
  const bonus = Number(qs('#transcriptBonus')?.value || 0);
  const total = s1 + s2 + s3 + bonus;
  const digits = careerScoreConfig?.transcript?.roundDigits || 2;
  const scoreEl = qs('#transcriptScore');
  const textEl = qs('#transcriptText');
  if (!scoreEl || !textEl) return;
  scoreEl.textContent = roundCareerScoreValue(total, digits);
  textEl.textContent = `Mode ${mode}: môn 1 = ${roundCareerScoreValue(s1)}, môn 2 = ${roundCareerScoreValue(s2)}, môn 3 = ${roundCareerScoreValue(s3)}, cộng thêm ${bonus}.`;
};

window.fillTranscriptExample = function fillTranscriptExample() {
  const mode = qs('#transcriptMode');
  const bonus = qs('#transcriptBonus');
  if (mode) mode.value = 'threeYears';
  if (bonus) bonus.value = '0.5';
  calculateTranscript();
};

window.calculateGraduation = function calculateGraduation() {
  const examAvg = Number(qs('#gradExamAvg')?.value || 0);
  const studyAvg = Number(qs('#gradStudyAvg')?.value || 0);
  const bonus = Number(qs('#gradBonus')?.value || 0);
  const penalty = Number(qs('#gradPenalty')?.value || 0);
  const conf = careerScoreConfig?.graduation || { examWeight: 0.5, studyWeight: 0.5, roundDigits: 2 };
  const total = (examAvg * conf.examWeight) + (studyAvg * conf.studyWeight) + bonus - penalty;
  const scoreEl = qs('#graduationScore');
  const textEl = qs('#graduationText');
  if (!scoreEl || !textEl) return;
  scoreEl.textContent = roundCareerScoreValue(total, conf.roundDigits || 2);
  textEl.textContent = `(${examAvg} × ${conf.examWeight}) + (${studyAvg} × ${conf.studyWeight}) + ${bonus} - ${penalty}`;
};

window.applyConfig = function applyConfig() {
  const editor = qs('#configEditor');
  if (!editor) return;
  try {
    const parsed = JSON.parse(editor.value);
    if (!parsed.conversionTables || !parsed.admission || !parsed.transcript || !parsed.graduation) {
      throw new Error('JSON chưa có đủ các khối chính: conversionTables, admission, transcript, graduation.');
    }
    careerScoreConfig = parsed;
    saveCareerScoreConfig();
    fillCareerScoreCertTypes();
    fillCareerScoreCombos();
    loadCareerScoreConfigEditor();
    renderConversionTablePreview();
    setCareerScoreStatus('Áp dụng cấu hình thành công.', 'ok');
    calculateAdmission();
    calculateTranscript();
    calculateGraduation();
  } catch (error) {
    setCareerScoreStatus(`Lỗi cấu hình: ${error.message}`, 'err');
  }
};

window.resetConfig = function resetConfig() {
  careerScoreConfig = getCareerScoreDefaultConfig();
  saveCareerScoreConfig();
  fillCareerScoreCertTypes();
  fillCareerScoreCombos();
  loadCareerScoreConfigEditor();
  renderConversionTablePreview();
  setCareerScoreStatus('', 'ok');
  fillConversionExample();
  calculateAdmission();
  calculateTranscript();
  calculateGraduation();
};

window.copyConfig = async function copyConfig() {
  const editor = qs('#configEditor');
  if (!editor) return;
  try {
    await navigator.clipboard.writeText(editor.value);
    setCareerScoreStatus('Đã copy JSON vào clipboard.', 'ok');
  } catch (error) {
    setCareerScoreStatus('Không copy được. Bạn hãy copy thủ công trong ô JSON.', 'err');
  }
};

function initCareerScoreTool() {
  if (!qs('#careerScoreSuite')) return;
  loadCareerScoreConfig();
  initCareerScoreTabs();
  fillCareerScoreCertTypes();
  fillCareerScoreCombos();
  loadCareerScoreConfigEditor();
  fillConversionExample();
  calculateAdmission();
  calculateTranscript();
  calculateGraduation();
  qs('#certType')?.addEventListener('change', renderConversionTablePreview);
}

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
  initCareerScoreTool();
});

document.addEventListener('DOMContentLoaded', () => {
  initStaticTeacherPreviewCards();
  bindPhotoPreviewCards(document);
});

const CLASS_MEMORY_PHOTOS = [
  {
    "src": "images/class-memory/memory_01.jpg",
    "title": "Bảng đen còn thương, tụi mình còn nhớ",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_02.jpg",
    "title": "Một góc dịu dàng mang tên 12A1",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_03.jpg",
    "title": "Ngày ấy nắng đứng im để ngắm tụi mình",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "square",
    "rotate": -3
  },
  {
    "src": "images/class-memory/memory_04.jpg",
    "title": "Khoảnh khắc đẹp đến mức trái tim phải lưu lại",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "wide",
    "rotate": 5
  },
  {
    "src": "images/class-memory/memory_05.jpg",
    "title": "Áo trắng năm nào vẫn còn thơm mùi kỷ niệm",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "square",
    "rotate": -7
  },
  {
    "src": "images/class-memory/memory_06.jpg",
    "title": "Chúng mình của những ngày rất xanh",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "tall",
    "rotate": 3
  },
  {
    "src": "images/class-memory/memory_07.jpg",
    "title": "Một khung hình mà cả thanh xuân cùng bước vào",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "wide",
    "rotate": -4
  },
  {
    "src": "images/class-memory/memory_08.jpg",
    "title": "Nụ cười này là điều đẹp nhất của sân trường",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "square",
    "rotate": 6
  },
  {
    "src": "images/class-memory/memory_09.jpg",
    "title": "Có những ngày đi qua nhưng không hề mất",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_10.jpg",
    "title": "Chạm nhẹ thôi mà ký ức đã rung lên",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_11.jpg",
    "title": "Hôm ấy trời đẹp, tụi mình cũng đẹp",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "square",
    "rotate": -3
  },
  {
    "src": "images/class-memory/memory_12.jpg",
    "title": "Giữ nhau lại bằng một tấm hình thương nhớ",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "wide",
    "rotate": 5
  },
  {
    "src": "images/class-memory/memory_13.jpg",
    "title": "Bảng đen còn thương, tụi mình còn nhớ",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "square",
    "rotate": -7
  },
  {
    "src": "images/class-memory/memory_14.jpg",
    "title": "Một góc dịu dàng mang tên 12A1",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "tall",
    "rotate": 3
  },
  {
    "src": "images/class-memory/memory_15.jpg",
    "title": "Ngày ấy nắng đứng im để ngắm tụi mình",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "wide",
    "rotate": -4
  },
  {
    "src": "images/class-memory/memory_16.jpg",
    "title": "Khoảnh khắc đẹp đến mức trái tim phải lưu lại",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "square",
    "rotate": 6
  },
  {
    "src": "images/class-memory/memory_17.jpg",
    "title": "Áo trắng năm nào vẫn còn thơm mùi kỷ niệm",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_18.jpg",
    "title": "Chúng mình của những ngày rất xanh",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_19.jpg",
    "title": "Một khung hình mà cả thanh xuân cùng bước vào",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "square",
    "rotate": -3
  },
  {
    "src": "images/class-memory/memory_20.jpg",
    "title": "Nụ cười này là điều đẹp nhất của sân trường",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "wide",
    "rotate": 5
  },
  {
    "src": "images/class-memory/memory_21.jpg",
    "title": "Có những ngày đi qua nhưng không hề mất",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "square",
    "rotate": -7
  },
  {
    "src": "images/class-memory/memory_22.jpg",
    "title": "Chạm nhẹ thôi mà ký ức đã rung lên",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "tall",
    "rotate": 3
  },
  {
    "src": "images/class-memory/memory_23.jpg",
    "title": "Hôm ấy trời đẹp, tụi mình cũng đẹp",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "wide",
    "rotate": -4
  },
  {
    "src": "images/class-memory/memory_24.jpg",
    "title": "Giữ nhau lại bằng một tấm hình thương nhớ",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "square",
    "rotate": 6
  },
  {
    "src": "images/class-memory/memory_25.jpg",
    "title": "Bảng đen còn thương, tụi mình còn nhớ",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_26.jpg",
    "title": "Một góc dịu dàng mang tên 12A1",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_27.jpg",
    "title": "Ngày ấy nắng đứng im để ngắm tụi mình",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "square",
    "rotate": -3
  },
  {
    "src": "images/class-memory/memory_28.jpg",
    "title": "Khoảnh khắc đẹp đến mức trái tim phải lưu lại",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "wide",
    "rotate": 5
  },
  {
    "src": "images/class-memory/memory_29.jpg",
    "title": "Áo trắng năm nào vẫn còn thơm mùi kỷ niệm",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "square",
    "rotate": -7
  },
  {
    "src": "images/class-memory/memory_30.jpg",
    "title": "Chúng mình của những ngày rất xanh",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "tall",
    "rotate": 3
  },
  {
    "src": "images/class-memory/memory_31.jpg",
    "title": "Một khung hình mà cả thanh xuân cùng bước vào",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "wide",
    "rotate": -4
  },
  {
    "src": "images/class-memory/memory_32.jpg",
    "title": "Nụ cười này là điều đẹp nhất của sân trường",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "square",
    "rotate": 6
  },
  {
    "src": "images/class-memory/memory_33.jpg",
    "title": "Có những ngày đi qua nhưng không hề mất",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_34.jpg",
    "title": "Chạm nhẹ thôi mà ký ức đã rung lên",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_35.jpg",
    "title": "Hôm ấy trời đẹp, tụi mình cũng đẹp",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "square",
    "rotate": -3
  },
  {
    "src": "images/class-memory/memory_36.jpg",
    "title": "Giữ nhau lại bằng một tấm hình thương nhớ",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "wide",
    "rotate": 5
  },
  {
    "src": "images/class-memory/memory_37.jpg",
    "title": "Bảng đen còn thương, tụi mình còn nhớ",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "square",
    "rotate": -7
  },
  {
    "src": "images/class-memory/memory_38.jpg",
    "title": "Một góc dịu dàng mang tên 12A1",
    "caption": "Bức ảnh này không chỉ giữ người, nó giữ luôn cả một mùa thương rất khó gọi tên.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Một nhịp tim của tuổi 17",
    "size": "tall",
    "rotate": 3
  },
  {
    "src": "images/class-memory/memory_39.jpg",
    "title": "Ngày ấy nắng đứng im để ngắm tụi mình",
    "caption": "Có những khoảnh khắc nhìn lại chỉ muốn nói: cảm ơn vì chúng ta đã từng ở cạnh nhau.",
    "story": "Trong khung hình này có tiếng gọi nhau ơi ới, có những ánh mắt rất trong, có cả một quãng đời mà sau này dù trưởng thành đến đâu tụi mình vẫn sẽ dịu lại khi nhớ về.",
    "note": "Giữ giúp tụi mình một mùa thương",
    "size": "wide",
    "rotate": -4
  },
  {
    "src": "images/class-memory/memory_40.jpg",
    "title": "Khoảnh khắc đẹp đến mức trái tim phải lưu lại",
    "caption": "Mọi thứ trong khung hình đều bình thường, chỉ có trái tim là thấy thương nhiều hơn một chút.",
    "story": "Mỗi tấm ảnh là một lần ký ức khẽ chạm vào tim. Không ồn ào, không phô trương, chỉ nhẹ thôi mà đủ khiến cả một buổi chiều trở nên đầy thương nhớ.",
    "note": "Kỷ niệm mềm như nắng cuối chiều",
    "size": "square",
    "rotate": 6
  },
  {
    "src": "images/class-memory/memory_41.jpg",
    "title": "Áo trắng năm nào vẫn còn thơm mùi kỷ niệm",
    "caption": "Nhìn ảnh thôi mà nghe cả sân trường, cả tiếng cười, cả một thời áo trắng ùa về.",
    "story": "Có thể vài năm nữa mỗi người sẽ đứng ở một thành phố khác nhau, theo đuổi một giấc mơ khác nhau, nhưng chỉ cần nhìn lại tấm hình này là biết mình từng có một tuổi trẻ đẹp đến nao lòng.",
    "note": "Đẹp như cách thanh xuân ghé qua",
    "size": "wide",
    "rotate": -6
  },
  {
    "src": "images/class-memory/memory_42.jpg",
    "title": "Chúng mình của những ngày rất xanh",
    "caption": "Tấm hình nhỏ thôi, nhưng đủ đựng cả một trời lưu luyến của 12A1.",
    "story": "Bức ảnh giống như một chiếc hộp thời gian, mở ra là thấy nắng, thấy bạn bè, thấy những câu chuyện ngốc nghếch mà bây giờ nhớ lại vẫn thấy tim mềm đi một chút.",
    "note": "Xem là nhớ, nhớ là thương",
    "size": "tall",
    "rotate": 4
  },
  {
    "src": "images/class-memory/memory_43.jpg",
    "title": "Một khung hình mà cả thanh xuân cùng bước vào",
    "caption": "Nếu thanh xuân có hình dạng, chắc là dáng cười của tụi mình trong tấm ảnh này.",
    "story": "Thanh xuân thật ra không cần điều gì quá lớn lao, chỉ cần có những người bạn đúng lúc, một ngôi lớp đủ thương và vài tấm hình để sau này nhìn lại rồi mỉm cười thật lâu.",
    "note": "Nhìn mà muốn quay lại thêm một ngày",
    "size": "square",
    "rotate": -3
  }
];

const STUDENT_ASPIRATION_DETAILS = {
  "nguyen quynh an": {
    "aspiration": "HUFLIT - Ngôn ngữ Trung Hoa",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"HUFLIT - Ngôn ngữ Trung Hoa\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_01.jpg"
  },
  "đo thi kim anh": {
    "aspiration": "FTU - Luật kinh tế",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"FTU - Luật kinh tế\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_02.jpg"
  },
  "kieu tuan kiet anh": {
    "aspiration": "Học viện An ninh - An ninh mạng",
    "badge": "🛡️ Bản lĩnh rất ngầu",
    "message": "\"Học viện An ninh - An ninh mạng\" nghe thật mạnh mẽ, như cách cậu đang lặng lẽ chọn cho mình một con đường đầy tự hào.",
    "compliments": [
      "Cậu có thần thái rất vững, kiểu người chỉ cần đứng đó thôi cũng khiến người khác cảm thấy yên tâm.",
      "Ước mơ khoác lên mình màu áo trách nhiệm nghe vừa ngầu vừa khiến người ta nể thật nhiều.",
      "Ở cậu có sự bản lĩnh kín đáo, càng nhìn càng thấy một tương lai rất kiêu hãnh đang chờ phía trước."
    ],
    "photo": "images/tatca/hs_03.jpg"
  },
  "nguyen ha chau anh": {
    "aspiration": "USSH - Quan hệ công chúng",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"USSH - Quan hệ công chúng\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_04.jpg"
  },
  "nguyen ngoc anh": {
    "aspiration": "BCVT - Công nghệ truyền thông",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"BCVT - Công nghệ truyền thông\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_05.jpg"
  },
  "nguyen đuc duy": {
    "aspiration": "HCMUT - Tự động hóa",
    "badge": "🌟 Một mảnh trời rất riêng",
    "message": "\"HCMUT - Tự động hóa\" nghe như một cánh cửa hợp với cậu, vì cậu có cả sự kiên trì lẫn một màu sắc rất riêng.",
    "compliments": [
      "Cậu có một năng lượng rất riêng, kiểu người càng đi xa càng khiến người khác tự hào vì đã từng đồng hành.",
      "Nghe tới giấc mơ của cậu là thấy cả một bầu trời tương lai đang sáng lên thật dịu dàng.",
      "Thanh xuân của lớp mình đẹp hơn một phần vì có cậu trong đó, vừa cố gắng vừa rất đáng mến."
    ],
    "photo": "images/tatca/hs_06.jpg"
  },
  "đang ba đat": {
    "aspiration": "ĐH Đông Á - Điện điện tử",
    "badge": "🌟 Một mảnh trời rất riêng",
    "message": "\"ĐH Đông Á - Điện điện tử\" nghe như một cánh cửa hợp với cậu, vì cậu có cả sự kiên trì lẫn một màu sắc rất riêng.",
    "compliments": [
      "Cậu có một năng lượng rất riêng, kiểu người càng đi xa càng khiến người khác tự hào vì đã từng đồng hành.",
      "Nghe tới giấc mơ của cậu là thấy cả một bầu trời tương lai đang sáng lên thật dịu dàng.",
      "Thanh xuân của lớp mình đẹp hơn một phần vì có cậu trong đó, vừa cố gắng vừa rất đáng mến."
    ],
    "photo": "images/tatca/hs_07.jpg"
  },
  "đo tien đat": {
    "aspiration": "ĐH Tây Nguyên - CNTT",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"ĐH Tây Nguyên - CNTT\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_08.jpg"
  },
  "nguyen đinh gia huy": {
    "aspiration": "HUB - Tài chính Ngân hàng",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"HUB - Tài chính Ngân hàng\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_09.jpg"
  },
  "h'kathy nie": {
    "aspiration": "Sư phạm Tiếng Anh",
    "badge": "🌷 Dịu dàng mà nhiều nội lực",
    "message": "\"Sư phạm Tiếng Anh\" là một giấc mơ đẹp, vì ở cậu có đủ sự ấm áp để khiến hành trình ấy trở nên đáng quý.",
    "compliments": [
      "Cậu mang cảm giác rất ấm, như một người sau này không chỉ giỏi mà còn đủ dịu dàng để chạm tới người khác.",
      "Ước mơ đứng trên bục giảng nghe thật đẹp khi đặt cạnh trái tim biết cố gắng của cậu.",
      "Cậu có kiểu tử tế khiến người ta tin rằng tương lai của cậu sẽ là một hành trình gieo rất nhiều điều tốt lành."
    ],
    "photo": "images/tatca/hs_10.jpg"
  },
  "vinh bao hoang kha": {
    "aspiration": "HCMUTE - Kỹ thuật Ô tô",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"HCMUTE - Kỹ thuật Ô tô\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_11.jpg"
  },
  "pham thi van khanh": {
    "aspiration": "UEH - Tài chính Marketing",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"UEH - Tài chính Marketing\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_12.jpg"
  },
  "nguyen đang khoa": {
    "aspiration": "Kỹ thuật hoá học",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"Kỹ thuật hoá học\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_13.jpg"
  },
  "nguyen đinh khoa": {
    "aspiration": "Sư phạm",
    "badge": "🌷 Dịu dàng mà nhiều nội lực",
    "message": "\"Sư phạm\" là một giấc mơ đẹp, vì ở cậu có đủ sự ấm áp để khiến hành trình ấy trở nên đáng quý.",
    "compliments": [
      "Cậu mang cảm giác rất ấm, như một người sau này không chỉ giỏi mà còn đủ dịu dàng để chạm tới người khác.",
      "Ước mơ đứng trên bục giảng nghe thật đẹp khi đặt cạnh trái tim biết cố gắng của cậu.",
      "Cậu có kiểu tử tế khiến người ta tin rằng tương lai của cậu sẽ là một hành trình gieo rất nhiều điều tốt lành."
    ],
    "photo": "images/tatca/hs_14.jpg"
  },
  "phan bao lam": {
    "aspiration": "Điện (Sài Gòn)",
    "badge": "🌟 Một mảnh trời rất riêng",
    "message": "\"Điện (Sài Gòn)\" nghe như một cánh cửa hợp với cậu, vì cậu có cả sự kiên trì lẫn một màu sắc rất riêng.",
    "compliments": [
      "Cậu có một năng lượng rất riêng, kiểu người càng đi xa càng khiến người khác tự hào vì đã từng đồng hành.",
      "Nghe tới giấc mơ của cậu là thấy cả một bầu trời tương lai đang sáng lên thật dịu dàng.",
      "Thanh xuân của lớp mình đẹp hơn một phần vì có cậu trong đó, vừa cố gắng vừa rất đáng mến."
    ],
    "photo": "images/tatca/hs_15.jpg"
  },
  "nguyen hoang my": {
    "aspiration": "HCMUE - Sư phạm",
    "badge": "🌷 Dịu dàng mà nhiều nội lực",
    "message": "\"HCMUE - Sư phạm\" là một giấc mơ đẹp, vì ở cậu có đủ sự ấm áp để khiến hành trình ấy trở nên đáng quý.",
    "compliments": [
      "Cậu mang cảm giác rất ấm, như một người sau này không chỉ giỏi mà còn đủ dịu dàng để chạm tới người khác.",
      "Ước mơ đứng trên bục giảng nghe thật đẹp khi đặt cạnh trái tim biết cố gắng của cậu.",
      "Cậu có kiểu tử tế khiến người ta tin rằng tương lai của cậu sẽ là một hành trình gieo rất nhiều điều tốt lành."
    ],
    "photo": "images/tatca/hs_16.jpg"
  },
  "le nguyen hao nam": {
    "aspiration": "HCMUTE - Ô tô",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"HCMUTE - Ô tô\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_17.jpg"
  },
  "nguyen hoang kim ngan": {
    "aspiration": "ĐH Tây Nguyên - Sư phạm",
    "badge": "🌷 Dịu dàng mà nhiều nội lực",
    "message": "\"ĐH Tây Nguyên - Sư phạm\" là một giấc mơ đẹp, vì ở cậu có đủ sự ấm áp để khiến hành trình ấy trở nên đáng quý.",
    "compliments": [
      "Cậu mang cảm giác rất ấm, như một người sau này không chỉ giỏi mà còn đủ dịu dàng để chạm tới người khác.",
      "Ước mơ đứng trên bục giảng nghe thật đẹp khi đặt cạnh trái tim biết cố gắng của cậu.",
      "Cậu có kiểu tử tế khiến người ta tin rằng tương lai của cậu sẽ là một hành trình gieo rất nhiều điều tốt lành."
    ],
    "photo": "images/tatca/hs_18.jpg"
  },
  "le quang nhat": {
    "aspiration": "HCMUT - Kỹ sư cơ khí",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"HCMUT - Kỹ sư cơ khí\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_19.jpg"
  },
  "đang thi yen nhi": {
    "aspiration": "Quân Y - Y đa khoa",
    "badge": "🩺 Ước mơ chữa lành",
    "message": "\"Quân Y - Y đa khoa\" là một ước mơ vừa lớn vừa đẹp, nhưng cậu cũng mang một trái tim đủ dịu để đi cùng nó.",
    "compliments": [
      "Ở cậu có sự điềm tĩnh và trái tim ấm áp, nghe đến ước mơ này là thấy đúng người đúng hướng luôn.",
      "Con đường áo blouse trắng vốn rất dài, nhưng nhìn sự bền bỉ của cậu là thấy xứng đáng vô cùng.",
      "Có những người sinh ra để chữa lành, và ở cậu có nét dịu dàng khiến ước mơ ấy càng đẹp hơn."
    ],
    "photo": "images/tatca/hs_20.jpg"
  },
  "le ngoc bao nhi": {
    "aspiration": "Chưa có thông tin",
    "badge": "🌙 Giấc mơ đang lớn dần",
    "message": "Có những ước mơ chưa kịp viết thành tên, nhưng ánh mắt cố gắng của cậu đã đủ nói lên rằng tương lai vẫn đang rất đẹp.",
    "compliments": [
      "Chưa gọi tên được nguyện vọng không sao cả, vì có những giấc mơ đẹp cần thêm thời gian để nở rộ.",
      "Điều đáng quý ở cậu là vẫn đang cố gắng từng ngày, và chính điều đó đã rất đẹp rồi.",
      "Có thể hôm nay câu trả lời còn để trống, nhưng tương lai của cậu nhất định sẽ không hề mờ nhạt đâu."
    ],
    "photo": "images/tatca/hs_21.jpg"
  },
  "nguyen thi kieu oanh": {
    "aspiration": "FTU - Dữ liệu KH",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"FTU - Dữ liệu KH\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_22.jpg"
  },
  "phan le hong oanh": {
    "aspiration": "UEH - Marketing",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"UEH - Marketing\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_23.jpg"
  },
  "nguyen the phat": {
    "aspiration": "BK Hà Nội - Toán Tin",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"BK Hà Nội - Toán Tin\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_24.jpg"
  },
  "nguyen cao phong": {
    "aspiration": "Quân Y (Y khoa)",
    "badge": "🩺 Ước mơ chữa lành",
    "message": "\"Quân Y (Y khoa)\" là một ước mơ vừa lớn vừa đẹp, nhưng cậu cũng mang một trái tim đủ dịu để đi cùng nó.",
    "compliments": [
      "Ở cậu có sự điềm tĩnh và trái tim ấm áp, nghe đến ước mơ này là thấy đúng người đúng hướng luôn.",
      "Con đường áo blouse trắng vốn rất dài, nhưng nhìn sự bền bỉ của cậu là thấy xứng đáng vô cùng.",
      "Có những người sinh ra để chữa lành, và ở cậu có nét dịu dàng khiến ước mơ ấy càng đẹp hơn."
    ],
    "photo": "images/tatca/hs_25.jpg"
  },
  "huynh ngoc phuc": {
    "aspiration": "HCMUTE - Ô tô",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"HCMUTE - Ô tô\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_26.jpg"
  },
  "le thi thao phuong": {
    "aspiration": "ĐH An ninh Nhân dân",
    "badge": "🛡️ Bản lĩnh rất ngầu",
    "message": "\"ĐH An ninh Nhân dân\" nghe thật mạnh mẽ, như cách cậu đang lặng lẽ chọn cho mình một con đường đầy tự hào.",
    "compliments": [
      "Cậu có thần thái rất vững, kiểu người chỉ cần đứng đó thôi cũng khiến người khác cảm thấy yên tâm.",
      "Ước mơ khoác lên mình màu áo trách nhiệm nghe vừa ngầu vừa khiến người ta nể thật nhiều.",
      "Ở cậu có sự bản lĩnh kín đáo, càng nhìn càng thấy một tương lai rất kiêu hãnh đang chờ phía trước."
    ],
    "photo": "images/tatca/hs_27.jpg"
  },
  "đao huu phuoc": {
    "aspiration": "Học viện Hậu cần",
    "badge": "🛡️ Bản lĩnh rất ngầu",
    "message": "\"Học viện Hậu cần\" nghe thật mạnh mẽ, như cách cậu đang lặng lẽ chọn cho mình một con đường đầy tự hào.",
    "compliments": [
      "Cậu có thần thái rất vững, kiểu người chỉ cần đứng đó thôi cũng khiến người khác cảm thấy yên tâm.",
      "Ước mơ khoác lên mình màu áo trách nhiệm nghe vừa ngầu vừa khiến người ta nể thật nhiều.",
      "Ở cậu có sự bản lĩnh kín đáo, càng nhìn càng thấy một tương lai rất kiêu hãnh đang chờ phía trước."
    ],
    "photo": "images/tatca/hs_28.jpg"
  },
  "nguyen xuan quang": {
    "aspiration": "Sĩ quan Lục quân 2",
    "badge": "🛡️ Bản lĩnh rất ngầu",
    "message": "\"Sĩ quan Lục quân 2\" nghe thật mạnh mẽ, như cách cậu đang lặng lẽ chọn cho mình một con đường đầy tự hào.",
    "compliments": [
      "Cậu có thần thái rất vững, kiểu người chỉ cần đứng đó thôi cũng khiến người khác cảm thấy yên tâm.",
      "Ước mơ khoác lên mình màu áo trách nhiệm nghe vừa ngầu vừa khiến người ta nể thật nhiều.",
      "Ở cậu có sự bản lĩnh kín đáo, càng nhìn càng thấy một tương lai rất kiêu hãnh đang chờ phía trước."
    ],
    "photo": "images/tatca/hs_29.jpg"
  },
  "le đinh anh quan": {
    "aspiration": "HCMOU - Ngành Luật",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"HCMOU - Ngành Luật\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_30.jpg"
  },
  "thai anh quan": {
    "aspiration": "ĐH Tây Nguyên - TC Ngân hàng",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"ĐH Tây Nguyên - TC Ngân hàng\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_31.jpg"
  },
  "nguyen quoc": {
    "aspiration": "UIT - Vi mạch bán dẫn",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"UIT - Vi mạch bán dẫn\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_32.jpg"
  },
  "vu mai thao": {
    "aspiration": "Quản trị sự kiện",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"Quản trị sự kiện\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_33.jpg"
  },
  "chung chi thien": {
    "aspiration": "HCMUT - Thiết kế vi mạch",
    "badge": "💻 Team mơ tương lai số",
    "message": "Nguyện vọng \"HCMUT - Thiết kế vi mạch\" nghe như một vì sao công nghệ đang được cậu gọi tên bằng tất cả nỗ lực tuổi 17.",
    "compliments": [
      "Cậu mang vibe của một người rất biết mình muốn gì, cứ âm thầm nhưng càng nhìn càng thấy sáng.",
      "Ở cậu có kiểu thông minh bình tĩnh, giống như sau này sẽ biến cả đống ý tưởng thành điều thật sự đáng tự hào.",
      "Giấc mơ công nghệ nghe thôi đã thấy hợp với ánh mắt quyết tâm của cậu rồi."
    ],
    "photo": "images/tatca/hs_34.jpg"
  },
  "truong van thinh": {
    "aspiration": "ĐH Sư Phạm - SP Toán",
    "badge": "🌷 Dịu dàng mà nhiều nội lực",
    "message": "\"ĐH Sư Phạm - SP Toán\" là một giấc mơ đẹp, vì ở cậu có đủ sự ấm áp để khiến hành trình ấy trở nên đáng quý.",
    "compliments": [
      "Cậu mang cảm giác rất ấm, như một người sau này không chỉ giỏi mà còn đủ dịu dàng để chạm tới người khác.",
      "Ước mơ đứng trên bục giảng nghe thật đẹp khi đặt cạnh trái tim biết cố gắng của cậu.",
      "Cậu có kiểu tử tế khiến người ta tin rằng tương lai của cậu sẽ là một hành trình gieo rất nhiều điều tốt lành."
    ],
    "photo": "images/tatca/hs_35.jpg"
  },
  "pham thi hong thu": {
    "aspiration": "FTU - Marketing",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"FTU - Marketing\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_36.jpg"
  },
  "truong thi anh thu": {
    "aspiration": "KHTN - Ngành Hóa học",
    "badge": "⚙️ Trái tim mê chế tạo",
    "message": "Con đường \"KHTN - Ngành Hóa học\" có lẽ rất hợp với một người biết biến cố gắng thành những điều bền vững như cậu.",
    "compliments": [
      "Cậu có cảm giác rất chắc chắn, kiểu người đã chọn là sẽ đi tới cùng bằng sự bền bỉ của riêng mình.",
      "Nhìn cách cậu theo đuổi ước mơ thôi cũng đủ thấy tương lai sẽ được dựng lên bằng rất nhiều cố gắng đẹp đẽ.",
      "Ước mơ kỹ thuật ở cậu nghe vừa mạnh mẽ vừa đáng tin, giống một lời hứa với chính tương lai."
    ],
    "photo": "images/tatca/hs_37.jpg"
  },
  "vo ngoc minh thu": {
    "aspiration": "UEL - QTKD",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"UEL - QTKD\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_38.jpg"
  },
  "vu thi anh thu": {
    "aspiration": "UMP - Ngành Y Khoa",
    "badge": "🩺 Ước mơ chữa lành",
    "message": "\"UMP - Ngành Y Khoa\" là một ước mơ vừa lớn vừa đẹp, nhưng cậu cũng mang một trái tim đủ dịu để đi cùng nó.",
    "compliments": [
      "Ở cậu có sự điềm tĩnh và trái tim ấm áp, nghe đến ước mơ này là thấy đúng người đúng hướng luôn.",
      "Con đường áo blouse trắng vốn rất dài, nhưng nhìn sự bền bỉ của cậu là thấy xứng đáng vô cùng.",
      "Có những người sinh ra để chữa lành, và ở cậu có nét dịu dàng khiến ước mơ ấy càng đẹp hơn."
    ],
    "photo": "images/tatca/hs_39.jpg"
  },
  "đo trong tin": {
    "aspiration": "UMP - Dược sĩ",
    "badge": "🩺 Ước mơ chữa lành",
    "message": "\"UMP - Dược sĩ\" là một ước mơ vừa lớn vừa đẹp, nhưng cậu cũng mang một trái tim đủ dịu để đi cùng nó.",
    "compliments": [
      "Ở cậu có sự điềm tĩnh và trái tim ấm áp, nghe đến ước mơ này là thấy đúng người đúng hướng luôn.",
      "Con đường áo blouse trắng vốn rất dài, nhưng nhìn sự bền bỉ của cậu là thấy xứng đáng vô cùng.",
      "Có những người sinh ra để chữa lành, và ở cậu có nét dịu dàng khiến ước mơ ấy càng đẹp hơn."
    ],
    "photo": "images/tatca/hs_40.jpg"
  },
  "bui thi thuy van": {
    "aspiration": "Chưa có thông tin",
    "badge": "🌙 Giấc mơ đang lớn dần",
    "message": "Có những ước mơ chưa kịp viết thành tên, nhưng ánh mắt cố gắng của cậu đã đủ nói lên rằng tương lai vẫn đang rất đẹp.",
    "compliments": [
      "Chưa gọi tên được nguyện vọng không sao cả, vì có những giấc mơ đẹp cần thêm thời gian để nở rộ.",
      "Điều đáng quý ở cậu là vẫn đang cố gắng từng ngày, và chính điều đó đã rất đẹp rồi.",
      "Có thể hôm nay câu trả lời còn để trống, nhưng tương lai của cậu nhất định sẽ không hề mờ nhạt đâu."
    ],
    "photo": "images/tatca/hs_41.jpg"
  },
  "huynh khanh viet": {
    "aspiration": "UEH - QTKD",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"UEH - QTKD\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_42.jpg"
  },
  "hoang thi thanh van": {
    "aspiration": "UEH - Tài chính ngân hàng",
    "badge": "✨ Team bản lĩnh và tỏa sáng",
    "message": "\"UEH - Tài chính ngân hàng\" nghe như một sân khấu rất đúng để cậu mang sự tự tin, duyên dáng và bản lĩnh của mình bước tới.",
    "compliments": [
      "Cậu có chất riêng rất cuốn, kiểu người càng trưởng thành càng khiến người khác tin vào bản lĩnh của mình.",
      "Giấc mơ này hợp với cậu đến mức nghe thôi đã thấy một phiên bản rất rực rỡ đang chờ phía trước.",
      "Ở cậu có sự tự tin dịu dàng, như thể sau này dù đứng ở đâu cũng sẽ tỏa sáng theo cách rất riêng."
    ],
    "photo": "images/tatca/hs_43.jpg"
  }
};

function ensurePhotoPreviewLayout() {
  const dialog = qs('#photoPreviewModal .photo-preview-dialog');
  const stage = qs('#photoPreviewModal .photo-preview-stage');
  const kicker = qs('#photoPreviewModal .photo-preview-kicker');
  if (!dialog || !stage) return;
  if (kicker) kicker.textContent = 'Góc lưu niệm 12A1';
  if (!qs('#photoPreviewInfo')) {
    stage.insertAdjacentHTML('afterend', `
      <div class="photo-preview-info" id="photoPreviewInfo" hidden>
        <div class="photo-preview-badge-row" id="photoPreviewBadgeRow"></div>
        <div class="photo-preview-meta-grid">
          <article class="photo-preview-meta-card">
            <span class="photo-preview-label">Vai trò trong lớp</span>
            <strong id="photoPreviewRole">Đang cập nhật</strong>
          </article>
          <article class="photo-preview-meta-card">
            <span class="photo-preview-label">Ngày sinh</span>
            <strong id="photoPreviewBirthday">Đang cập nhật</strong>
          </article>
        </div>
        <article class="photo-preview-story-card">
          <span class="photo-preview-label">Nguyện vọng đầu tiên</span>
          <h4 id="photoPreviewAspiration">Đang cập nhật</h4>
          <p id="photoPreviewMessage">Một giấc mơ đẹp luôn xứng đáng được gọi tên.</p>
        </article>
        <article class="photo-preview-story-card">
          <span class="photo-preview-label">Lời khen ngọt hơn trà sữa</span>
          <ul class="photo-preview-praise-list" id="photoPreviewPraiseList"></ul>
        </article>
      </div>
    `);
  }
}

function renderPhotoPreviewMeta(meta = {}) {
  ensurePhotoPreviewLayout();
  const panel = qs('#photoPreviewInfo');
  const badgeRow = qs('#photoPreviewBadgeRow');
  const roleEl = qs('#photoPreviewRole');
  const birthdayEl = qs('#photoPreviewBirthday');
  const aspirationEl = qs('#photoPreviewAspiration');
  const messageEl = qs('#photoPreviewMessage');
  const praiseList = qs('#photoPreviewPraiseList');
  const kicker = qs('#photoPreviewModal .photo-preview-kicker');

  const compliments = Array.isArray(meta.compliments)
    ? meta.compliments.filter(Boolean)
    : String(meta.compliments || '').split('||').map((item) => item.trim()).filter(Boolean);

  const hasRichMeta = Boolean(meta.role || meta.birthday || meta.aspiration || meta.message || compliments.length || meta.badge);
  if (!panel) return;

  if (kicker) {
    kicker.textContent = meta.kicker || (hasRichMeta ? 'Góc thanh xuân 12A1' : 'Xem ảnh');
  }

  panel.hidden = !hasRichMeta;
  if (!hasRichMeta) {
    if (badgeRow) badgeRow.innerHTML = '';
    if (praiseList) praiseList.innerHTML = '';
    return;
  }

  if (badgeRow) {
    const badges = [meta.badge, meta.tag].filter(Boolean);
    badgeRow.innerHTML = badges.map((item) => `<span class="photo-preview-badge">${escapeHtml(item)}</span>`).join('');
  }
  if (roleEl) roleEl.textContent = meta.role || 'Một mảnh ghép rất xinh của 12A1';
  if (birthdayEl) birthdayEl.textContent = meta.birthday || 'Ngày nào cũng đáng yêu';
  if (aspirationEl) aspirationEl.textContent = meta.aspiration || 'Đang viết tiếp giấc mơ';
  if (messageEl) messageEl.textContent = meta.message || 'Có những ước mơ chỉ cần nghe tên thôi cũng thấy rất đẹp.';
  if (praiseList) {
    praiseList.innerHTML = compliments.length
      ? compliments.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : '<li>Mỗi người trong 12A1 đều là một mảnh ghép rất đáng tự hào của thanh xuân này.</li>';
  }
}

window.openPhotoPreview = function openPhotoPreview(src, title = 'Xem ảnh', fallback = '', meta = {}) {
  const modal = qs('#photoPreviewModal');
  const image = qs('#photoPreviewImage');
  const heading = qs('#photoPreviewTitle');
  if (!modal || !image) return;

  ensurePhotoPreviewLayout();
  const safeSrc = src || fallback;
  if (!safeSrc) return;

  image.src = safeSrc;
  image.alt = title || 'Xem ảnh';
  image.dataset.fallback = fallback || '';
  image.onerror = function handlePreviewError() {
    window.handlePhotoImageFallback(image, fallback);
  };

  if (heading) heading.textContent = title || 'Xem ảnh';
  renderPhotoPreviewMeta(meta);

  modal.classList.add('open');
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('photo-preview-open');
};

window.closePhotoPreview = function closePhotoPreview() {
  const modal = qs('#photoPreviewModal');
  const image = qs('#photoPreviewImage');
  const panel = qs('#photoPreviewInfo');
  const badgeRow = qs('#photoPreviewBadgeRow');
  const praiseList = qs('#photoPreviewPraiseList');
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
  if (panel) panel.hidden = true;
  if (badgeRow) badgeRow.innerHTML = '';
  if (praiseList) praiseList.innerHTML = '';
};

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
      const meta = {
        kicker: card.dataset.photoKicker || '',
        badge: card.dataset.photoBadge || '',
        tag: card.dataset.photoTag || '',
        role: card.dataset.photoRole || '',
        birthday: card.dataset.photoBirthday || '',
        aspiration: card.dataset.photoAspiration || '',
        message: card.dataset.photoMessage || '',
        compliments: card.dataset.photoCompliments || ''
      };
      window.openPhotoPreview(src, title, fallback, meta);
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

function getClassPhotoItems() {
  return CLASS_MEMORY_PHOTOS.map((item, index) => {
    const layout = CLASS_PHOTO_LAYOUTS[index % CLASS_PHOTO_LAYOUTS.length];
    return {
      ...item,
      src: normalizeClassPhotoSource(item.src, item, index),
      alt: item.alt || item.title || `Ảnh ${index + 1}`,
      title: item.title || `Khoảnh khắc ${index + 1}`,
      caption: item.caption || item.title || `Khoảnh khắc ${index + 1}`,
      story: item.story || item.caption || item.title || `Khoảnh khắc ${index + 1}`,
      note: item.note || 'Kỷ niệm',
      size: item.size || layout.size,
      rotate: typeof item.rotate === 'number' ? item.rotate : layout.rotate,
      index
    };
  });
}

function buildStudentCommunityCards() {
  return getStudentRows().map((row, index) => {
    const name = (qs('td:nth-child(2)', row)?.textContent || '').trim();
    const birthday = (qs('td:nth-child(3)', row)?.textContent || '').trim();
    const gender = (qs('td:nth-child(4)', row)?.textContent || '').trim();
    const role = (qs('td:nth-child(5)', row)?.textContent || '').trim();
    const status = (qs('td:nth-child(6)', row)?.textContent || '').trim();
    const fallback = createAvatarData(name, gender.includes('Nữ') ? 'female' : 'male');
    const extra = STUDENT_ASPIRATION_DETAILS[normalizeText(name)] || {};
    return {
      name,
      birthday,
      gender,
      role,
      status,
      image: extra.photo || getStudentImageByOrder(index + 1),
      fallback,
      aspiration: extra.aspiration || 'Đang viết tiếp giấc mơ của riêng mình',
      compliments: extra.compliments || ['Cậu là một mảnh ghép rất đáng yêu của 12A1.'],
      message: extra.message || 'Có những ước mơ chỉ cần gọi tên thôi cũng đã rất đẹp rồi.',
      badge: extra.badge || '🌟 Một mảnh trời rất riêng',
      order: String(index + 1).padStart(2, '0')
    };
  }).filter((item) => item.name);
}

function renderStudentCommunityGrid() {
  const container = qs('#studentCommunityGrid');
  if (!container) return;
  const students = buildStudentCommunityCards();
  container.innerHTML = students.map((student) => `
    <article
      class="student-mini-card photo-preview-trigger"
      data-photo-src="${escapeAttr(student.image)}"
      data-photo-fallback="${escapeAttr(student.fallback || '')}"
      data-photo-title="${escapeAttr(student.name)}"
      data-photo-kicker="Góc thanh xuân 12A1"
      data-photo-role="${escapeAttr(student.role || student.status || 'Học sinh')}"
      data-photo-birthday="${escapeAttr(student.gender)} • ${escapeAttr(student.birthday)}"
      data-photo-aspiration="${escapeAttr(student.aspiration)}"
      data-photo-message="${escapeAttr(student.message)}"
      data-photo-badge="${escapeAttr(student.badge)}"
      data-photo-compliments="${escapeAttr((student.compliments || []).join('||'))}"
      aria-label="Xem ảnh và nguyện vọng của ${escapeHtml(student.name)}"
    >
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

function refreshClassMemoryLabels() {
  const chips = qsa('.class-memory-chip');
  if (chips[1]) {
    chips[1].textContent = `${CLASS_MEMORY_PHOTOS.length} khung ảnh`;
  }
  const ready = qs('#classPhotoReadyCount');
  if (ready) ready.textContent = String(CLASS_MEMORY_PHOTOS.length);
}

document.addEventListener('DOMContentLoaded', () => {
  ensurePhotoPreviewLayout();
  refreshClassMemoryLabels();
  renderClassPhotoBoard();
  renderStudentCommunityGrid();
});
