---
name: Personal Resume Web — Design Spec
basedOn: personal_resume_web_prd.md
status: implemented
direction: "Apple-inspired — clean, spacious, premium — with subtle engineer identity (code mockup, skill pills, metrics)"
---

# Design Spec: Bhornumnard Resume

อ้างอิงจาก PRD (`personal_resume_web_prd.md`) — เอกสารนี้อธิบาย design system **ตามที่ implement จริง** ใน `index.html`, `style.css`, `app.js`, `resume.json`

---

## 1. Design Thesis

Resume สำหรับ **backend / data-adjacent engineer** ที่ HR สแกนได้เร็ว — โทน Apple (ที่ว่าง, typography-first, สีน้อย) ผสานลูกเล่น engineer เบา ๆ:

| Element | บทบาท |
|---------|--------|
| Hero code window (`engineer.py`) | สื่อ stack + domain ทันที — traffic lights เฉพาะจุดนี้ |
| Metrics strip | ตัวเลข production scale (5+, DAU, services, uptime) |
| Card tiers | ดึงสายตาตามลำดับ HR: Employment → Profile → Skills → อื่น ๆ |
| Skill pills | keyword scan แบบ GitHub topics |
| Finder-lite titlebar | macOS vibe โดยไม่ใส่ traffic lights ซ้ำทุก card |

**หลักการ:** ลูกเล่นอยู่ที่ระดับความสำคัญ ไม่ตกแต่งเท่ากันทุกที่

---

## 2. Color Tokens (implemented)

| Token | Hex | ใช้ตรงไหน |
|---|---|---|
| `--bg` | `#FAFAFA` | พื้นหลังหลัก |
| `--surface` | `#FFFFFF` | การ์ด |
| `--text` | `#1D1D1F` | ข้อความหลัก |
| `--text-muted` | `#6E6E73` | meta, labels, section titles |
| `--accent` | `#0066CC` | ลิงก์, ปุ่ม primary |
| `--border` | `#E5E5E7` | ขอบการ์ด, แถบ metrics, settings rows |
| Code window bg | `#1E1E1E` | hero code mockup |
| Titlebar bg | `#ECECEE` | Finder-lite card header |
| Pill bg | `#F0F0F2` | skill tags |
| Job highlight bg | `#F5F5F7` | งานล่าสุด (`.job--current`) |

**หลักการ:** ไม่ใช้ accent เป็น structural border — เน้น depth ผ่าน shadow แทน

---

## 3. Typography

| Role | Font | ขนาด/น้ำหนัก |
|---|---|---|
| Body / UI | `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Thai", sans-serif` | 16px / 15px mobile |
| Hero name | same | `clamp(1.75rem, 4vw, 2.5rem)`, weight 700 |
| Hero title | same | `clamp(1rem, 2vw, 1.125rem)`, weight 500 |
| Section title (quiet cards) | same | 11px, uppercase, letter-spacing 0.12em, muted |
| Card title (titlebar) | same | 13px, weight 600, sentence case |
| Metric value | same | `clamp(1.25rem, 2.5vw, 1.5rem)`, weight 700 |
| Code mockup | `"SF Mono", "Menlo", "Monaco", "Consolas", monospace` | 13px |

> **Note:** PRD เดิมแนะนำ self-host Inter — ปัจจุบันใช้ system stack จนกว่าจะเพิ่ม `assets/fonts/`

---

## 4. Layout

**Max-width:** 1040px, centered  
**Breakpoint:** 768px

```
┌─ Sticky Header: Name | EN/TH | Download PDF | Copy Link ─┐
├─ Hero (2-col) ────────────────────────────────────────────┤
│  Left: Name, Title, Phone, Location · Remote, QR         │
│  Right: engineer.py code window (macOS dots)              │
├─ Metrics strip (4 stats, full width) ────────────────────┤
├─ Sidebar (~280px) ──┬─ Main content ────────────────────┤
│  Contacts (quiet)   │  Employment (featured) ← ก่อน      │
│  Languages (quiet)  │  Profile (standard)                 │
│  Skills (standard)  │  Education (quiet)                │
└─────────────────────┴───────────────────────────────────┘
```

**Mobile (<768px):**
- Hero: text → code (stack)
- Metrics: 2×2 grid
- **Main content ก่อน sidebar** (Employment ขึ้นก่อน Skills)
- QR อยู่ใต้ hero meta (ไม่ใช่ header)
- Copy Link ซ่อน

---

## 5. Card Tiers

| Class | Sections | Treatment |
|---|---|---|
| `card--featured` | Employment | Layered shadow, Finder-lite titlebar (gradient), `job--current` on first role |
| `card--standard` | Profile, Skills | Finder-lite titlebar, normal shadow |
| `card--quiet` | Contacts, Languages, Education | Transparent, no shadow, minimal padding |

### Finder-lite titlebar
- Background `#ececee`, border-bottom 1px
- Featured variant: `linear-gradient(#ececee, #e8e8ed)`
- ไม่มี traffic lights (คงไว้แค่ hero code)

### Featured shadow (ไม่ใช้ accent border)
```css
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 8px 24px rgba(0, 0, 0, 0.07);
```

---

## 6. Components

### Metrics strip
- 4 columns desktop / 2×2 mobile
- Data จาก `resume.json` → `metrics[]`
- ค่า: `5+`, `40–80k`, `6–7`, `~99%`

### Skill pills
- Neutral gray pills per skill item
- Tools แยก pill ต่อรายการ (split จาก comma-separated rows)

### Settings-style rows
- Contacts: label ซ้าย | value ขวา | chevron `›` สำหรับลิงก์
- Languages: ชื่อภาษา | ระดับ

### Employment highlights
- Bullet แรกของงานล่าสุดรองรับ `<strong>` สำหรับตัวเลข + domain keywords
- `.job-highlights strong`: weight 600, สี `--text`

### Hero code block
- Render จาก `resume.json` → `heroCode`
- สลับ `domain_en` / `domain_th` ตาม locale

### QR Code
- อยู่ใต้ hero meta (`#qr-container`)
- Library: `qrcode` via jsDelivr (`/npm/qrcode/build/qrcode.min.js`)
- ขนาด 72px

---

## 7. Visual Hierarchy (HR scan order)

```
① Hero name + title
② Metrics
③ Employment (featured card + current job highlight)
④ Profile
⑤ Skills
⑥ Contacts / Languages / Education
```

---

## 8. Motion

- Page fade-in: 400ms ease (`@keyframes fadeIn`)
- Button hover: opacity 200ms
- ไม่มี scroll animation / parallax

---

## 9. Print / PDF

- ซ่อน: header, toast, hero code, hero QR
- Metrics: 4 columns คงไว้
- Cards: ไม่มี shadow, titlebar เป็น text + เส้นล่าง
- `job--current`: พื้นหลัง `#f5f5f5` อ่อน

---

## 10. CSS Variables (implemented)

```css
:root {
  --bg: #fafafa;
  --surface: #ffffff;
  --text: #1d1d1f;
  --text-muted: #6e6e73;
  --accent: #0066cc;
  --border: #e5e5e7;
  --header-bg: rgba(250, 250, 250, 0.85);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  --radius: 12px;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Thai", sans-serif;
}
```

---

## 11. Post-MVP design ideas (ยังไม่ทำ)

- Self-host Inter + JetBrains Mono ตาม spec เดิม
- Monospace date ranges ใน experience
- Dark mode
- `og:image` สำหรับ link preview
- Senior ใน hero title (content change)
