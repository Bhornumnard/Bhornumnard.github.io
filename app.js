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
  let pageView = "home";

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
    if (raw === "home" || raw === "blog" || raw === "project" || raw === "projects" || raw === "writing" || raw === "work") {
      return currentRole || "backend";
    }
    if (!raw || raw === "backend") return "backend";
    if (raw === "data-engineering" || raw === "data" || raw === "de") return "data-engineering";
    // AI track hidden until ready — treat #ai as backend for public visitors
    if (raw === "ai" || raw === "ai-backend") return "backend";
    return "backend";
  }

  function parsePageViewFromHash() {
    const raw = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    if (!raw || raw === "home" || raw === "writing" || raw === "work") return "home";
    if (raw === "blog") return "blog";
    if (raw === "project" || raw === "projects") return "project";
    return "resume";
  }

  function pageShareUrl(view) {
    if (view === "home") return BASE_SITE_URL;
    if (view === "blog") return `${BASE_SITE_URL}#blog`;
    if (view === "project") return `${BASE_SITE_URL}#project`;
    return roleShareUrl(currentRole);
  }

  function roleShareUrl(roleId) {
    const role = ROLES[roleId] || ROLES.backend;
    return `${BASE_SITE_URL}#${role.hash}`;
  }

  function shareUrl() {
    if (document.body.dataset.resumeSrc) {
      return data?.settings?.siteUrl || window.location.href.split("#")[0];
    }
    return pageShareUrl(pageView);
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
    const labelContacts = document.getElementById("label-contacts");
    if (labelContacts) labelContacts.textContent = label("contacts");
    const labelLanguages = document.getElementById("label-languages");
    if (labelLanguages) labelLanguages.textContent = label("languages");
    document.getElementById("label-skills").textContent = label("skills");
    document.getElementById("label-profile").textContent = label("profile");
    const labelKeySkills = document.getElementById("label-key-skills");
    if (labelKeySkills) labelKeySkills.textContent = label("keySkills");
    document.getElementById("label-employment").textContent = label("employment");
    document.getElementById("label-education").textContent = label("education");
    const labelWriting = document.getElementById("label-writing");
    if (labelWriting) labelWriting.textContent = label("writing");
    const tabHome = document.getElementById("tab-home");
    if (tabHome) tabHome.textContent = label("home");
    const tabResume = document.getElementById("tab-resume");
    if (tabResume) tabResume.textContent = label("resume");
    const tabBlog = document.getElementById("tab-blog");
    if (tabBlog) tabBlog.textContent = label("blog");
    const tabProject = document.getElementById("tab-project");
    if (tabProject) tabProject.textContent = label("projects");
    const labelCertifications = document.getElementById("label-certifications");
    if (labelCertifications) labelCertifications.textContent = label("certifications");
    const labelSelectedProjects = document.getElementById("label-selected-projects");
    if (labelSelectedProjects) {
      labelSelectedProjects.textContent = label("selectedProjects");
    }
    document.getElementById("btn-download").textContent = label("downloadPdf");
    document.getElementById("btn-copy").textContent = label("copyLink");
  }

  function renderProfile() {
    const p = data.profile;
    const headerLogo = document.getElementById("header-logo");
    if (headerLogo) headerLogo.textContent = p.fullName;
    const nameEl = document.getElementById("hero-name");
    if (nameEl) {
      if (pageView === "home") {
        nameEl.innerHTML = "Bhornumnard<br>Wanasrisun";
      } else {
        nameEl.textContent = p.fullName;
      }
    }
    document.getElementById("hero-title").textContent = t(p, "title");
    const phoneEl = document.getElementById("hero-phone");
    phoneEl.textContent = p.phoneDisplay || p.phone;
    phoneEl.href = p.phoneHref;
    const metaParts = [t(p, "location")];
    if (p.linkedinUrl && p.linkedinLabel) {
      metaParts.push(
        `<a href="${p.linkedinUrl}" target="_blank" rel="noopener noreferrer">${p.linkedinLabel}</a>`
      );
    }
    if (p.githubUrl && p.githubLabel) {
      metaParts.push(
        `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer">${p.githubLabel}</a>`
      );
    }
    const avail = t(p, "availability");
    if (avail) metaParts.push(avail);
    document.getElementById("hero-location").innerHTML = metaParts.join(" · ");
    document.getElementById("profile-text").textContent = t(data.summary, "summary");

    const roleName = ROLES[currentRole]?.label_en || "Backend";
    if (pageView === "home") {
      document.title = p.fullName;
    } else if (pageView === "blog") {
      document.title = `${p.fullName} — Blog`;
    } else if (pageView === "project") {
      document.title = `${p.fullName} — Project`;
    } else {
      document.title = `${p.fullName} — ${roleName} Resume`;
    }
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
    if (!ul) return;
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
    if (!ul) return;
    ul.innerHTML = (data.languages || [])
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
          .map((item) => {
            const isRow = /^[A-Z0-9 &/()]+:/.test(item);
            return `<span class="skill-pill${isRow ? " skill-pill--row" : ""}">${item}</span>`;
          })
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
        const scope = t(job, "scope");
        const highlights = (locale === "th" ? job.highlights_th : job.highlights_en) || [];
        const bullets = highlights.map((h) => `<li>${h}</li>`).join("");
        const currentClass = index === 0 ? " job--current" : "";
        return `
          <article class="job${currentClass}">
            <h3 class="job-title">${role} at ${job.company}, ${loc}</h3>
            ${scope ? `<p class="job-scope">${scope}</p>` : ""}
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

  function renderWriting() {
    const section = document.getElementById("section-writing");
    const container = document.getElementById("writing-container");
    if (!section || !container) return;
    const list = data.writing || [];
    if (!list.length) {
      section.style.display = "none";
      container.innerHTML = "";
      return;
    }
    section.style.removeProperty("display");
    container.innerHTML = list
      .map((item) => {
        const title = t(item, "title");
        const venue = t(item, "venue");
        const summary = t(item, "summary");
        const urlLabel = t(item, "urlLabel") || item.urlLabel;
        const link =
          item.url && urlLabel
            ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${urlLabel}</a>`
            : "";
        const noteParts = [summary, link].filter(Boolean);
        return `
          <article class="edu-item writing-item">
            <h3 class="edu-degree">${title}${venue ? `, ${venue}` : ""}</h3>
            ${noteParts.length ? `<p class="edu-note">${noteParts.join(" ")}</p>` : ""}
          </article>`;
      })
      .join("");
  }

  function renderSelectedProjects() {
    const section = document.getElementById("section-selected-projects");
    const container = document.getElementById("selected-projects-container");
    if (!section || !container) return;
    const list = data.projects || [];
    if (!list.length) {
      section.style.display = "none";
      container.innerHTML = "";
      return;
    }
    section.style.removeProperty("display");
    container.innerHTML = list
      .map((item) => {
        const title = t(item, "title");
        const venue = t(item, "venue");
        const summary = t(item, "summary");
        const urlLabel = t(item, "urlLabel") || item.urlLabel;
        const link =
          item.url && urlLabel
            ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${urlLabel}</a>`
            : "";
        const noteParts = [summary, link].filter(Boolean);
        return `
          <article class="edu-item writing-item">
            <h3 class="edu-degree">${title}${venue ? `, ${venue}` : ""}</h3>
            ${noteParts.length ? `<p class="edu-note">${noteParts.join(" ")}</p>` : ""}
          </article>`;
      })
      .join("");
  }

  function renderCertifications() {
    const section = document.getElementById("section-certifications");
    const container = document.getElementById("certifications-container");
    if (!section || !container) return;
    const list = data.certifications || [];
    if (!list.length) {
      section.style.display = "none";
      container.innerHTML = "";
      return;
    }
    section.style.removeProperty("display");
    container.innerHTML = list
      .map((item) => {
        const title = t(item, "title");
        const meta = t(item, "meta");
        const summary = t(item, "summary");
        return `
          <article class="edu-item">
            <h3 class="edu-degree">${title}</h3>
            ${meta ? `<p class="edu-meta">${meta}</p>` : ""}
            ${summary ? `<p class="edu-note">${summary}</p>` : ""}
          </article>`;
      })
      .join("");
  }

  function showcaseList(view) {
    if (view === "project") return data.projects || [];
    return data.writing || [];
  }

  function renderShowcaseCard(item) {
    const title = t(item, "title");
    const venue = t(item, "venue");
    const summary = t(item, "summary");
    const cta = t(item, "urlLabel") || item.urlLabel || (locale === "th" ? "เปิดลิงก์" : "View");
    const tags = (item.tags || [])
      .map((tag) => `<span class="skill-pill">${tag}</span>`)
      .join("");
    return `
      <a class="showcase-card" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${venue ? `<span class="showcase-card-venue">${venue}</span>` : ""}
        <h3 class="showcase-card-title">${title}</h3>
        ${summary ? `<p class="showcase-card-summary">${summary}</p>` : ""}
        ${tags ? `<div class="skill-pills">${tags}</div>` : ""}
        <span class="showcase-card-cta">${cta} ›</span>
      </a>`;
  }

  function syncPageNav() {
    document.querySelectorAll(".page-nav-btn").forEach((btn) => {
      const active = btn.dataset.view === pageView;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function applyPageView(view, opts) {
    const nav = document.querySelector(".page-nav");
    if (!nav) return;
    const blog = (data && data.writing) || [];
    const projects = (data && data.projects) || [];
    let next = view;
    if (next !== "home" && next !== "resume" && next !== "blog" && next !== "project") {
      next = "home";
    }
    if (next === "blog" && !blog.length) next = "home";
    if (next === "project" && !projects.length) next = "home";
    pageView = next;
    document.body.dataset.view = pageView;
    syncPageNav();
    const navToggle = document.getElementById("nav-toggle");
    nav.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    if (data) {
      renderHeroCode();
      const nameEl = document.getElementById("hero-name");
      if (nameEl && data.profile) {
        if (pageView === "home") nameEl.innerHTML = "Bhornumnard<br>Wanasrisun";
        else nameEl.textContent = data.profile.fullName;
      }
    }
    const blogBtn = document.getElementById("tab-blog");
    const projectBtn = document.getElementById("tab-project");
    if (blogBtn) blogBtn.style.display = blog.length ? "" : "none";
    if (projectBtn) projectBtn.style.display = projects.length ? "" : "none";
    const grid = document.getElementById("showcase-grid");
    if (grid && (pageView === "blog" || pageView === "project")) {
      grid.innerHTML = showcaseList(pageView).map(renderShowcaseCard).join("");
    }
    if (data && data.profile) {
      const p = data.profile;
      const roleName = ROLES[currentRole]?.label_en || "Backend";
      if (pageView === "home") document.title = p.fullName;
      else if (pageView === "blog") document.title = `${p.fullName} — Blog`;
      else if (pageView === "project") document.title = `${p.fullName} — Project`;
      else document.title = `${p.fullName} — ${roleName} Resume`;
    }
    if (opts && opts.updateQr) initQr();
    const hash = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    if (pageView === "home" && (hash === "writing" || hash === "work")) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function setPageView(view) {
    const nextHash =
      view === "home"
        ? "home"
        : view === "blog"
          ? "blog"
          : view === "project"
            ? "project"
            : (ROLES[currentRole] || ROLES.backend).hash;
    const currentHash = (window.location.hash || "").replace(/^#/, "");
    if (currentHash === nextHash) {
      applyPageView(view, { updateQr: true });
      return;
    }
    window.location.hash = nextHash;
  }

  function goHomeScroll(sectionId) {
    const current = (window.location.hash || "").replace(/^#/, "");
    if (pageView === "home" && current === sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = sectionId;
  }

  function renderHomeWritingCard(item) {
    const title = t(item, "title");
    const excerpt = item.summary_en || t(item, "summary");
    const venue = t(item, "venue") || "Medium";
    return `
      <a class="home-card" href="${item.url}" target="_blank" rel="noopener noreferrer">
        <div class="home-card-kicker">${venue}</div>
        <div class="home-card-title">${title}</div>
        ${excerpt ? `<div class="home-card-excerpt">${excerpt}</div>` : ""}
      </a>`;
  }

  function renderHomeProjectCard(item) {
    const title = t(item, "title");
    const summary = t(item, "summary");
    const cta = t(item, "urlLabel") || item.urlLabel || "View";
    const tags = (item.tags || [])
      .map((tag) => `<span class="tag-pill">${tag}</span>`)
      .join("");
    return `
      <div class="home-card home-card--project">
        <div class="home-card-title">${title}</div>
        ${summary ? `<div class="home-card-excerpt">${summary}</div>` : ""}
        ${tags ? `<div class="tag-row">${tags}</div>` : ""}
        <a class="home-card-link" href="${item.url}" target="_blank" rel="noopener noreferrer">${cta} →</a>
      </div>`;
  }

  function renderHome() {
    const section = document.getElementById("section-home");
    if (!section || !data) return;
    const p = data.profile;
    const pitchEl = document.getElementById("hero-pitch");
    if (pitchEl) pitchEl.textContent = t(p, "pitch");
    const homeMetaText = document.getElementById("hero-home-meta-text");
    if (homeMetaText) {
      homeMetaText.textContent = [t(p, "location"), t(p, "availability")].filter(Boolean).join(" · ");
    }
    const cta = document.getElementById("hero-cta");
    if (cta) {
      cta.innerHTML =
        `<button type="button" class="btn" data-view="resume">${label("viewResume")}</button>` +
        `<button type="button" class="btn btn-secondary" data-home-scroll="writing">${label("blog")}</button>` +
        `<button type="button" class="btn btn-secondary" data-home-scroll="work">${label("projects")}</button>`;
    }
    const writingHead = document.getElementById("label-latest-writing");
    if (writingHead) writingHead.textContent = label("latestWriting");
    const workHead = document.getElementById("label-latest-work");
    if (workHead) workHead.textContent = label("latestWork");
    const moreBlog = document.getElementById("btn-more-blog");
    if (moreBlog) moreBlog.textContent = label("blog") + " ›";
    const writingGrid = document.getElementById("home-writing-grid");
    if (writingGrid) {
      writingGrid.innerHTML = (data.writing || []).map(renderHomeWritingCard).join("");
    }
    const projectGrid = document.getElementById("home-project-grid");
    if (projectGrid) {
      projectGrid.innerHTML = (data.projects || []).map(renderHomeProjectCard).join("");
    }
    const footer = document.getElementById("home-footer");
    if (footer) footer.textContent = `© ${new Date().getFullYear()} ${p.fullName}`;
  }

  function renderShowcase() {
    const section = document.getElementById("section-showcase");
    if (!section) return;
    applyPageView(pageView);
  }

  const METRIC_ICONS = {
    years:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    domain:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/></svg>',
    dau:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V10M11 19V5M18 19v-7"/></svg>',
    uptime:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  };

  function renderMetrics() {
    const container = document.getElementById("metrics");
    if (!container || !data.metrics) return;
    const icons = ["years", "domain", "dau", "uptime"];
    container.innerHTML = data.metrics
      .map((m, i) => {
        const iconKey = m.icon || icons[i];
        const icon = METRIC_ICONS[iconKey] || "";
        return `
          <div class="metric-item">
            ${icon ? `<div class="metric-icon" aria-hidden="true">${icon}</div>` : ""}
            <span class="metric-value">${m.value}</span>
            <span class="metric-label">${t(m, "label")}</span>
          </div>`;
      })
      .join("");
  }

  function renderHeroCode() {
    const c = data.heroCode;
    if (!c) return;
    const filenameEl = document.getElementById("hero-code-filename");
    if (filenameEl) filenameEl.textContent = c.filename || "engineer.py";
    const body = document.getElementById("hero-code-body");
    if (!body) return;

    const lightCode =
      document.body.dataset.view === "home" || document.body.dataset.view === "resume";
    if (lightCode) {
      const langItems = (c.lang || []).map((s) => `"${s}"`).join(", ");
      const domain = t(c, "domain");
      const boolVal = c.remote ? "True" : "False";
      const lines = [
        { text: "skills = {", tone: "base" },
        { text: `    "lang": [${langItems}],`, tone: "stack" },
        { text: `    "stack": "${c.stack}",`, tone: "stack" },
        { text: `    "domain": "${domain}",`, tone: "context" },
        { text: `    "years": ${c.years},`, tone: "context" },
        { text: `    "remote": ${boolVal},`, tone: "context" },
        { text: "}", tone: "base" },
      ];
      body.innerHTML = lines
        .map((line) => `<div class="code-line code-line--${line.tone}">${line.text}</div>`)
        .join("");
      return;
    }

    const langItems = c.lang
      .map((s) => `<span class="code-str">"${s}"</span>`)
      .join('<span class="code-op">, </span>');
    const domain = t(c, "domain");
    const boolVal = c.remote ? "True" : "False";

    body.innerHTML = [
      '<span class="line"><span class="ln">1</span><span class="code-var">engineer</span> <span class="code-op">=</span> <span class="code-brace">{</span></span>',
      `<span class="line"><span class="ln">2</span>    <span class="code-key">"lang"</span><span class="code-op">:</span> <span class="code-brace">[</span>${langItems}<span class="code-brace">]</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">3</span>    <span class="code-key">"stack"</span><span class="code-op">:</span> <span class="code-str">"${c.stack}"</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">4</span>    <span class="code-key">"domain"</span><span class="code-op">:</span> <span class="code-str">"${domain}"</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">5</span>    <span class="code-key">"years"</span><span class="code-op">:</span> <span class="code-num">${c.years}</span><span class="code-op">,</span></span>`,
      `<span class="line"><span class="ln">6</span>    <span class="code-key">"remote"</span><span class="code-op">:</span> <span class="code-bool">${boolVal}</span><span class="code-op">,</span></span>`,
      '<span class="line"><span class="ln">7</span><span class="code-brace">}</span></span>',
    ].join("\n");
  }

  function renderKeySkills() {
    const section = document.getElementById("section-key-skills");
    const lineEl = document.getElementById("key-skills-line");
    const noteEl = document.getElementById("key-skills-note");
    if (!section || !lineEl) return;
    const items = (data.keySkills && data.keySkills.items) || [];
    const note = data.keySkills ? t(data.keySkills, "note") : "";
    if (!items.length) {
      section.style.display = "none";
      lineEl.innerHTML = "";
      if (noteEl) noteEl.innerHTML = "";
      return;
    }
    section.style.removeProperty("display");
    lineEl.innerHTML = items.map((item) => `<strong>${item}</strong>`).join(" · ");
    if (noteEl) {
      noteEl.textContent = note || "";
      noteEl.style.display = note ? "" : "none";
    }
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
    renderKeySkills();
    renderExperience();
    renderEducation();
    renderCertifications();
    renderSelectedProjects();
    renderWriting();
    renderHome();
    renderShowcase();
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
    const url = shareUrl();
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
    const filename = data && data.settings && data.settings.pdfFilename;
    if (filename) document.title = filename.replace(/\.pdf$/i, "");
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  }

  async function copyLink() {
    const url = pageView === "home" ? window.location.href : shareUrl();
    const btn = document.getElementById("btn-copy");
    try {
      await navigator.clipboard.writeText(url);
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = label("copied");
        clearTimeout(window._copyLabelTimer);
        window._copyLabelTimer = setTimeout(() => {
          btn.textContent = label("copyLink");
        }, 1600);
      } else {
        showToast(label("copied"));
      }
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
    const nextView = parsePageViewFromHash();
    applyPageView(nextView, { updateQr: true });
    if (nextView !== "resume") return;
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
    document.querySelectorAll(".page-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const scrollId = btn.dataset.homeScroll;
        if (scrollId) {
          goHomeScroll(scrollId);
          return;
        }
        setPageView(btn.dataset.view);
      });
    });
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
      navToggle.addEventListener("click", () => {
        const nav = document.querySelector(".page-nav");
        const open = nav && nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(!!open));
      });
    }
    document.addEventListener("click", (e) => {
      const scrollBtn = e.target.closest("[data-home-scroll]");
      if (scrollBtn && !scrollBtn.classList.contains("page-nav-btn")) {
        e.preventDefault();
        goHomeScroll(scrollBtn.dataset.homeScroll);
        return;
      }
      const trigger = e.target.closest("#hero-cta [data-view]");
      if (!trigger) return;
      e.preventDefault();
      setPageView(trigger.dataset.view);
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
    pageView = parsePageViewFromHash();
    await loadRole(currentRole);
  }

  init().catch((err) => {
    console.error("Failed to load resume:", err);
    showLoadError();
  });
})();
