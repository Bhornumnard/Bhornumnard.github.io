---
name: Personal Resume Web PRD
overview: PRD สำหรับ Personal Resume Website แบบ single-page — สถานะ implement แล้วบน GitHub Pages
status: implemented
todos:
  - id: migrate-json
    content: "แปลงเนื้อหาเป็น resume.json (EN + TH)"
    status: completed
  - id: phase1-core
    content: "Single-page resume + responsive layout + Apple-style design"
    status: completed
  - id: phase2-i18n
    content: "Bilingual toggle EN/TH + localStorage"
    status: completed
  - id: phase3-pdf
    content: "Download PDF via print CSS"
    status: completed
  - id: phase4-share
    content: "QR Code + Copy Link + Open Graph meta"
    status: completed
  - id: post-mvp-og-image
    content: "เพิ่ม og:image สำหรับ link preview"
    status: pending
  - id: post-mvp-inter-font
    content: "Self-host Inter WOFF2 ตาม design spec เดิม"
    status: pending
isProject: false
---

# PRD: Personal Resume Website (Bhornumnard)

## ภาพรวม

**ชื่อเว็บ:** Bhornumnard Resume  
**URL:** [https://bhornumnard.github.io](https://bhornumnard.github.io)  
**Deploy:** GitHub Pages จาก repo `bhornumnard/bhornumnard.github.io`

เว็บ resume ส่วนตัวแบบ single-page ที่ HR/recruiter เปิดดูได้ทันทีจากลิงก์หรือ QR Code เนื้อหาดึงจาก `resume.json` สลับภาษา EN/TH ได้ และ export PDF ผ่าน print stylesheet

**สถานะ:** Phase 1–4 implement แล้ว — ดูรายละเอียด design ใน [`design.md`](design.md)

---

## ปัญหาที่แก้

| ก่อน | หลัง |
|------|------|
| ส่ง PDF แนบอีเมล | ส่งลิงก์เดียว — เปิดดูทันที |
| PDF ไม่ responsive | Layout ปรับตามหน้าจอ |
| แก้ resume ต้อง export PDF ใหม่ | แก้ JSON + deploy |
| เว็บเดิมแค่ "Print this page" | Download PDF + QR + bilingual |

---

## กลุ่มผู้ใช้

- **เจ้าของ resume:** อัปเดต `resume.json`, แชร์ลิงก์/QR
- **HR / Recruiter / Hiring Manager:** เปิดลิงก์, สแกน QR, ดาวน์โหลด PDF

---

## ฟีเจอร์ที่ implement แล้ว

| # | ฟีเจอร์ | รายละเอียด |
|---|---------|------------|
| 1 | **JSON-driven content** | `resume.json` → render ทุก section ผ่าน `app.js` |
| 2 | **EN/TH toggle** | ปุ่ม header, `localStorage` จำภาษา, แปลครบรวม highlights |
| 3 | **Download PDF** | `window.print()` + `@media print` → `Bhornum_Wanasrisun_Resume.pdf` |
| 4 | **QR Code** | ใต้ hero meta, encode `siteUrl` จาก settings |
| 5 | **Copy Link** | clipboard + toast (ซ่อนบน mobile) |
| 6 | **Responsive** | Desktop 2-column; mobile main ก่อน sidebar |
| 7 | **Contact links** | mailto, tel, LinkedIn, GitHub |
| 8 | **Hero code mockup** | `engineer.py` จาก `heroCode` ใน JSON |
| 9 | **Metrics strip** | 4 stats ระหว่าง hero กับ body |
| 10 | **Skill pills** | neutral tags แทน text list |
| 11 | **Card visual hierarchy** | featured / standard / quiet tiers |
| 12 | **Settings-style rows** | Contacts + Languages แบบ macOS Settings |
| 13 | **Content emphasis** | `<strong>` ใน highlight แรก; `availability` ใน hero meta |
| 14 | **Error handling** | noscript fallback, load error UI |
| 15 | **Open Graph** | og:title, og:description, og:url (ยังไม่มี og:image) |

---

## สิ่งที่จะไม่ทำ (Non-Goals)

- Login / Admin UI / contact form / analytics
- รูปโปรไฟล์ (Post-MVP)
- Auto-sync LinkedIn

---

## โครงสร้างข้อมูล (`resume.json`)

### settings
- `defaultLocale`, `pdfFilename`, `siteUrl`

### labels
- UI strings ทุกปุ่ม/section + contact row labels (`contactPhone`, `contactEmail`, …)

### profile
- `fullName`, `title_en/th`, `location_en/th`
- `availability_en/th` — แสดงใน hero meta เช่น "Open to remote"
- `phone`, `phoneDisplay`, `phoneHref`, `email`, `linkedinUrl`, `linkedinLabel`, `githubUrl`, `githubLabel`

### summary
- `summary_en`, `summary_th`

### languages, skills, experience, education
- ตาม schema เดิม — skills ใช้ label เต็ม (`Languages`, `Data & Storage`, `Tools`)
- `highlights_en/th` รองรับ HTML `<strong>` สำหรับ emphasis

### heroCode
```json
{
  "filename": "engineer.py",
  "lang": ["Python", "SQL"],
  "stack": "FastAPI",
  "domain_en": "fintech · eKYC",
  "domain_th": "fintech · eKYC",
  "years": 5,
  "remote": true
}
```

### metrics
```json
[
  { "value": "5+", "label_en": "years exp", "label_th": "ปีประสบการณ์" },
  { "value": "40–80k", "label_en": "daily users", "label_th": "ผู้ใช้งาน/วัน" },
  ...
]
```

---

## Layout (implemented)

```mermaid
flowchart TD
    subgraph header [Sticky Header]
        Logo[Name]
        Actions[EN/TH | Download PDF | Copy Link]
    end

    subgraph hero [Hero 2-column]
        HeroText[Name + Title + Phone + Location + QR]
        HeroCode[engineer.py code window]
    end

    subgraph metrics [Metrics Strip]
        M1[5+ years] 
        M2[40-80k DAU]
        M3[6-7 services]
        M4[99% uptime]
    end

    subgraph body [Resume Body]
        Sidebar[Contacts | Languages | Skills]
        Main[Employment | Profile | Education]
    end

    header --> hero --> metrics --> body
```

### Desktop (≥768px)
- Sidebar ซ้าย ~280px: Contacts, Languages, Skills
- Main ขวา: **Employment ก่อน** Profile, Education

### Mobile (<768px)
- Hero → Metrics → **Main (Employment first)** → Sidebar
- QR ใต้ hero (ไม่ใช่ header)

---

## สไตล์

อ้างอิง [`design.md`](design.md) — สรุปสั้น ๆ:

- โทน Apple minimal: `#FAFAFA` bg, `#1D1D1F` text, `#0066CC` accent
- System font stack (ยังไม่ self-host Inter)
- Card tiers + Finder-lite titlebar + skill pills + metrics strip
- Traffic lights เฉพาะ hero code window

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | HTML + CSS + Vanilla JS |
| Data | `resume.json` (static fetch) |
| PDF | `window.print()` + `@media print` |
| QR | `qrcode` (jsDelivr CDN) |
| Deploy | GitHub Pages (`main` branch) |

### ไฟล์หลัก
- `index.html` — structure + static fallbacks
- `style.css` — design tokens, responsive, print
- `app.js` — fetch, render, i18n, QR, PDF
- `resume.json` — เนื้อหาทั้งหมด

---

## Phase Status

| Phase | สถานะ | หมายเหตุ |
|-------|--------|----------|
| Phase 1: Core page | ✅ Done | JSON + responsive + hero |
| Phase 2: Bilingual | ✅ Done | EN/TH + localStorage |
| Phase 3: PDF | ✅ Done | print CSS |
| Phase 4: Share | ✅ Done | QR ย้ายไป hero; OG ไม่มี image |
| Design polish | ✅ Done | metrics, pills, card tiers, hierarchy |

---

## Post-MVP

- `og:image` สำหรับ Slack/Line preview
- Self-host Inter + monospace fonts
- Senior ใน hero title
- Projects / Certifications sections
- Dark mode
- Schema.org JSON-LD

---

## ข้อมูล Resume ปัจจุบัน

- **งาน:** Uppass (Apr 2022–Feb 2026), Sinwattana (Sep 2020–Mar 2022), Code Camp TA (Feb–Sep 2020)
- **การศึกษา:** B.Sc. Biology CMU, Software Park Code Camp
- **Skills:** Python/FastAPI/MySQL/MongoDB/Redis/GCP + Earlier JS/React/Node/Django
- **Contacts:** +66(0)84-555-0485, bhornumnard.w@gmail.com, LinkedIn, GitHub
- **Languages:** Thai (Native), English (Professional Working Proficiency)

---

## การตัดสินใจที่ยืนยันแล้ว

| หัวข้อ | การตัดสินใจ |
|--------|-------------|
| URL | `https://bhornumnard.github.io` |
| PDF filename | `Bhornum_Wanasrisun_Resume.pdf` |
| QR position | ใต้ hero meta (ไม่ใช่ sticky header) |
| Hero name | `fullName` ปกติ (ไม่ใช้ spaced lowercase) |
| Employment order | ก่อน Profile ใน main column |
| Featured card emphasis | Shadow depth (ไม่ใช้ accent border-left) |
| รูปโปรไฟล์ | Post-MVP |
