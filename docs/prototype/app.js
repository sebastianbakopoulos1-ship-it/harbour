/* Harbour prototype — vanilla JS.
   Structure mirrors the planned React Native app:
   store (state + persistence) → selectors → screens (render fns) → actions (event handlers).
   Navigation: 3 tabs (Home · Services · Wallet), each with its own push stack. */
(function () {
  "use strict";

  /* ============================ Icons ============================ */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    store: '<path d="M3 9.5 4.5 4h15L21 9.5"/><path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/><path d="M10 20v-5h4v5"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 3.5h10"/>',
    car: '<path d="M5 17h14M5 17a2 2 0 1 1-4 0v-4l2.2-5.2A2 2 0 0 1 5 6.5h14a2 2 0 0 1 1.8 1.3L23 13v4a2 2 0 1 1-4 0"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 13h18"/>',
    receipt: '<path d="M6 2.5h12a1 1 0 0 1 1 1V21l-3-2-2 2-2-2-2 2-2-2-3 2V3.5a1 1 0 0 1 1-1Z"/><path d="M9 7.5h6M9 11.5h6M9 15.5h3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    arrowR: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    plusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    alertCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    pencil: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    megaphone: '<path d="m3 11 15-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    fish: '<path d="M6.5 12c3-5 10-6 14.5 0-4.5 6-11.5 5-14.5 0Z"/><path d="M6.5 12 2 8v8z"/><circle cx="17" cy="11" r=".6" fill="currentColor"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 13.5h3"/>',
    rotate: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 6.5H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    fingerprint: '<path d="M12 11v3a8 8 0 0 1-1.5 4.5"/><path d="M8.5 7.6A5 5 0 0 1 17 11v1.5M7 11a5 5 0 0 1 .3-1.7M7 14.5a12 12 0 0 1-1 4"/><path d="M15.7 15.5a17 17 0 0 1-1.2 5.5M4 8.5A9 9 0 0 1 20.3 9"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    piggy: '<path d="M19 9.5c1 .8 1.5 2 1.5 3.5h1.5v3h-2l-1.5 2.5V21h-3v-1.5h-5V21h-3v-2.6A6.5 6.5 0 0 1 8 6h4.5L16 4v3.2"/><circle cx="15.5" cy="11" r=".7" fill="currentColor"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h14"/><path d="M9 7h7"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M9.5 20v-5.5h5V20"/>',
    heart: '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 6.3a4.5 4.5 0 0 1 8 3.2C20 15.4 12 20 12 20Z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z"/>',
    message: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.5-4.8A8 8 0 1 1 21 12Z"/>',
    more: '<circle cx="12" cy="5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
    thumbUp: '<path d="M7 10v11H3V10z"/><path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.1 21H7"/>',
    thumbDown: '<path d="M17 14V3h4v11z"/><path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 5.9 3H17"/>',
    backspace: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"/><path d="m17 9-6 6M11 9l6 6"/>',
  };
  const icon = (name, size = 22, sw = 1.9) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;
  const starIcon = (on, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">${P.star}</svg>`;

  // Original Harbour mark: an arch over water. Not based on any government emblem.
  const logo = (size = 28) => `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--brand)"/>
      <path d="M7 19.5C7 13.2 11 9 16 9s9 4.2 9 10.5" fill="none" stroke="var(--on-brand)" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M6 23.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;

  // Original generated header art (gradient + shapes + icon) — no stock photography.
  const art = (hue, ic, h = 120) => `
    <div class="art" style="--h:${hue};height:${h}px" aria-hidden="true">
      <svg class="art-bg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice">
        <circle cx="285" cy="-5" r="95" fill="#fff" opacity=".10"/><circle cx="300" cy="20" r="55" fill="#fff" opacity=".10"/>
        <circle cx="30" cy="140" r="70" fill="#000" opacity=".10"/>
        <path d="M0 100 Q 40 88 80 100 T 160 100 T 240 100 T 320 100 V120 H0Z" fill="#fff" opacity=".08"/>
        <g fill="#fff" opacity=".18">${Array.from({ length: 18 }, (_, i) => `<circle cx="${24 + (i % 6) * 14}" cy="${22 + Math.floor(i / 6) * 14}" r="1.6"/>`).join("")}</g>
      </svg>
      <span class="art-ic">${icon(ic, Math.round(h / 3.2), 1.7)}</span>
    </div>`;

  /* ============================ Utils ============================ */
  const DAY = 86400000;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const toLocalIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const daysUntil = (isoDate) => Math.round((new Date(isoDate + "T00:00:00") - today()) / DAY);
  const fmtDate = (isoDate) => new Date(isoDate + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  const fmtMoney = (n) => n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });
  const relTime = (isoTs) => {
    const m = Math.round((Date.now() - new Date(isoTs)) / 60000);
    if (m < 1) return "now"; if (m < 60) return m + "m"; const h = Math.round(m / 60);
    if (h < 24) return h + "h"; const d = Math.round(h / 24); if (d < 7) return d + "d";
    return new Date(isoTs).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  };
  const uid = (p) => p + Math.random().toString(36).slice(2, 9);
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
  const addYear = (isoDate) => { const d = new Date(isoDate + "T00:00:00"); const base = d < today() ? today() : d; base.setFullYear(base.getFullYear() + 1); return toLocalIso(base); };
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

  /* ============================ Store ============================ */
  const KEY = "harbour.proto.v2";
  const load = () => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s.version === 2) return s; } } catch (e) { /* storage blocked */ }
    return window.HARBOUR_SEED();
  };
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const CATS = window.HARBOUR_CATEGORIES;
  const FEATURED = window.HARBOUR_FEATURED;

  // UI-only state (not persisted)
  const freshStacks = () => ({ home: [], services: [], wallet: [] });
  const UI = {
    tab: "home", stacks: freshStacks(), anim: "fade",
    sheet: null, dialog: null, loading: true,
    locked: !!S.settings.appLock, pin: "", pinError: "",
    finesFilter: "all", notifFilter: "all", walletFilter: "all",
    reorder: false, walletRefresh: {}, errors: {}, svcVote: null,
  };

  /* ========================== Selectors ========================== */
  const regoStatus = (v) => {
    const d = daysUntil(v.expiry);
    if (d < 0) return { key: "expired", label: "Expired", tone: "danger", text: `Expired ${plural(-d, "day")} ago`, d };
    if (d <= 30) return { key: "due", label: "Due soon", tone: "warning", text: `Expires in ${plural(d, "day")}`, d };
    return { key: "current", label: "Current", tone: "success", text: `Expires ${fmtDate(v.expiry)}`, d };
  };
  const fineStatus = (f) => {
    if (f.status === "paid") return { label: "Paid", tone: "success" };
    if (daysUntil(f.due) < 0) return { label: "Overdue", tone: "danger" };
    return { label: "Unpaid", tone: "warning" };
  };
  const isOpenFine = (f) => f.status !== "paid";
  const demeritBalance = () => { const cutoff = Date.now() - 3 * 365 * DAY; return S.fines.filter((f) => new Date(f.date) > cutoff).reduce((a, f) => a + f.points, 0); };
  const unreadCount = () => S.notifications.filter((n) => !n.read).length;
  const walletCreds = () => S.credentials.filter((c) => c.inWallet);
  const favCreds = () => walletCreds().filter((c) => c.fav);
  const reminders = () => {
    const out = [];
    S.vehicles.forEach((v) => { const r = regoStatus(v); if (r.key !== "current") out.push({ tone: r.tone, icon: "car", title: `${v.plate} registration ${r.key === "expired" ? "expired" : "due"}`, body: r.text, go: `vehicle:${v.id}` }); });
    S.fines.filter(isOpenFine).forEach((f) => { const st = fineStatus(f); out.push({ tone: st.tone, icon: "receipt", title: `${fmtMoney(f.amount)} notice ${st.label.toLowerCase()}`, body: `${f.ref} · due ${fmtDate(f.due)}`, go: `fine:${f.id}` }); });
    walletCreds().forEach((c) => { const d = daysUntil(c.expiry); if (d >= 0 && d <= 60) out.push({ tone: "info", icon: "card", title: `${c.title} expires in ${d} days`, body: "Demo credential renewal reminder", go: `cred:${c.id}` }); });
    const order = { danger: 0, warning: 1, info: 2 };
    return out.sort((a, b) => order[a.tone] - order[b.tone]);
  };
  const allServiceItems = () => {
    const seen = new Map();
    CATS.forEach((c) => c.items.forEach(([t, go]) => { if (!seen.has(t)) seen.set(t, [t, go, c.title]); }));
    return [...seen.values()].sort((a, b) => a[0].localeCompare(b[0]));
  };

  const HOME_SERVICES = {
    vehicles: { icon: "car", title: "Vehicle registrations", sub: () => { const s = S.vehicles.map(regoStatus); const exp = s.filter((r) => r.key === "expired").length, due = s.filter((r) => r.key === "due").length; return exp || due ? [due && `${due} due soon`, exp && `${exp} expired`].filter(Boolean).join(" · ") : plural(S.vehicles.length, "vehicle"); } },
    fines: { icon: "receipt", title: "Fines and demerits", sub: () => { const n = S.fines.filter(isOpenFine).length; return n ? `${n} to pay · ${demeritBalance()} demerit points` : `Nothing to pay · ${demeritBalance()} points`; } },
    notifications: { icon: "bell", title: "Reminders and alerts", sub: () => { const n = unreadCount(); return n ? `${n} unread` : "All caught up"; } },
    wallet: { icon: "wallet", title: "Digital wallet", sub: () => plural(walletCreds().length, "demo card") },
    account: { icon: "user", title: "Profile and settings", sub: () => "Details, security, privacy, appearance" },
  };

  /* ======================== Shared pieces ======================== */
  const navBar = (title, { back = true, right = "" } = {}) => `
    <div class="safe-top"></div>
    <div class="nav-bar">
      <div class="side">${back ? `<button class="icon-btn" data-act="back" aria-label="Back">${icon("chevL", 24, 2.2)}</button>` : ""}</div>
      <div class="title">${esc(title)}</div>
      <div class="side right">${right}</div>
    </div>`;
  const titleBar = (title, right = "") => `<div class="safe-top"></div><div class="nav-bar ruled"><div class="side"></div><div class="title">${esc(title)}</div><div class="side right">${right}</div></div>`;
  const pill = (tone, label) => `<span class="pill ${tone}">${esc(label)}</span>`;
  const empty = (ic, title, body, cta = "") => `<div class="empty"><div class="glyph">${icon(ic, 26)}</div><h3>${esc(title)}</h3><p>${esc(body)}</p>${cta}</div>`;
  const sectionHead = (title, action = "") => `<div class="section-head"><h2>${esc(title)}</h2>${action}</div>`;
  const chev = `<span class="chev">${icon("chevR", 18, 2.2)}</span>`;
  const bellBtn = () => { const n = unreadCount(); return `<button class="icon-btn" data-act="open" data-to="notifications" aria-label="Notifications, ${n} unread">${icon("bell", 24)}${n ? `<span class="badge-dot">${n}</span>` : ""}</button>`; };

  const credPalette = {
    teal: ["#0B5D66", "#0F7D80", "#13999A"], slate: ["#2D3A55", "#46557A", "#5F6E96"], kelp: ["#1F5C3A", "#2E7D4F", "#4C9A62"],
    sand: ["#8A5A1F", "#B57A2E", "#D49C4D"], ink: ["#1C2230", "#2A3245", "#3B4560"], ocean: ["#13406B", "#1D5F96", "#2F7DBE"], plum: ["#4A2350", "#6B3474", "#8E4E98"],
  };
  const credPattern = (style) => {
    const [a, b, c] = credPalette[style];
    return `<svg class="pattern" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="g-${style}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="320" height="200" fill="url(#g-${style})"/>
      <circle cx="290" cy="-10" r="120" fill="${c}" opacity=".35"/><circle cx="300" cy="10" r="70" fill="${c}" opacity=".35"/>
      <path d="M0 170 Q 40 155 80 170 T 160 170 T 240 170 T 320 170 V200 H0Z" fill="#fff" opacity=".06"/>
      <path d="M0 182 Q 40 167 80 182 T 160 182 T 240 182 T 320 182 V200 H0Z" fill="#fff" opacity=".06"/>
    </svg>`;
  };
  const watermark = () => `<div class="watermark" aria-hidden="true">${Array(9).fill("<span>DEMONSTRATION ONLY · DEMONSTRATION ONLY · DEMONSTRATION ONLY</span>").join("")}</div>`;
  const silhouette = (size = 56) => `<svg width="${size}" height="${size}" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="22" r="11" fill="rgba(255,255,255,.55)"/><path d="M6 58c2-13 11-19 22-19s20 6 22 19" fill="rgba(255,255,255,.55)"/></svg>`;
  const credCard = (c, mini = false) => `
    <div class="cred ${mini ? "mini" : ""}" role="img" aria-label="${esc(c.title)} — demonstration only, not valid identification">
      ${credPattern(c.style)}${watermark()}
      <div class="top"><div><div class="kind">${esc(c.kind)}</div><div class="name">${esc(c.title)}</div></div><span class="demo-tag">DEMO ONLY</span></div>
      <div class="bottom">
        <div>${mini ? `<div class="field-l">Expires</div><div class="field-v mono">${fmtDate(c.expiry)}</div>` : `<div class="field-l">Holder</div><div class="field-v">${esc(S.profile.firstName)} ${esc(S.profile.lastName)}</div><div class="field-l" style="margin-top:10px">Expires</div><div class="field-v mono">${fmtDate(c.expiry)}</div>`}</div>
        ${c.photo && !mini ? `<div class="photo">${silhouette(60)}</div>` : `<div style="opacity:.9">${logo(mini ? 24 : 28)}</div>`}
      </div>
    </div>`;

  // A QR-like pattern that is intentionally NOT a valid QR code (no format/version info, random modules).
  const fakeQR = (seed) => {
    let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const N = 25, cell = 172 / N; let rects = "";
    const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (finder(x, y) || (x > 8 && x < 16 && y > 9 && y < 15)) continue;
      if (rnd() > 0.52) rects += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`;
    }
    const f = (x, y) => `<rect x="${x * cell}" y="${y * cell}" width="${7 * cell}" height="${7 * cell}" rx="${cell}"/><rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${5 * cell}" height="${5 * cell}" rx="${cell * 0.6}" fill="#fff"/><rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" rx="${cell * 0.5}"/>`;
    return `<div class="qr" role="img" aria-label="Non-functional demo QR pattern"><svg width="172" height="172" viewBox="0 0 172 172" fill="#0F1E21">${rects}${f(0, 0)}${f(N - 7, 0)}${f(0, N - 7)}</svg><div class="void"><span>DEMO</span></div></div>`;
  };

  /* =========================== Screens =========================== */
  const Screens = {};

  /* ---------- Home (tab) ---------- */
  Screens.home = () => {
    if (UI.loading) return homeSkeleton();
    const favs = favCreds();
    const rem = reminders();
    const order = S.settings.homeOrder;
    return `
      <div class="safe-top"></div>
      <div class="home-head">
        <div class="brandmark">${logo(34)}<span>Harbour</span></div>
        ${bellBtn()}
        <button class="icon-btn" data-act="open" data-to="account" aria-label="Profile and settings"><div class="avatar sm">${esc(S.profile.firstName[0])}${esc(S.profile.lastName[0])}</div></button>
      </div>
      <div class="scroll" data-scroll="home">
        <div class="greet">${greeting()}, <b>${esc(S.profile.firstName)}</b></div>

        ${sectionHead("Favourites", `<button data-act="sheet" data-sheet="manageFavs">Edit</button>`)}
        <div class="hero-strip fav-strip" id="fav-strip">
          ${favs.map((c) => `<button class="fav-item" data-act="open" data-to="cred:${c.id}" aria-label="Open ${esc(c.title)}">${credCard(c, true)}</button>`).join("")}
          <button class="fav-item fav-add" data-act="sheet" data-sheet="manageFavs"><span>${starIcon(false, 30)}</span>Tap to manage favourites</button>
        </div>
        <div class="dots" id="fav-dots" aria-hidden="true">${Array.from({ length: favs.length + 1 }, (_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("")}</div>

        ${rem.length ? `${sectionHead("Needs your attention")}
        <div class="card">${rem.slice(0, 3).map((r) => `
          <button class="reminder" data-act="open" data-to="${r.go}">
            <div class="glyph ${r.tone}">${icon(r.tone === "danger" ? "alert" : r.icon, 20)}</div>
            <div style="flex:1;min-width:0"><div class="t">${esc(r.title)}</div><div class="s">${esc(r.body)}</div></div>${chev}
          </button>`).join("")}
        </div>` : ""}

        ${sectionHead("Featured")}
        <div class="hero-strip">
          ${FEATURED.map((f) => `<button class="feat card" data-act="open" data-to="${f.go}">${art(f.hue, f.icon, 84)}<div class="feat-body"><span>${esc(f.title)}</span>${icon("arrowR", 20, 2)}</div></button>`).join("")}
        </div>

        ${sectionHead("Services", `<button data-act="reorder" aria-pressed="${UI.reorder}">${UI.reorder ? "Done" : "Reorder"}</button>`)}
        <div class="svc-list ${UI.reorder ? "editing" : ""}">
          ${order.map((k, i) => { const s = HOME_SERVICES[k]; return UI.reorder ? `
            <div class="svc-row"><span class="svc-ic">${icon(s.icon, 26, 1.7)}</span><div class="body"><div class="t">${s.title}</div></div>
              <button class="icon-btn" data-act="move" data-k="${k}" data-dir="-1" ${i === 0 ? "disabled" : ""} aria-label="Move ${s.title} up">${icon("arrowUp", 20, 2.2)}</button>
              <button class="icon-btn" data-act="move" data-k="${k}" data-dir="1" ${i === order.length - 1 ? "disabled" : ""} aria-label="Move ${s.title} down">${icon("arrowDown", 20, 2.2)}</button></div>` : `
            <button class="svc-row" data-act="open" data-to="${k === "wallet" ? "tab:wallet" : k}"><span class="svc-ic">${icon(s.icon, 26, 1.7)}</span><div class="body"><div class="t">${s.title}</div><div class="s">${esc(s.sub())}</div></div>${chev}</button>`; }).join("")}
        </div>

        <button class="help-link" data-act="open" data-to="help">${icon("help", 22)}<span>Help and support</span></button>
        <p class="foot-note">${logo(18).replace("<svg", '<svg style="display:inline-block;vertical-align:-4px;margin-right:6px"')}Harbour is a design prototype.<br>All data is fictional and nothing here is a real government service.</p>
      </div>`;
  };
  const homeSkeleton = () => `
    <div class="safe-top"></div>
    <div class="home-head"><div class="skel" style="width:130px;height:34px"></div><div style="flex:1"></div><div class="skel" style="width:36px;height:36px;border-radius:50%"></div><div class="skel" style="width:36px;height:36px;border-radius:50%"></div></div>
    <div class="scroll"><div class="skel" style="width:180px;height:20px;margin-top:8px"></div>
      <div class="skel mt-6" style="height:180px;border-radius:18px;width:85%"></div>
      <div class="skel mt-6" style="height:150px;border-radius:16px"></div>
      ${Array(3).fill('<div class="skel mt-4" style="height:72px;border-radius:16px"></div>').join("")}</div>`;

  /* ---------- Services (tab) ---------- */
  Screens.services = () => `
    ${titleBar("Services")}
    <div class="scroll" data-scroll="services">
      <label class="search mt-4">${icon("search", 20)}<input id="cat-search" type="search" placeholder="Search services and topics" autocomplete="off" aria-label="Search services"></label>
      <div id="cat-list" class="cat-list">
        ${CATS.map((c) => { const words = (c.title + " " + c.blurb + " " + c.items.map((i) => i[0]).join(" ")).toLowerCase(); return `
          <button class="cat-card card" data-act="open" data-to="category:${c.id}" data-search="${esc(words)}">
            ${art(c.hue, c.icon, 112)}
            <div class="cat-body"><div class="cat-t">${esc(c.title)}</div><div class="cat-s">${esc(c.blurb)}</div><span class="cat-go">${icon("arrowR", 22, 2)}</span></div>
          </button>`; }).join("")}
      </div>
      <div id="cat-empty" class="hidden">${empty("search", "Nothing matches", "Try a topic like “boat”, “rent” or “childcare”.")}</div>
      <div class="vote card">
        ${UI.svcVote ? `<div class="vote-done">${icon("checkCircle", 22)}<span>Thanks — your ${UI.svcVote === "good" ? "thumbs up" : "feedback"} was saved (demo).</span></div>
          ${UI.svcVote === "bad" ? `<button class="btn secondary mt-4" data-act="sheet" data-sheet="feedback">Tell us what was hard</button>` : ""}` : `
        <h3>How easy was it to find what you needed?</h3>
        <div class="btn-row"><button class="btn outline" data-act="vote" data-v="good">${icon("thumbUp", 20)} Easy</button><button class="btn outline" data-act="vote" data-v="bad">${icon("thumbDown", 20)} Not really</button></div>`}
      </div>
    </div>`;

  Screens.category = ({ id }) => {
    const c = CATS.find((x) => x.id === id);
    if (!c) return notFound("Topic");
    const items = c.id === "all" ? allServiceItems() : c.items.map(([t, go]) => [t, go, null]);
    return `
      ${navBar(c.title)}
      <div class="scroll">
        <div class="card" style="overflow:hidden">${art(c.hue, c.icon, 128)}<div class="cat-body"><div class="cat-s" style="font-size:15px">${esc(c.blurb)}</div></div></div>
        ${sectionHead(c.id === "all" ? `${items.length} services, A–Z` : "In this topic")}
        <div class="list">
          ${items.map(([t, go, from]) => `
            <button class="row plain" data-act="${go ? "open" : "placeholder"}" data-to="${go || ""}" data-name="${esc(t)}">
              <div class="body"><div class="t">${esc(t)}</div><div class="s">${go ? "Open in Harbour" : "Placeholder · not in this demo"}${from ? ` · ${esc(from)}` : ""}</div></div>
              ${go ? chev : `<span class="chev">${icon("info", 18, 2)}</span>`}
            </button>`).join("")}
        </div>
        <p class="foot-note">Topics and services are fictional examples for this prototype.</p>
      </div>`;
  };

  /* ---------- Wallet (tab) ---------- */
  Screens.wallet = () => {
    const all = walletCreds(), favs = favCreds();
    const list = UI.walletFilter === "fav" ? favs : all;
    return `
      ${titleBar("Wallet", `<button class="icon-btn" data-act="sheet" data-sheet="walletMenu" aria-label="Wallet options">${icon("more", 24)}</button>`)}
      <div class="scroll" data-scroll="wallet" style="padding-bottom:110px">
        <div class="chips mt-4">
          <button class="chip ${UI.walletFilter === "all" ? "on" : ""}" data-act="walletFilter" data-k="all">All (${all.length})</button>
          <button class="chip ${UI.walletFilter === "fav" ? "on" : ""}" data-act="walletFilter" data-k="fav">Favourites (${favs.length})</button>
        </div>
        ${list.length ? `<div class="wallet-stack">${list.map((c) => `<button class="cred-btn" data-act="open" data-to="cred:${c.id}" aria-label="Open ${esc(c.title)}">${credCard(c)}</button>`).join("")}</div>
          <div class="disclaimer mt-6">${icon("alert", 18)}<span>Demonstration credentials with fictional details. They are not licences or ID.</span></div>`
          : UI.walletFilter === "fav"
            ? `<div class="card">${empty("star", "No favourites yet", "Star a card to pin it to your Home screen.", `<button class="btn primary" style="width:auto" data-act="sheet" data-sheet="manageFavs">Choose favourites</button>`)}</div>`
            : `<div class="card">${empty("wallet", "Your wallet is empty", "Add a demo credential to see how cards look and work.", `<button class="btn primary" style="width:auto" data-act="sheet" data-sheet="addCred">${icon("plus", 18, 2.4)} Add a card</button>`)}</div>`}
      </div>
      <button class="fab" data-act="sheet" data-sheet="addCred">${icon("plusCircle", 22, 2)} Add</button>`;
  };

  Screens.cred = ({ id }) => {
    const c = S.credentials.find((x) => x.id === id);
    if (!c) return notFound("Credential");
    const d = daysUntil(c.expiry);
    const rf = UI.walletRefresh[c.id];
    const refreshed = typeof rf === "number" ? new Date(rf) : null;
    return `
      ${navBar(c.title, { right: c.inWallet ? `<button class="icon-btn star ${c.fav ? "on" : ""}" data-act="fav" data-id="${c.id}" aria-pressed="${c.fav}" aria-label="${c.fav ? "Remove from" : "Add to"} favourites">${starIcon(c.fav, 23)}</button>` : "" })}
      <div class="scroll">
        ${credCard(c)}
        ${c.inWallet ? `<div class="card mt-4"><div class="qr-wrap">
          ${fakeQR(c.number + (refreshed ? refreshed.getTime() : ""))}
          <div class="small muted center" style="max-width:250px">This pattern is decorative and cannot be scanned or verified.</div>
          ${rf === "loading" ? `<button class="btn secondary" disabled><span class="spinner"></span> Refreshing…</button>` : `<button class="btn secondary" data-act="refreshCred" data-id="${c.id}">${icon("refresh", 18, 2.2)} Refresh</button>`}
          ${rf === "error" ? `<div class="err-card" style="padding:0;color:var(--danger)">${icon("alert", 18)}<span class="small" style="font-weight:600">Couldn’t refresh (simulated network error). Try again.</span></div>` : ""}
          ${refreshed ? `<div class="small muted">Refreshed ${refreshed.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</div>` : ""}
        </div></div>` : `<div class="card pad mt-4" style="display:flex;gap:12px;align-items:center">${icon("info", 20)}<span class="small muted">This demo card isn’t in your wallet yet.</span></div>`}
        ${sectionHead("Details")}
        <div class="card pad"><div class="kv">
          <div class="full"><div class="l">Holder</div><div class="v">${esc(S.profile.firstName)} ${esc(S.profile.lastName)}</div></div>
          <div class="full"><div class="l">Demo number</div><div class="v mono">${esc(c.number)}</div></div>
          ${c.fields.map(([l, v]) => `<div><div class="l">${esc(l)}</div><div class="v">${esc(v)}</div></div>`).join("")}
          <div><div class="l">Issued</div><div class="v">${fmtDate(c.issued)}</div></div>
          <div><div class="l">Expires</div><div class="v">${fmtDate(c.expiry)}</div></div>
          <div class="full">${d <= 60 ? pill("warning", `Expires in ${d} days`) : pill("success", "Active (demo)")}</div>
        </div></div>
        <div class="disclaimer mt-4">${icon("shield", 18)}<span>DEMONSTRATION ONLY. Not issued by any government or organisation.</span></div>
        ${c.inWallet ? `<button class="btn danger mt-6" data-act="removeCred" data-id="${c.id}">${icon("trash", 18, 2.2)} Remove from wallet</button>`
          : `<button class="btn primary mt-6" data-act="addCred" data-id="${c.id}">${icon("plus", 18, 2.4)} Add to wallet</button>`}
      </div>`;
  };

  /* ---------- Help ---------- */
  Screens.help = () => `
    ${navBar("Help and support")}
    <div class="scroll">
      <h1 class="big-q">Want to share feedback or tell us about a problem?</h1>
      <p class="muted" style="margin:0 0 16px">Choose what you’d like to do</p>
      <div class="list">
        <button class="row" data-act="sheet" data-sheet="feedback"><div class="glyph">${icon("message", 20)}</div><div class="body"><div class="t">Share feedback</div><div class="s">Ideas, praise or things to improve</div></div>${chev}</button>
        <button class="row" data-act="sheet" data-sheet="issue"><div class="glyph warning">${icon("alert", 20)}</div><div class="body"><div class="t">Report a problem</div><div class="s">Something in the app isn’t working</div></div>${chev}</button>
        <button class="row" data-act="placeholder" data-name="Formal complaints"><div class="glyph danger">${icon("alertCircle", 20)}</div><div class="body"><div class="t">Make a formal complaint</div><div class="s">Placeholder · not in this demo</div></div><span class="chev">${icon("info", 18, 2)}</span></button>
      </div>
      ${S.feedback.length ? `${sectionHead("Sent from this device")}
        <div class="list">${S.feedback.slice().reverse().map((f) => `<div class="row plain"><div class="body"><div class="t">${esc(f.kind)}${f.rating ? ` · ${esc(f.rating)}` : ""}</div><div class="s">${esc(f.text)}</div></div><span class="small muted">${relTime(f.at)}</span></div>`).join("")}</div>` : ""}
      <div class="banner mt-6">${icon("info", 22)}<span>Harbour is a demo. There’s no phone line or support team — anything you send stays on this device.</span></div>
    </div>`;

  /* ---------- Vehicles ---------- */
  Screens.vehicles = () => `
    ${navBar("Vehicles", { right: `<button class="icon-btn" data-act="sheet" data-sheet="addVehicle" aria-label="Add vehicle">${icon("plus", 24, 2.2)}</button>` })}
    <div class="scroll">
      ${S.vehicles.length ? `
        <label class="search" style="margin-bottom:16px">${icon("search", 20)}<input id="veh-search" type="search" placeholder="Search plate, make or model" autocomplete="off" aria-label="Search vehicles"></label>
        <div class="list" id="veh-list">
          ${S.vehicles.map((v) => { const r = regoStatus(v); return `
            <button class="row" data-act="open" data-to="vehicle:${v.id}" data-search="${esc((v.plate + " " + v.make + " " + v.model).toLowerCase())}">
              <div class="glyph">${icon("car", 20)}</div>
              <div class="body"><div class="t"><span class="mono">${esc(v.plate)}</span> · ${esc(v.make)} ${esc(v.model)}</div><div class="s">${esc(r.text)}</div></div>
              ${pill(r.tone, r.label)}
            </button>`; }).join("")}
        </div>
        <div id="veh-empty" class="hidden">${empty("search", "No vehicles match", "Check the plate or try a make like “Mazda”.")}</div>
        <div class="card pad mt-6" style="display:flex;gap:12px;align-items:flex-start">${icon("info", 20)}<div class="small muted" style="line-height:1.45">Statuses are calculated from fictional expiry dates. Renewals are simulated and no payment is taken.</div></div>
      ` : `<div class="card">${empty("car", "No vehicles", "Add a demo vehicle to see its registration status and get renewal reminders.", `<button class="btn primary" style="width:auto" data-act="sheet" data-sheet="addVehicle">${icon("plus", 18, 2.4)} Add vehicle</button>`)}</div>`}
    </div>`;

  Screens.vehicle = ({ id }) => {
    const v = S.vehicles.find((x) => x.id === id);
    if (!v) return notFound("Vehicle");
    const r = regoStatus(v);
    const fines = S.fines.filter((f) => f.plate === v.plate);
    return `
      ${navBar(v.plate)}
      <div class="scroll">
        <div class="card pad" style="text-align:center;padding:24px 16px">
          <span class="plate" style="height:40px;font-size:20px;padding:0 16px">${esc(v.plate)}</span>
          <div style="font-weight:800;font-size:20px;margin-top:14px">${esc(v.year)} ${esc(v.make)} ${esc(v.model)}</div>
          <div class="muted small" style="margin-top:4px">${esc(v.colour)} · ${esc(v.body)}</div>
          <div style="margin-top:14px">${pill(r.tone, r.label)}</div>
        </div>
        ${sectionHead("Registration")}
        <div class="card pad">
          <div class="kv">
            <div><div class="l">Expiry date</div><div class="v">${fmtDate(v.expiry)}</div></div>
            <div><div class="l">Status</div><div class="v" style="color:var(--${r.tone})">${esc(r.text)}</div></div>
            <div><div class="l">CTP insurer</div><div class="v">${esc(v.ctp)}</div></div>
            <div><div class="l">Renewal fee</div><div class="v">${fmtMoney(v.body === "Motorcycle" ? 162 : 398)} <span class="small muted">(demo)</span></div></div>
          </div>
          <div class="progress mt-4 ${r.tone === "success" ? "" : r.tone}"><i style="width:${r.d < 0 ? 100 : Math.max(4, Math.min(100, (r.d / 365) * 100))}%"></i></div>
          <button class="btn primary mt-4" data-act="renew" data-id="${v.id}">${icon("rotate", 18, 2.2)} Renew 12 months</button>
        </div>
        ${sectionHead("Reminders")}
        <div class="list"><div class="row plain"><div class="body"><div class="t">Renewal reminders</div><div class="s">30 and 7 days before expiry</div></div>
          <button class="toggle ${S.settings.prefs.registration ? "on" : ""}" data-act="togglePref" data-key="registration" role="switch" aria-checked="${S.settings.prefs.registration}" aria-label="Renewal reminders"></button></div></div>
        ${sectionHead("Penalty notices")}
        ${fines.length ? `<div class="list">${fines.map(fineRow).join("")}</div>` : `<div class="card">${empty("checkCircle", "No notices", "There are no demo penalty notices for this vehicle.")}</div>`}
        <button class="btn danger mt-6" data-act="removeVehicle" data-id="${v.id}">${icon("trash", 18, 2.2)} Remove vehicle</button>
      </div>`;
  };

  /* ---------- Fines ---------- */
  const fineRow = (f) => { const st = fineStatus(f); return `
    <button class="row" data-act="open" data-to="fine:${f.id}">
      <div class="glyph ${st.tone}">${icon("receipt", 20)}</div>
      <div class="body"><div class="t">${esc(f.offence)}</div><div class="s">${fmtDate(f.date)} · ${esc(f.plate)}${f.points ? ` · ${plural(f.points, "pt")}` : ""}</div></div>
      <div style="text-align:right"><div class="amount">${fmtMoney(f.amount)}</div><div style="margin-top:4px">${pill(st.tone, st.label)}</div></div>
    </button>`; };

  Screens.fines = () => {
    const bal = demeritBalance(), limit = S.demerits.limit;
    const pct = Math.min(1, bal / limit), R = 46, C = 2 * Math.PI * R;
    const tone = bal >= limit - 3 ? "danger" : bal >= limit / 2 ? "warning" : "brand";
    const open = S.fines.filter(isOpenFine);
    const owing = open.reduce((a, f) => a + f.amount, 0);
    const filters = [["all", "All"], ["open", "To pay"], ["overdue", "Overdue"], ["paid", "Paid"]];
    const list = S.fines.filter((f) => UI.finesFilter === "all" ? true : UI.finesFilter === "open" ? isOpenFine(f) : UI.finesFilter === "paid" ? f.status === "paid" : fineStatus(f).label === "Overdue").sort((a, b) => b.date.localeCompare(a.date));
    return `
      ${navBar("Fines and demerits")}
      <div class="scroll">
        <div class="card meter">
          <div class="ring">
            <svg width="108" height="108" viewBox="0 0 108 108" style="transform:rotate(-90deg)"><circle cx="54" cy="54" r="${R}" fill="none" stroke="var(--surface-3)" stroke-width="10"/>
            <circle cx="54" cy="54" r="${R}" fill="none" stroke="var(--${tone})" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
            <div class="val"><b>${bal}</b><span>of ${limit}</span></div>
          </div>
          <div style="flex:1"><div class="eyebrow">Demo demerit points</div><div style="font-weight:700;font-size:16px;margin-top:6px;line-height:1.35">${limit - bal} points left before a demo suspension</div><div class="small muted" style="margin-top:6px">Counted over 3 years · fictional</div></div>
        </div>
        <div class="stat-grid">
          <div class="card stat"><div class="l">Amount owing</div><div class="v">${fmtMoney(owing)}</div></div>
          <div class="card stat"><div class="l">Open notices</div><div class="v">${open.length}</div></div>
        </div>
        ${sectionHead("Notice history")}
        <div class="chips">${filters.map(([k, l]) => `<button class="chip ${UI.finesFilter === k ? "on" : ""}" data-act="finesFilter" data-k="${k}">${l}</button>`).join("")}</div>
        ${list.length ? `<div class="list">${list.map(fineRow).join("")}</div>` : `<div class="card">${empty("checkCircle", "Nothing here", UI.finesFilter === "all" ? "You have no demo penalty notices." : "No notices match this filter.")}</div>`}
        <p class="foot-note">Simulated data. Not connected to any penalty or licensing system.</p>
      </div>`;
  };

  Screens.fine = ({ id }) => {
    const f = S.fines.find((x) => x.id === id);
    if (!f) return notFound("Notice");
    const st = fineStatus(f);
    return `
      ${navBar("Penalty notice")}
      <div class="scroll">
        <div class="card pad center" style="padding:24px 16px">${pill(st.tone, st.label)}<div class="hero-amount mt-4">${fmtMoney(f.amount)}</div>
          <div class="muted small" style="margin-top:4px">${f.status === "paid" ? `Paid · ${fmtDate(f.paidOn || f.due)}` : `Due ${fmtDate(f.due)}`}</div></div>
        ${sectionHead("Offence")}
        <div class="card pad"><div class="kv">
          <div class="full"><div class="l">Description</div><div class="v">${esc(f.offence)}</div></div>
          <div class="full"><div class="l">Location</div><div class="v">${esc(f.place)}</div></div>
          <div><div class="l">Date</div><div class="v">${fmtDate(f.date)}</div></div>
          <div><div class="l">Vehicle</div><div class="v mono">${esc(f.plate)}</div></div>
          <div><div class="l">Demerit points</div><div class="v">${f.points}</div></div>
          <div><div class="l">Notice no.</div><div class="v mono small">${esc(f.ref)}</div></div>
        </div></div>
        ${f.status !== "paid" ? `<button class="btn primary mt-6" data-act="payFine" data-id="${f.id}">${icon("dollar", 18, 2.2)} Pay ${fmtMoney(f.amount)} (simulated)</button>
          <button class="btn ghost mt-4" data-act="placeholder" data-name="Notice reviews">Request a review</button>`
          : `<div class="card pad mt-6" style="display:flex;gap:12px;align-items:center;color:var(--success)">${icon("checkCircle", 22)}<span style="font-weight:700">This demo notice has been paid.</span></div>`}
        <p class="foot-note">Fictional notice for demonstration. No real payment is processed.</p>
      </div>`;
  };

  /* ---------- Notifications ---------- */
  Screens.notifications = () => {
    const filters = [["all", "All"], ["unread", "Unread"], ["registration", "Rego"], ["expiry", "Expiry"], ["fines", "Fines"], ["announcements", "News"]];
    const list = S.notifications.filter((n) => UI.notifFilter === "all" ? true : UI.notifFilter === "unread" ? !n.read : n.type === UI.notifFilter).sort((a, b) => b.at.localeCompare(a.at));
    const typeIcon = { registration: ["car", ""], expiry: ["calendar", "info"], fines: ["receipt", "warning"], announcements: ["megaphone", "accent"] };
    return `
      ${navBar("Notifications", { right: `<button class="icon-btn" data-act="sheet" data-sheet="notifPrefs" aria-label="Notification preferences">${icon("sliders", 21)}</button>` })}
      <div class="scroll">
        <div class="chips">${filters.map(([k, l]) => `<button class="chip ${UI.notifFilter === k ? "on" : ""}" data-act="notifFilter" data-k="${k}">${l}</button>`).join("")}</div>
        ${unreadCount() ? `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="small muted">${unreadCount()} unread</span><button class="link-btn" data-act="markAllRead">Mark all as read</button></div>` : ""}
        ${list.length ? `<div class="list">${list.map((n) => { const [ic, tone] = typeIcon[n.type]; return `
          <div class="notif ${n.read ? "" : "unread"}">
            <button style="display:flex;gap:12px;flex:1;min-width:0;text-align:left" data-act="openNotif" data-id="${n.id}">
              <div class="glyph ${tone}">${icon(ic, 19)}</div>
              <div class="body"><div class="t"><span>${esc(n.title)}</span><time>${relTime(n.at)}</time></div><div class="s">${esc(n.body)}</div></div>
            </button>
            <button class="del" data-act="delNotif" data-id="${n.id}" aria-label="Delete notification">${icon("x", 16, 2.2)}</button>
          </div>`; }).join("")}</div>`
          : `<div class="card">${empty("bell", UI.notifFilter === "unread" ? "You’re all caught up" : "No notifications", UI.notifFilter === "all" ? "Reminders and announcements will appear here." : "Nothing matches this filter.")}</div>`}
      </div>`;
  };

  /* ---------- Account ---------- */
  Screens.account = () => {
    const p = S.profile, st = S.settings;
    const row = (ic, tone, t, s, right, act = "") => `<${act ? "button" : "div"} class="row" ${act}><div class="glyph ${tone}">${icon(ic, 19)}</div><div class="body"><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ""}</div>${right}</${act ? "button" : "div"}>`;
    const tog = (key, on, label) => `<button class="toggle ${on ? "on" : ""}" data-act="toggleSetting" data-key="${key}" role="switch" aria-checked="${on}" aria-label="${label}"></button>`;
    return `
      ${navBar("Profile and settings")}
      <div class="scroll">
        <div class="card pad" style="display:flex;align-items:center;gap:16px">
          <div class="avatar" style="width:64px;height:64px;font-size:24px">${esc(p.firstName[0])}${esc(p.lastName[0])}</div>
          <div style="flex:1;min-width:0"><div style="font-weight:800;font-size:18px">${esc(p.firstName)} ${esc(p.lastName)}</div><div class="small muted" style="margin-top:2px;overflow:hidden;text-overflow:ellipsis">${esc(p.email)}</div></div>
          <button class="icon-btn filled" data-act="sheet" data-sheet="editProfile" aria-label="Edit profile">${icon("pencil", 18)}</button>
        </div>
        ${sectionHead("Personal details", `<button data-act="sheet" data-sheet="editProfile">Edit</button>`)}
        <div class="card pad"><div class="kv">
          <div><div class="l">Phone</div><div class="v">${esc(p.phone)}</div></div>
          <div><div class="l">Date of birth</div><div class="v">${fmtDate(p.dob)}</div></div>
          <div class="full"><div class="l">Address</div><div class="v">${esc(p.address)}</div></div>
        </div></div>
        ${sectionHead("Appearance")}
        <div class="card pad"><div class="segmented" role="radiogroup" aria-label="Theme">
          ${[["system", "Match phone"], ["light", "Light"], ["dark", "Dark"]].map(([k, l]) => `<button class="${st.theme === k ? "on" : ""}" data-act="theme" data-k="${k}" role="radio" aria-checked="${st.theme === k}">${l}</button>`).join("")}
        </div><div class="small muted" style="margin-top:10px">“Match phone” follows your device’s light or dark setting automatically.</div></div>
        ${sectionHead("Security")}
        <div class="list">
          ${row("lock", "", "Require PIN to open", "Asks for your PIN each time Harbour opens", tog("appLock", st.appLock, "Require PIN to open"))}
          ${row("key", "", "Change PIN", st.pin === "1234" ? "You’re using the demo PIN" : "Custom PIN set", chev, `data-act="sheet" data-sheet="changePin"`)}
          ${row("fingerprint", "", "Use Face ID", st.appLock ? "Simulated in prototype" : "Turn on the PIN first", tog("biometrics", st.biometrics && st.appLock, "Use Face ID"))}
          ${st.appLock ? row("shield", "", "Lock now", "", chev, `data-act="lockNow"`) : ""}
        </div>
        ${sectionHead("Privacy")}
        <div class="list">
          ${row("eye", "info", "Share usage analytics", "Anonymous, off by default", tog("analytics", st.analytics, "Share usage analytics"))}
          ${row("sliders", "info", "Personalised suggestions", "Based on your services", tog("personalised", st.personalised, "Personalised suggestions"))}
          ${row("bell", "accent", "Notification preferences", "", chev, `data-act="sheet" data-sheet="notifPrefs"`)}
        </div>
        ${sectionHead("Demo")}
        <div class="list">
          ${row("refresh", "danger", "Reset demo data", "Restore the original fictional data", chev, `data-act="resetData"`)}
          ${row("help", "", "About this prototype", "Harbour v0.2 · fictional data only", chev, `data-act="sheet" data-sheet="about"`)}
        </div>
        <button class="btn secondary mt-6" data-act="placeholder" data-name="Sign-in (arrives with the backend in Phase 8)">${icon("logout", 18, 2.2)} Sign out</button>
      </div>`;
  };

  const notFound = (what) => `${navBar(what)}<div class="scroll">${empty("alert", `${what} not found`, "It may have been removed.", `<button class="btn secondary" style="width:auto" data-act="back">Go back</button>`)}</div>`;

  /* ---------- PIN lock ---------- */
  const lockScreen = () => `
    <div class="lock ${UI.pinError ? "shake" : ""}">
      <div class="safe-top"></div>
      <div class="lock-brand">${logo(52)}<span>Harbour</span></div>
      <h2>Enter your PIN</h2>
      <div class="pin-dots" aria-label="${UI.pin.length} of 4 digits entered">${[0, 1, 2, 3].map((i) => `<i class="${i < UI.pin.length ? "on" : ""} ${i === UI.pin.length ? "next" : ""}"></i>`).join("")}</div>
      <div class="pin-msg" role="alert">${UI.pinError ? esc(UI.pinError) : S.settings.pin === "1234" ? "Demo PIN is 1 2 3 4" : "&nbsp;"}</div>
      <button class="link-btn" data-act="forgotPin">Forgot your PIN?</button>
      <div class="keypad">
        ${[["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"]].map(([n, l]) => `<button class="key" data-act="pinKey" data-k="${n}"><b>${n}</b><small>${l}</small></button>`).join("")}
        <span></span><button class="key" data-act="pinKey" data-k="0"><b>0</b></button>
        <button class="key bare" data-act="pinDel" aria-label="Delete">${icon("backspace", 26, 1.8)}</button>
      </div>
    </div>`;

  /* ============================ Sheets ============================ */
  const Sheets = {};
  const fieldHtml = (name, label, value, { type = "text", hint = "", placeholder = "", opts = null, attrs = "", textarea = false } = {}) => {
    const err = UI.errors[name];
    const input = opts
      ? `<select id="f-${name}" name="${name}">${opts.map((o) => `<option ${String(o) === String(value) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
      : textarea ? `<textarea id="f-${name}" name="${name}" placeholder="${esc(placeholder)}" ${attrs}>${esc(value)}</textarea>`
      : `<input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${attrs}>`;
    return `<div class="field ${err ? "invalid" : ""}"><label for="f-${name}">${esc(label)}</label>${input}${err ? `<div class="err">${icon("alert", 13, 2.4)} ${esc(err)}</div>` : hint ? `<div class="hint">${esc(hint)}</div>` : ""}</div>`;
  };

  Sheets.addVehicle = (d = {}) => ({ title: "Add a demo vehicle", body: `<form id="sheet-form" data-form="addVehicle" novalidate>
      ${fieldHtml("plate", "Number plate", d.plate || "", { placeholder: "e.g. ABC 12D", hint: "2–7 letters or numbers", attrs: 'autocapitalize="characters" maxlength="8"' })}
      <div class="field-row">${fieldHtml("make", "Make", d.make || "", { placeholder: "Toyota" })}${fieldHtml("model", "Model", d.model || "", { placeholder: "Corolla" })}</div>
      <div class="field-row">${fieldHtml("year", "Year", d.year || "", { type: "number", placeholder: "2020", attrs: 'inputmode="numeric"' })}${fieldHtml("body", "Body type", d.body || "Sedan", { opts: ["Sedan", "Hatchback", "SUV", "Ute", "Wagon", "Van", "Motorcycle"] })}</div>
      ${fieldHtml("colour", "Colour", d.colour || "", { placeholder: "White" })}
      ${fieldHtml("expiry", "Registration expiry", d.expiry || "", { type: "date" })}
      <button class="btn primary mt-4" type="submit">Add vehicle</button></form>` });

  Sheets.editProfile = (draft) => { const p = draft || S.profile; return { title: "Edit details", body: `<form id="sheet-form" data-form="editProfile" novalidate>
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:20px"><div class="avatar xl">${esc((p.firstName || "?")[0] || "?")}${esc((p.lastName || "")[0] || "")}</div>
        <button type="button" class="link-btn" data-act="placeholder" data-name="Photo upload">Change photo</button></div>
      <div class="field-row">${fieldHtml("firstName", "First name", p.firstName)}${fieldHtml("lastName", "Last name", p.lastName)}</div>
      ${fieldHtml("email", "Email", p.email, { type: "email", attrs: 'autocomplete="off"' })}
      ${fieldHtml("phone", "Mobile", p.phone, { type: "tel", hint: "Australian mobile, e.g. 0400 000 000" })}
      ${fieldHtml("address", "Residential address", p.address)}
      ${fieldHtml("dob", "Date of birth", p.dob, { type: "date" })}
      <div class="disclaimer" style="margin-bottom:16px">${icon("info", 18)}<span>Use made-up details only. This prototype is not for real personal information.</span></div>
      <button class="btn primary" type="submit">Save changes</button></form>` }; };

  Sheets.notifPrefs = () => { const pr = S.settings.prefs; const item = (k, t, s) => `<div class="row plain"><div class="body"><div class="t">${t}</div><div class="s">${s}</div></div><button class="toggle ${pr[k] ? "on" : ""}" data-act="togglePref" data-key="${k}" role="switch" aria-checked="${pr[k]}" aria-label="${t}"></button></div>`;
    return { title: "Notification preferences", body: `<div class="list">${item("registration", "Registration reminders", "Before your rego expires")}${item("expiry", "Credential expiry", "Licences and cards nearing expiry")}${item("fines", "Penalty notices", "New and overdue notices")}${item("announcements", "Announcements", "New features and news")}</div><p class="foot-note">In the app these will schedule local notifications with expo-notifications.</p>` }; };

  const swatch = (c) => `<div class="mini-swatch" style="background:linear-gradient(135deg,${credPalette[c.style][0]},${credPalette[c.style][1]})"></div>`;
  Sheets.manageFavs = () => { const cs = walletCreds(); return { title: "Favourites", body: cs.length ? `<p class="muted small" style="margin-top:0">Starred cards appear at the top of Home.</p><div class="list">${cs.map((c) => `
      <div class="row plain">${swatch(c)}<div class="body"><div class="t">${esc(c.title)}</div><div class="s">${esc(c.kind)}</div></div>
      <button class="icon-btn star ${c.fav ? "on" : ""}" data-act="fav" data-id="${c.id}" aria-pressed="${c.fav}" aria-label="${c.fav ? "Unstar" : "Star"} ${esc(c.title)}">${starIcon(c.fav, 24)}</button></div>`).join("")}</div>`
      : empty("wallet", "No cards yet", "Add a demo card to your wallet first.") }; };

  Sheets.addCred = () => { const cs = S.credentials.filter((c) => !c.inWallet); return { title: "Add a demo card", body: cs.length ? `<div class="list">${cs.map((c) => `
      <div class="row plain">${swatch(c)}<div class="body"><div class="t">${esc(c.title)}</div><div class="s">${esc(c.kind)}</div></div>
      <button class="btn primary sm" data-act="addCred" data-id="${c.id}">Add</button></div>`).join("")}</div><p class="foot-note">Every card is a fictional demonstration and is clearly marked as such.</p>`
      : empty("checkCircle", "You’ve added every demo card", "Remove a card from its details page to add it again here.") }; };

  Sheets.walletMenu = () => ({ title: "Wallet", body: `<div class="list">
      <button class="row" data-act="sheet" data-sheet="manageFavs"><div class="glyph accent">${icon("star", 19)}</div><div class="body"><div class="t">Manage favourites</div></div>${chev}</button>
      <button class="row" data-act="sheet" data-sheet="addCred"><div class="glyph">${icon("plus", 19)}</div><div class="body"><div class="t">Add a demo card</div></div>${chev}</button>
      <button class="row" data-act="sheet" data-sheet="about"><div class="glyph info">${icon("info", 19)}</div><div class="body"><div class="t">About demo cards</div></div>${chev}</button></div>` });

  Sheets.feedback = (d = {}) => ({ title: "Share feedback", body: `<form id="sheet-form" data-form="feedback" novalidate>
      ${fieldHtml("rating", "Overall, how is Harbour?", d.rating || "Choose one", { opts: ["Choose one", "Great", "Good", "Okay", "Not great"] })}
      ${fieldHtml("text", "Your feedback", d.text || "", { textarea: true, placeholder: "What should we keep, change or add?", hint: "10–500 characters", attrs: 'maxlength="500"' })}
      <button class="btn primary mt-4" type="submit">Send feedback</button></form>` });

  Sheets.issue = (d = {}) => ({ title: "Report a problem", body: `<form id="sheet-form" data-form="issue" novalidate>
      ${fieldHtml("area", "Where did it happen?", d.area || "Choose one", { opts: ["Choose one", "Home", "Services", "Wallet", "Vehicles", "Fines", "Notifications", "Profile", "Something else"] })}
      ${fieldHtml("text", "What went wrong?", d.text || "", { textarea: true, placeholder: "Tell us what you were doing and what happened", hint: "10–500 characters", attrs: 'maxlength="500"' })}
      <button class="btn primary mt-4" type="submit">Send report</button></form>` });

  Sheets.changePin = (d = {}) => ({ title: "Change PIN", body: `<form id="sheet-form" data-form="changePin" novalidate>
      ${fieldHtml("current", "Current PIN", d.current || "", { type: "password", attrs: 'inputmode="numeric" maxlength="4" autocomplete="off"', hint: S.settings.pin === "1234" ? "The demo PIN is 1234" : "" })}
      ${fieldHtml("next", "New PIN", d.next || "", { type: "password", attrs: 'inputmode="numeric" maxlength="4" autocomplete="off"', hint: "4 digits" })}
      ${fieldHtml("confirm", "Confirm new PIN", d.confirm || "", { type: "password", attrs: 'inputmode="numeric" maxlength="4" autocomplete="off"' })}
      <div class="disclaimer" style="margin-bottom:16px">${icon("info", 18)}<span>Don’t reuse a PIN you use anywhere else. This one is stored on this device for the demo.</span></div>
      <button class="btn primary" type="submit">Save PIN</button></form>` });

  Sheets.about = () => ({ title: "About Harbour", body: `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:8px 0 16px">${logo(64)}<div style="font-weight:800;font-size:20px">Harbour</div><div class="muted small">Design prototype · v0.2</div></div>
      <div class="card pad small" style="line-height:1.55"><p style="margin-top:0">Harbour is a personal software engineering project exploring how a digital services app could work.</p>
      <p>It is <b>not</b> affiliated with any government. Every name, number, vehicle, notice, service and credential is fictional, and nothing here can be used as identification.</p>
      <p style="margin-bottom:0">This browser prototype previews the design before it is built in React Native with Expo.</p></div>` });

  /* ======================== Validation ======================== */
  const validators = {
    addVehicle(v) {
      const e = {}; const plate = v.plate.trim().toUpperCase().replace(/\s+/g, " "); const bare = plate.replace(/ /g, "");
      if (!plate) e.plate = "Enter a number plate";
      else if (!/^[A-Z0-9 ]+$/.test(plate) || bare.length < 2 || bare.length > 7) e.plate = "Use 2–7 letters or numbers";
      else if (S.vehicles.some((x) => x.plate.replace(/ /g, "") === bare)) e.plate = "This plate is already in your vehicles";
      if (!v.make.trim()) e.make = "Required";
      if (!v.model.trim()) e.model = "Required";
      const y = Number(v.year), max = new Date().getFullYear() + 1;
      if (!v.year) e.year = "Required"; else if (!Number.isInteger(y) || y < 1950 || y > max) e.year = `1950–${max}`;
      if (!v.colour.trim()) e.colour = "Required";
      if (!v.expiry) e.expiry = "Choose an expiry date"; else if (daysUntil(v.expiry) > 730) e.expiry = "Must be within 2 years";
      return { e, clean: { ...v, plate, year: y, make: v.make.trim(), model: v.model.trim(), colour: v.colour.trim() } };
    },
    editProfile(v) {
      const e = {};
      if (!v.firstName.trim()) e.firstName = "Required";
      if (!v.lastName.trim()) e.lastName = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address";
      const ph = v.phone.replace(/\s/g, "");
      if (!/^04\d{8}$/.test(ph)) e.phone = "Enter a 10-digit mobile starting with 04";
      if (v.address.trim().length < 8) e.address = "Enter a full address";
      if (!v.dob) e.dob = "Required"; else { const age = (today() - new Date(v.dob)) / (365.25 * DAY); if (age < 16) e.dob = "You must be 16 or older"; else if (age > 120) e.dob = "Check the year"; }
      return { e, clean: { ...v, firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim(), address: v.address.trim(), phone: ph.length === 10 ? `${ph.slice(0, 4)} ${ph.slice(4, 7)} ${ph.slice(7)}` : v.phone } };
    },
    feedback(v) { const e = {}; if (v.rating === "Choose one") e.rating = "Choose a rating"; const t = v.text.trim(); if (t.length < 10) e.text = "Add a little more detail (10+ characters)"; return { e, clean: { kind: "Feedback", rating: v.rating, text: t } }; },
    issue(v) { const e = {}; if (v.area === "Choose one") e.area = "Choose where it happened"; const t = v.text.trim(); if (t.length < 10) e.text = "Describe the problem (10+ characters)"; return { e, clean: { kind: `Problem · ${v.area}`, text: t } }; },
    changePin(v) {
      const e = {};
      if (v.current !== S.settings.pin) e.current = "That isn’t your current PIN";
      if (!/^\d{4}$/.test(v.next)) e.next = "Use exactly 4 digits";
      else if (v.next === v.current) e.next = "Choose a different PIN";
      else if (/^(\d)\1{3}$/.test(v.next) || "0123456789".includes(v.next) || "9876543210".includes(v.next)) e.next = "Too easy to guess — avoid repeats and sequences";
      if (!e.next && v.confirm !== v.next) e.confirm = "PINs don’t match";
      return { e, clean: v };
    },
  };

  /* ========================== Rendering ========================== */
  const root = document.getElementById("app");
  const scrollMemo = {};
  const currentRoute = () => { const st = UI.stacks[UI.tab]; return st.length ? st[st.length - 1] : { screen: UI.tab, params: {} }; };

  function applyTheme() {
    const t = S.settings.theme;
    if (t === "system") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t);
  }

  const dialogHtml = () => UI.dialog ? `<div class="dialog-wrap"><div class="scrim" data-act="dialogNo"></div><div class="dialog" role="alertdialog" aria-modal="true"><div class="glyph ${UI.dialog.tone || ""}">${icon(UI.dialog.icon || "info", 24)}</div><h3>${esc(UI.dialog.title)}</h3><p>${esc(UI.dialog.body)}</p><div class="btn-row"><button class="btn secondary" data-act="dialogNo">Cancel</button><button class="btn ${UI.dialog.tone === "danger" ? "danger" : "primary"}" data-act="dialogYes">${esc(UI.dialog.yes)}</button></div></div></div>` : "";

  function render() {
    applyTheme();
    if (UI.locked) { root.innerHTML = lockScreen() + dialogHtml(); root.dataset.key = "lock"; return; }
    const route = currentRoute();
    const key = UI.tab + ":" + UI.stacks[UI.tab].length + ":" + route.screen + ":" + (route.params?.id || "");
    const oldScroll = root.querySelector(".screen .scroll");
    if (oldScroll && root.dataset.key) scrollMemo[root.dataset.key] = oldScroll.scrollTop;
    const favStrip = document.getElementById("fav-strip"); const favLeft = favStrip ? favStrip.scrollLeft : 0;

    const tabs = [["home", "home", "Home"], ["services", "store", "Services"], ["wallet", "wallet", "Wallet"]];
    const sheet = UI.sheet ? Sheets[UI.sheet.name](UI.sheet.draft) : null;

    root.innerHTML = `
      <section class="screen anim-${UI.anim}" aria-label="${esc(route.screen)}">${Screens[route.screen](route.params || {})}</section>
      <nav class="tabbar" aria-label="Main">
        ${tabs.map(([k, ic, l]) => `<button class="tab ${UI.tab === k ? "on" : ""}" data-act="tab" data-tab="${k}" aria-current="${UI.tab === k ? "page" : "false"}"><span class="ind"></span>${icon(ic, 25, UI.tab === k ? 2.2 : 1.8)}${l}</button>`).join("")}
      </nav>
      ${sheet ? `<div class="overlay ${UI.sheet.fresh ? "enter" : ""}" id="overlay"><div class="scrim" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(sheet.title)}"><div class="grab"></div><div class="sheet-head"><h3>${esc(sheet.title)}</h3><button class="icon-btn" data-act="closeSheet" aria-label="Close">${icon("x", 20, 2.2)}</button></div><div class="sheet-body">${sheet.body}</div></div></div>` : ""}
      ${dialogHtml()}`;
    root.dataset.key = key;
    if (UI.sheet) UI.sheet.fresh = false; // only animate a sheet on its first render
    const newScroll = root.querySelector(".screen .scroll");
    if (newScroll && UI.anim === "none" && scrollMemo[key] != null) newScroll.scrollTop = scrollMemo[key];
    const fs = document.getElementById("fav-strip"); if (fs && UI.anim === "none") fs.scrollLeft = favLeft;
    UI.anim = "none";
    bindDynamic();
  }

  // Live search filters the DOM in place so the input keeps focus while typing.
  function bindDynamic() {
    [["cat-search", "#cat-list [data-search]", "cat-empty", "cat-list"], ["veh-search", "#veh-list [data-search]", "veh-empty", "veh-list"]].forEach(([inputId, sel, emptyId, listId]) => {
      const input = document.getElementById(inputId); if (!input) return;
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase(); let shown = 0;
        root.querySelectorAll(sel).forEach((el) => { const hit = !q || q.split(/\s+/).every((w) => el.dataset.search.includes(w)); el.classList.toggle("hidden", !hit); if (hit) shown++; });
        document.getElementById(emptyId).classList.toggle("hidden", shown > 0);
        document.getElementById(listId).classList.toggle("hidden", shown === 0);
      });
    });
    const strip = document.getElementById("fav-strip"), dots = document.getElementById("fav-dots");
    if (strip && dots) {
      const sync = () => { const left = strip.getBoundingClientRect().left + 20; let best = 0, bestD = Infinity;
        [...strip.children].forEach((it, i) => { const d = Math.abs(it.getBoundingClientRect().left - left); if (d < bestD) { bestD = d; best = i; } });
        [...dots.children].forEach((d, i) => d.classList.toggle("on", i === best)); };
      strip.addEventListener("scroll", sync, { passive: true }); sync();
    }
  }

  /* ========================== Navigation ========================== */
  const ROOTS = ["home", "services", "wallet"];
  const nav = {
    tab(t) {
      if (UI.tab === t) { if (UI.stacks[t].length) { UI.stacks[t] = []; UI.anim = "pop"; } else { const sc = root.querySelector(".scroll"); if (sc) sc.scrollTo({ top: 0, behavior: "smooth" }); return; } }
      else { UI.tab = t; UI.anim = "fade"; }
      UI.reorder = false; render();
    },
    push(screen, params = {}) { UI.stacks[UI.tab].push({ screen, params }); UI.anim = "push"; render(); },
    back() { if (UI.stacks[UI.tab].length) { UI.stacks[UI.tab].pop(); UI.anim = "pop"; render(); } },
  };
  // One router for every link in the app: "screen", "screen:id", "tab:x", "sheet:x", "addVehicle".
  function open(to) {
    if (!to) return;
    const [kind, arg] = to.split(":");
    if (kind === "tab") return nav.tab(arg);
    if (kind === "sheet") return openSheet(arg);
    if (kind === "addVehicle") return openSheet("addVehicle");
    if (kind === "cred") { UI.tab = "wallet"; UI.stacks.wallet = [{ screen: "cred", params: { id: arg } }]; UI.anim = "push"; return render(); } // cards always open in Wallet
    if (ROOTS.includes(kind)) return nav.tab(kind);
    nav.push(kind, arg ? { id: arg } : {});
  }

  function openSheet(name, draft) {
    UI.sheet = { name, draft, fresh: true }; UI.errors = {}; render();
    const f = root.querySelector(".sheet input, .sheet select, .sheet textarea");
    if (f && ["addVehicle", "changePin"].includes(name)) setTimeout(() => f.focus({ preventScroll: true }), 350);
  }
  function closeSheet() {
    const ov = document.getElementById("overlay");
    if (!ov) { UI.sheet = null; return render(); }
    ov.classList.add("closing"); ov.querySelector(".sheet").classList.add("closing");
    setTimeout(() => { UI.sheet = null; UI.errors = {}; render(); }, 220);
  }
  function confirmDialog(opts) { UI.dialog = opts; render(); }

  let toastTimer;
  function toast(msg, ic = "checkCircle") {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status");
    el.innerHTML = `${icon(ic, 20)}<span>${esc(msg)}</span>`; root.appendChild(el);
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 2400);
  }

  /* ============================ Actions ============================ */
  let refreshCount = 0;
  const actions = {
    tab: (d) => nav.tab(d.tab),
    open: (d) => { UI.sheet = null; open(d.to); },
    back: () => nav.back(),
    sheet: (d) => openSheet(d.sheet),
    closeSheet: () => closeSheet(),
    placeholder: (d) => toast(`${d.name} isn’t part of this demo`, "info"),

    reorder: () => { UI.reorder = !UI.reorder; render(); if (!UI.reorder) toast("Services order saved"); },
    move: (d) => { const o = S.settings.homeOrder, i = o.indexOf(d.k), j = i + Number(d.dir); if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; save(); render(); },
    vote: (d) => { UI.svcVote = d.v; S.feedback.push({ id: uid("fb"), kind: "Finding services", rating: d.v === "good" ? "Easy" : "Not really", text: "Quick rating from the Services tab", at: new Date().toISOString() }); save(); render(); },

    walletFilter: (d) => { UI.walletFilter = d.k; render(); },
    fav: (d) => { const c = S.credentials.find((x) => x.id === d.id); c.fav = !c.fav; save(); render(); toast(c.fav ? `${c.title} added to favourites` : `${c.title} removed from favourites`, "star"); },
    addCred: (d) => { const c = S.credentials.find((x) => x.id === d.id); c.inWallet = true; save(); render(); toast(`${c.title} added to your wallet`); },
    removeCred: (d) => { const c = S.credentials.find((x) => x.id === d.id);
      confirmDialog({ title: `Remove ${c.title}?`, body: "It will disappear from your wallet and favourites. You can add it back any time.", yes: "Remove", tone: "danger", icon: "trash",
        onYes: () => { c.inWallet = false; c.fav = false; save(); UI.stacks[UI.tab].pop(); UI.anim = "pop"; toast(`${c.title} removed`); } }); },
    refreshCred: (d) => {
      UI.walletRefresh[d.id] = "loading"; render();
      refreshCount++; const fail = refreshCount % 3 === 0; // every third refresh fails, to show the error state
      setTimeout(() => { UI.walletRefresh[d.id] = fail ? "error" : Date.now(); render(); if (!fail) toast("Demo credential refreshed"); }, 900);
    },

    renew: (d) => { const v = S.vehicles.find((x) => x.id === d.id);
      confirmDialog({ title: `Renew ${v.plate}?`, body: `This simulates a 12-month renewal. No payment is taken. New expiry: ${fmtDate(addYear(v.expiry))}.`, yes: "Renew", icon: "rotate",
        onYes: () => { v.expiry = addYear(v.expiry); S.notifications.unshift({ id: uid("n"), type: "registration", title: "Registration renewed", body: `${v.plate} is now registered until ${fmtDate(v.expiry)} (simulated).`, at: new Date().toISOString(), read: false, link: { screen: "vehicle", id: v.id } }); save(); toast(`${v.plate} renewed until ${fmtDate(v.expiry)}`); } }); },
    removeVehicle: (d) => { const v = S.vehicles.find((x) => x.id === d.id);
      confirmDialog({ title: `Remove ${v.plate}?`, body: "This removes the demo vehicle and its reminders from this device.", yes: "Remove", tone: "danger", icon: "trash",
        onYes: () => { S.vehicles = S.vehicles.filter((x) => x.id !== v.id); save(); UI.stacks[UI.tab].pop(); UI.anim = "pop"; toast(`${v.plate} removed`); } }); },
    payFine: (d) => { const f = S.fines.find((x) => x.id === d.id);
      confirmDialog({ title: `Pay ${fmtMoney(f.amount)}?`, body: `Simulated payment for ${f.ref}. No money will be charged.`, yes: "Pay (demo)", icon: "dollar",
        onYes: () => { f.status = "paid"; f.paidOn = toLocalIso(new Date()); save(); toast("Payment recorded (simulated)"); } }); },
    finesFilter: (d) => { UI.finesFilter = d.k; render(); },
    notifFilter: (d) => { UI.notifFilter = d.k; render(); },
    markAllRead: () => { S.notifications.forEach((n) => (n.read = true)); save(); render(); toast("All notifications marked as read"); },
    openNotif: (d) => { const n = S.notifications.find((x) => x.id === d.id); n.read = true; save();
      if (n.link) open(`${n.link.screen}:${n.link.id}`); else { render(); toast(n.title, "megaphone"); } },
    delNotif: (d) => { S.notifications = S.notifications.filter((x) => x.id !== d.id); save(); render(); toast("Notification deleted", "trash"); },
    togglePref: (d) => { S.settings.prefs[d.key] = !S.settings.prefs[d.key]; save(); render(); },
    toggleSetting: (d) => {
      if (d.key === "biometrics" && !S.settings.appLock) { toast("Turn on the PIN first", "info"); return; }
      S.settings[d.key] = !S.settings[d.key];
      if (d.key === "appLock" && !S.settings.appLock) S.settings.biometrics = false;
      save(); render();
    },
    theme: (d) => { S.settings.theme = d.k; save(); render(); },
    lockNow: () => { UI.locked = true; UI.pin = ""; UI.pinError = ""; render(); },
    resetData: () => confirmDialog({ title: "Reset demo data?", body: "All your changes in this prototype will be replaced with the original fictional data.", yes: "Reset", tone: "danger", icon: "refresh",
      onYes: () => { S = window.HARBOUR_SEED(); save(); UI.stacks = freshStacks(); UI.tab = "home"; UI.walletRefresh = {}; UI.svcVote = null; UI.walletFilter = "all"; toast("Demo data reset"); } }),

    pinKey: (d) => {
      if (UI.pin.length >= 4) return;
      UI.pin += d.k; UI.pinError = "";
      render();
      if (UI.pin.length < 4) return;
      setTimeout(() => {
        if (UI.pin === S.settings.pin) { UI.locked = false; UI.pin = ""; UI.anim = "fade"; render(); }
        else { UI.pin = ""; UI.pinError = "That PIN didn’t match. Try again."; render(); setTimeout(() => { const l = root.querySelector(".lock"); if (l) l.classList.remove("shake"); }, 450); }
      }, 160);
    },
    pinDel: () => { UI.pin = UI.pin.slice(0, -1); UI.pinError = ""; render(); },
    forgotPin: () => confirmDialog({ title: "Reset your PIN?", body: "In this demo, resetting sets your PIN back to 1234. A real app would verify your identity first.", yes: "Reset PIN", icon: "key",
      onYes: () => { S.settings.pin = "1234"; save(); UI.pin = ""; UI.pinError = ""; toast("PIN reset to 1234", "key"); } }),

    dialogYes: () => { const fn = UI.dialog.onYes; UI.dialog = null; fn(); render(); },
    dialogNo: () => { UI.dialog = null; render(); },
  };

  root.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || !root.contains(el) || el.disabled) return;
    e.preventDefault();
    const fn = actions[el.dataset.act]; if (fn) fn(el.dataset);
  });

  root.addEventListener("submit", (e) => {
    const form = e.target.closest("form[data-form]"); if (!form) return;
    e.preventDefault();
    const name = form.dataset.form;
    const values = Object.fromEntries(new FormData(form).entries());
    const { e: errs, clean } = validators[name](values);
    UI.errors = errs;
    if (Object.keys(errs).length) {
      UI.sheet.draft = values; render();
      const first = root.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea"); if (first) first.focus({ preventScroll: true });
      return;
    }
    UI.errors = {};
    if (name === "addVehicle") {
      const v = { id: uid("v"), ...clean, ctp: "Demo Insurer A" };
      S.vehicles.push(v); save(); UI.sheet = null;
      UI.stacks[UI.tab] = UI.tab === "home" ? [{ screen: "vehicles", params: {} }, { screen: "vehicle", params: { id: v.id } }] : [...UI.stacks[UI.tab], { screen: "vehicle", params: { id: v.id } }];
      UI.anim = "push"; render(); toast(`${v.plate} added`);
    } else if (name === "editProfile") {
      S.profile = clean; save(); UI.sheet = null; render(); toast("Details saved");
    } else if (name === "feedback" || name === "issue") {
      S.feedback.push({ id: uid("fb"), ...clean, at: new Date().toISOString() }); save(); UI.sheet = null; render(); toast("Thanks — saved on this device (demo)");
    } else if (name === "changePin") {
      S.settings.pin = clean.next; save(); UI.sheet = null; render(); toast("PIN updated", "key");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (UI.locked && !UI.dialog) { if (/^\d$/.test(e.key)) actions.pinKey({ k: e.key }); else if (e.key === "Backspace") actions.pinDel(); return; }
    if (e.key !== "Escape") return;
    if (UI.dialog) actions.dialogNo(); else if (UI.sheet) closeSheet(); else nav.back();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (S.settings.theme === "system") render(); });

  // Keep the frame pinned: browsers scroll overflow:hidden ancestors to reveal focused inputs.
  [root, document.getElementById("phone")].forEach((el) => el.addEventListener("scroll", () => { el.scrollTop = 0; }));

  // Simulated first load so the skeleton state is visible.
  render();
  setTimeout(() => { UI.loading = false; if (!UI.locked) UI.anim = "fade"; render(); }, 700);

  // Test hook for automated checks (not used by the UI).
  window.__harbour = { get state() { return S; }, get ui() { return UI; } };
})();
