(function () {
  "use strict";

  const LOCALE_KEY = "resume-locale";
  const BASE_SITE_URL = "https://bhornumnard.github.io";

  const ROLES = {
    "backend": {
      id: "backend",
      file: "resume.json",
      hash: "backend",
      label_en: "Backend",
      label_th: "Backend",
    },
    "data-engineering": {
      id: "data-engineering",
      file: "resume-ds.json",
      hash: "data-engineering",
      label_en: "Data Eng",
      label_th: "Data Eng",
    },
    "ai": {
      id: "ai",
      file: "resume-ai.json",
      hash: "ai",
      label_en: "AI",
      label_th: "AI",
    },
  };

  let data = null;
  let currentRole = "backend";
  let locale = localStorage.getItem(LOCALE_KEY) || "en";
  let eventsBound = false;

  const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const MONTHS_TH = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  function t(obj, key) {
    if (!obj) return "";
    return obj[key + "_" + locale] ?? obj[key + "_en"] ?? "";
  }

  function label(key) {
    return data.labels[key + "_" + locale] ?? data.labels[key + "_en"] ?? key;
  }

  function formatDate(iso, isEnd) {
    if (!iso) {
      return isEnd ? label("present") : "";
    }
    const [year, month] = iso.split("-").map(Number);
    const months = locale === "th" ? MONTHS_TH : MONTHS_EN;
    if (locale === "th") {
      return `${months[month - 1]} ${year + 543}`;
    }
    return `${months[month - 1]} ${year}`;
  }

  function formatRange(start, end) {
    return `${formatDate(start, false)} — ${formatDate(end, true)}`;
  }

  function parseRoleFromHash() {
    const raw = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    if (!raw || raw === "backend") return "backend";
    if (raw === "data-engineering" || raw === "data" || raw === "de") return "data-engineering";
    // AI track hidden until ready — treat #ai as backend for public visitors
    if (raw === "ai" || raw === "ai-backend") return "backend";
    return "backend";
  }

  function roleShareUrl(roleId) {
    const role = ROLES[roleId] || ROLES.backend;
    return `${BASE_SITE_URL}#${role.hash}`;
  }

  function syncRoleButtons() {
    document.querySelectorAll(".role-btn").forEach((btn) => {
      const active = btn.dataset.role === currentRole;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function setLocale(next) {
    locale = next;
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale === "th" ? "th" : "en";
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === locale;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    render();
  }

  function renderLabels() {
    document.getElementById("label-contacts").textContent = label("contacts");
    document.getElementById("label-languages").textContent = label("languages");
    document.getElementById("label-skills").textContent = label("skills");
    document.getElementById("label-profile").textContent = label("profile");
    document.getElementById("label-employment").textContent = label("employment");
    document.getElementById("label-education").textContent = label("education");
    document.getElementById("btn-download").textContent = label("downloadPdf");
    document.getElementById("btn-copy").textContent = label("copyLink");
  }

  function renderProfile() {
    const p = data.profile;
    document.getElementById("header-logo").textContent = p.fullName;
    document.getElementById("hero-name").textContent = p.fullName;
    document.getElementById("hero-title").textContent = t(p, "title");
    const phoneEl = document.getElementById("hero-phone");
    phoneEl.textContent = p.phoneDisplay || p.phone;
    phoneEl.href = p.phoneHref;
    document.getElementById("hero-location").textContent = [t(p, "location"), t(p, "availability")]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("profile-text").textContent = t(data.summary, "summary");

    const roleName = ROLES[currentRole]?.label_en || "Backend";
    document.title = `${p.fullName} — ${roleName} Resume`;
  }

  function renderContacts() {
    const p = data.profile;
    const items = [
      { type: "text", labelKey: "contactPhone", value: p.phone },
      { type: "link", labelKey: "contactEmail", href: `mailto:${p.email}`, label: p.email },
      { type: "link", labelKey: "contactLinkedin", href: p.linkedinUrl, label: p.linkedinLabel },
      { type: "link", labelKey: "contactGithub", href: p.githubUrl, label: p.githubLabel },
      { type: "link", labelKey: "contactPortfolio", href: p.portfolioUrl, label: p.portfolioLabel },
    ].filter((item) => {
      if (item.type === "link") return item.href && item.label;
      return item.value;
    });
    const ul = document.getElementById("contact-list");
    ul.innerHTML = items
      .map((item) => {
        const rowLabel = label(item.labelKey);
        if (item.type === "link") {
          return `<li class="contact-row"><span class="contact-label">${rowLabel}</span><span class="contact-value"><a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.label}</a><span class="contact-chevron" aria-hidden="true">›</span></span></li>`;
        }
        return `<li class="contact-row"><span class="contact-label">${rowLabel}</span><span class="contact-value">${item.value}</span></li>`;
      })
      .join("");
  }

  function renderLanguages() {
    const ul = document.getElementById("language-list");
    ul.innerHTML = data.languages
      .map(
        (lang) =>
          `<li class="settings-row"><span class="settings-label">${t(lang, "name")}</span><span class="settings-value">${t(lang, "level")}</span></li>`
      )
      .join("");
  }

  function renderSkills() {
    const container = document.getElementById("skills-container");
    container.innerHTML = data.skills
      .map((cat) => {
        let pills = [];
        if (cat.rows) {
          cat.rows.forEach((row) => {
            row[0].split(",").forEach((item) => {
              const trimmed = item.trim();
              if (trimmed) pills.push(trimmed);
            });
          });
        } else if (cat.items) {
          pills = cat.items;
        }
        const pillHtml = pills
          .map((item) => `<span class="skill-pill">${item}</span>`)
          .join("");
        return `<div class="skill-category"><div class="skill-category-label">${cat.label}</div><div class="skill-pills">${pillHtml}</div></div>`;
      })
      .join("");
  }

  function renderExperience() {
    const container = document.getElementById("experience-container");
    const jobs = data.experience || [];
    if (!jobs.length) {
      container.innerHTML =
        '<p class="profile-text">' +
        (locale === "th"
          ? "เนื้อหาประสบการณ์สำหรับแทร็กนี้ยังไม่พร้อม — ดู Backend หรือ Data Engineering"
          : "Experience for this track is not ready yet — see Backend or Data Engineering.") +
        "</p>";
      return;
    }
    container.innerHTML = jobs
      .map((job, index) => {
        const role = t(job, "role");
        const loc = t(job, "location");
        const desc = t(job, "description");
        const highlights = (locale === "th" ? job.highlights_th : job.highlights_en) || [];
        const bullets = highlights.map((h) => `<li>${h}</li>`).join("");
        const currentClass = index === 0 ? " job--current" : "";
        return `
          <article class="job${currentClass}">
            <h3 class="job-title">${role} at ${job.company}, ${loc}</h3>
            <p class="job-date">${formatRange(job.startDate, job.endDate)}</p>
            ${desc ? `<p class="job-desc">${desc}</p>` : ""}
            <ul class="job-highlights">${bullets}</ul>
          </article>`;
      })
      .join("");
  }

  function renderEducation() {
    const container = document.getElementById("education-container");
    const list = data.education || [];
    if (!list.length) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = [...list]
      .sort((a, b) => {
        const endA = a.endDate || "9999-12";
        const endB = b.endDate || "9999-12";
        return endB.localeCompare(endA) || b.startDate.localeCompare(a.startDate);
      })
      .map((edu) => {
        const note = t(edu, "note");
        return `
          <article class="edu-item">
            <h3 class="edu-degree">${t(edu, "degree")}, ${edu.institution}, ${t(edu, "location")}</h3>
            <p class="edu-meta">${formatRange(edu.startDate, edu.endDate)}</p>
            ${note ? `<p class="edu-note">${note}</p>` : ""}
          </article>`;
      })
      .join("");
  }

  function renderMetrics() {
    const container = document.getElementById("metrics");
    if (!container || !data.metrics) return;
    container.innerHTML = data.metrics
      .map(
        (m) => `
          <div class="metric-item">
            <span class="metric-value">${m.value}</span>
            <span class="metric-label">${t(m, "label")}</span>
          </div>`
      )
      .join("");
  }

  function renderHeroCode() {
    const c = data.heroCode;
    if (!c) return;

    document.getElementById("hero-code-filename").textContent = c.filename;

    const langItems = c.lang
      .map((s) => `<span class="code-str">"${s}"</span>`)
      .join('<span class="code-op">, </span>');
    const domain = t(c, "domain");
    const boolVal = c.remote ? "True" : "False";

    document.getElementById("hero-code-body").innerHTML = [
      '<span class="line"><span class="ln">1</span><span class="code-var">engineer</span> <span class="code-op">=</span> <span class="code-brace">{</span></span>',
      `<span class="line"><span class="ln">2</span>    <span class="code-key">"lang"</span><span class="code-op">:</span> <span class="code-brace">[</span>${langItems}<span class="code-brace">]</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">3</span>    <span class="code-key">"stack"</span><span class="code-op">:</span> <span class="code-str">"${c.stack}"</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">4</span>    <span class="code-key">"domain"</span><span class="code-op">:</span> <span class="code-str">"${domain}"</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">5</span>    <span class="code-key">"years"</span><span class="code-op">:</span> <span class="code-num">${c.years}</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">6</span>    <span class="code-key">"remote"</span><span class="code-op">:</span> <span class="code-bool">${boolVal}</span><span class="code-op">,</span></span>`,
      '<span class="line"><span class="ln">7</span><span class="code-brace">}</span></span>',
    ].join("\n");
  }

  function render() {
    if (!data) return;
    renderLabels();
    renderProfile();
    renderHeroCode();
    renderMetrics();
    renderContacts();
    renderLanguages();
    renderSkills();
    renderExperience();
    renderEducation();
    syncRoleButtons();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  async function initQr() {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    if (typeof QRCode === "undefined") {
      console.warn("QRCode library failed to load");
      return;
    }
    const url = roleShareUrl(currentRole);
    try {
      await QRCode.toCanvas(canvas, url, {
        width: 72,
        margin: 1,
        color: { dark: "#1d1d1f", light: "#ffffff" },
      });
    } catch (err) {
      console.error("Failed to render QR code:", err);
    }
  }

  function downloadPdf() {
    const originalTitle = document.title;
    document.title = data.settings.pdfFilename.replace(".pdf", "");
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  }

  async function copyLink() {
    const url = roleShareUrl(currentRole);
    try {
      await navigator.clipboard.writeText(url);
      showToast(label("copied"));
    } catch {
      showToast(url);
    }
  }

  function assetUrl(file) {
    // Resolve against site root so hash/query never break relative fetch on GitHub Pages
    return new URL(file, window.location.origin + "/").href;
  }

  function setRole(roleId) {
    const role = ROLES[roleId] || ROLES.backend;
    const nextHash = `#${role.hash}`;
    // Prefer real hash updates (fires hashchange) over pushState — more reliable on GitHub Pages
    if (window.location.hash !== nextHash) {
      window.location.hash = role.hash;
      return Promise.resolve();
    }
    return loadRole(role.id);
  }

  function onHashChange() {
    const next = parseRoleFromHash();
    if (next === currentRole) {
      syncRoleButtons();
      return;
    }
    loadRole(next).catch((err) => {
      console.error(err);
      showLoadError();
    });
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLocale(btn.dataset.lang));
    });
    document.querySelectorAll(".role-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        setRole(btn.dataset.role).catch((err) => {
          console.error(err);
          showLoadError();
        });
      });
    });
    document.getElementById("btn-download").addEventListener("click", downloadPdf);
    document.getElementById("btn-copy").addEventListener("click", copyLink);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", () => {
      clearTimeout(window._qrResizeTimer);
      window._qrResizeTimer = setTimeout(initQr, 200);
    });
  }

  function showLoadError() {
    const resume = document.getElementById("resume");
    if (!resume) return;
    resume.innerHTML =
      '<p class="load-error">Failed to load resume. Please refresh the page or contact <a href="mailto:bhornumnard.w@gmail.com">bhornumnard.w@gmail.com</a>.</p>';
  }

  async function loadRole(roleId) {
    const role = ROLES[roleId] || ROLES.backend;
    currentRole = role.id;

    const forcedSrc = document.body.dataset.resumeSrc;
    const file = forcedSrc || role.file;
    const src = assetUrl(file);
    const res = await fetch(src, { cache: "no-cache" });
    if (!res.ok) throw new Error(src + " " + res.status);
    data = await res.json();

    if (!forcedSrc) {
      data.settings = data.settings || {};
      data.settings.siteUrl = roleShareUrl(currentRole);
    }

    locale = localStorage.getItem(LOCALE_KEY) || data.settings.defaultLocale || "en";
    document.documentElement.lang = locale === "th" ? "th" : "en";
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === locale;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.body.dataset.role = currentRole;
    bindEvents();
    render();
    await initQr();
  }

  async function init() {
    if (document.body.dataset.resumeSrc) {
      currentRole = "backend";
      await loadRole("backend");
      return;
    }
    currentRole = parseRoleFromHash();
    await loadRole(currentRole);
  }

  init().catch((err) => {
    console.error("Failed to load resume:", err);
    showLoadError();
  });
})();
