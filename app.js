(function () {
  "use strict";

  const LOCALE_KEY = "resume-locale";
  let data = null;
  let locale = localStorage.getItem(LOCALE_KEY) || "en";

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

    document.title =
      locale === "th"
        ? `${p.fullName} — Resume`
        : `${p.fullName} — Resume`;
  }

  function renderContacts() {
    const p = data.profile;
    const items = [
      { type: "text", labelKey: "contactPhone", value: p.phone },
      { type: "link", labelKey: "contactEmail", href: `mailto:${p.email}`, label: p.email },
      { type: "link", labelKey: "contactLinkedin", href: p.linkedinUrl, label: p.linkedinLabel },
      { type: "link", labelKey: "contactGithub", href: p.githubUrl, label: p.githubLabel },
    ];
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
    container.innerHTML = data.experience
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
    container.innerHTML = [...data.education]
      .sort((a, b) => b.endDate.localeCompare(a.endDate) || b.startDate.localeCompare(a.startDate))
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
    renderLabels();
    renderProfile();
    renderHeroCode();
    renderMetrics();
    renderContacts();
    renderLanguages();
    renderSkills();
    renderExperience();
    renderEducation();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  async function initQr() {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas || !data?.settings?.siteUrl) return;
    if (typeof QRCode === "undefined") {
      console.warn("QRCode library failed to load");
      return;
    }
    try {
      await QRCode.toCanvas(canvas, data.settings.siteUrl, {
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
    const url = data.settings.siteUrl;
    try {
      await navigator.clipboard.writeText(url);
      showToast(label("copied"));
    } catch {
      showToast(url);
    }
  }

  function bindEvents() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLocale(btn.dataset.lang));
    });
    document.getElementById("btn-download").addEventListener("click", downloadPdf);
    document.getElementById("btn-copy").addEventListener("click", copyLink);
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

  async function init() {
    const res = await fetch("resume.json");
    if (!res.ok) throw new Error("resume.json " + res.status);
    data = await res.json();
    locale = localStorage.getItem(LOCALE_KEY) || data.settings.defaultLocale || "en";
    document.documentElement.lang = locale === "th" ? "th" : "en";
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === locale;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    bindEvents();
    render();
    await initQr();
  }

  init().catch((err) => {
    console.error("Failed to load resume:", err);
    showLoadError();
  });
})();
