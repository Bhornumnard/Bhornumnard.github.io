# Bhornumnard Wanasrisun

**Software Engineer (Python) — Data Integrations & Pipelines**

+66 (0)84-555-0485 · Lamphun, Thailand · linkedin.com/in/bhornumnard-wanasrisun · github.com/Bhornumnard · Available immediately · Open to permanent or contract · UTC+7

---

## Profile

Python/SQL engineer specializing in data pipelines and ETL-driven integrations, with 5+ years in fintech, working across Django and FastAPI. Delivered Thai court-records and business-registry data services end-to-end, feeding results into decision flows and eKYC routing. Scope spans data pipelines, production support, and third-party integrations on a 40–60k DAU platform at ~99% uptime. Completed Road to Data Engineer 3.0 (Spark, Airflow, BigQuery); available immediately for permanent or contract roles.

## Key Skills

<!-- KEY SKILLS line นี้ควรปรับ keyword ทุกครั้งก่อนสมัครแต่ละที่ — เลือก 5-8 keyword ที่ตรงกับ JD มากที่สุดจาก Skills section เต็มด้านล่าง ไม่ใช้ keyword เดิมทุกใบสมัคร -->

**Python** · **SQL** · **Data modeling & pipeline design** · **Multi-source data ingestion & routing** · **Structured & unstructured storage (MySQL, GCP Datastore)** · **ETL/ELT** · **CI/CD (GitLab CI)** · **BigQuery** · **GCP** · **Third-party API integrations**

## Experience

### Technical Support and Software Engineer at UpPass, Bangkok, Thailand

*2022-04 — 2026-02*

*Scope: Data-integration services on Python / Django / FastAPI + production support for a fintech platform (40–60k DAU)*

Backend delivery on a live fintech platform — Django decision flows, FastAPI data services, billing, and customer technical support. Frequently reassigned across engineering and sales priorities to unblock shipping.

- Rotated across priority projects with frequent reassignments — stepped into blocked workstreams across engineering and sales (form schemas, demo setup, production go-lives) and unblocked delivery.
- Developed and fixed decision-flow features on the core Django product — conditional logic routing users after form submission using eKYC scores and multiple internal data sources.
- Designed and delivered two internal data-source services end-to-end — the Thai court records service (COJ), a crawler triggered by upstream source data updates, and the business registry service (BDEX), integrated via partner APIs (including BOL) and cached per user request — extraction, transformation, and processing into GCP Datastore feeding decision flows.
- Designed and built the GitLab CI/CD pipeline for the BDEX service, automating deployment for the pipeline.
- Developed and maintained 4+ Cloud Functions as service connectors across UpPass, and maintained teammates' Cloud Functions when needed.
- Built the ingestion and OCR-parsing pipeline for bank-statement and utility-bill extraction alongside a teammate — pairing OCR with LLM-based field extraction for structured output, and integrating an external verification API (Asia Verify) for international bank statements; maintained and resolved GitLab CI/CD pipeline issues supporting its deployment.
- Co-maintained the Data Acquisition and Publication service (DAP), an internal data source for partner integrations — added a rule to its AML screening checks.
- Managed the technical-support loop for multiple UpPass customers — intake, investigation via logs and metrics, fix, and customer reply — coordinating with partner API providers when issues originated there.
- Monitored production on client infrastructure at True (Cloud Logging, Sentry, alerting) with QA, PM, support, and leadership — peaks near 80k DAU at 20–40 RPS.

### Software Engineer (Backend) at Sinwattana Crowdfunding, Bangkok, Thailand

*2020-09 — 2022-03*

*Scope: Solo backend ownership of a Django crowdfunding platform — investor/fundraiser flows, payments, admin tooling*

Solo backend engineer on a crowdfunding product — Owned delivery end-to-end for investor/fundraiser journeys, payments, and admin tooling; flexed across product priorities as needed.

- Led backend alone — independently built investor/fundraiser flows, reservations, and internal admin tooling used in day-to-day operations.
- Delivered payment and social-login integrations end-to-end via third-party APIs — production error handling, rollout, and live support without a backend team behind me.
- Flexed across product priorities with founders/product — triage, releases, and reliability work as the single backend owner, switching context as the business needed.

### Teaching Assistant at Software Park Code Camp, Bangkok, Thailand

*2020-02 — 2020-09*

*Scope: Supported full-time bootcamp instruction in JavaScript, HTML/CSS, and React fundamentals*

Supported full-time bootcamp cohorts.

- Supported instruction in HTML, CSS, JavaScript, React, Redux, and DOM fundamentals for full-time bootcamp cohorts.

## Education

### Road to Data Engineer 3.0 · 2026 Edition

DataTH · Online (Hybrid live)

*2026-05 — 2026-07*

Structured upskilling toward data/AI engineering — Live Sat 13:00–15:00 · 16 May – 19 Jul 2026 (DataTH). Python, SQL, Spark, GCP, Airflow, BigQuery, visualization; workshops each chapter. Cohort completed 19 July 2026.

### Anthropic Academy

Anthropic · Online

*2025-03 — 2026-04*

Claude 101, Claude Code 101, Claude Code in Action, Introduction to Agent Skills, Introduction to Subagents, Claude API, MCP, Vertex AI — paired with hands-on practice in Cursor and self-directed research into effective AI-assisted development workflows.

### Bachelor of Science (Biology)

Chiang Mai University · Chiang Mai, Thailand

*2012-06 — 2016-05*

## Skills

### Production

**LANGUAGES:** Python, SQL

**FRAMEWORKS:** Django, FastAPI

**DATABASES & STORAGE:** MySQL, GCP Datastore

**CLOUD:** GCP, GCP Cloud Functions, AWS

**DATA ENGINEERING:** ETL/ELT, Data pipelines, Batch processing, CI/CD (GitLab CI, GitHub Actions), Data transform for decisioning/eKYC, Third-party API integrations

**OPS/TOOLS:** Linux shell, Git, Docker

### Working Knowledge

DRF, JavaScript, TypeScript, Nest, Sequelize

### Recent Training (R2DE 3.0 · 2026)

Spark, Airflow, BigQuery

## Contacts

- Phone: +66 (0)84-555-0485
- Email: bhornumnard.w@gmail.com
- LinkedIn: https://www.linkedin.com/in/bhornumnard-wanasrisun/
- GitHub: https://github.com/Bhornumnard
- Portfolio: https://bhornumnard.github.io#data-engineering

---

## Diff summary (TA feedback — KBTG Job 2 Data version)

### Point 1 — Front-load Data Engineer positioning
- **Where:** Profile (opening sentence)
- **Change:** Rewrote lead to `"Python/SQL engineer specializing in data pipelines and ETL-driven integrations, with 5+ years in fintech..."` so **data pipelines** and **ETL** appear in sentence 1; kept court-records, business-registry, decision flows, eKYC, 40–60k DAU, ~99% uptime, R2DE 3.0; swapped Profile `"Owned"` → `"Delivered"` (see Point 4 Owned budget)

### Point 3 — Skills Production sub-categories
- **Where:** Skills → Production
- **Change:** Grouped existing Production skills into LANGUAGES / FRAMEWORKS / DATABASES & STORAGE / CLOUD / DATA ENGINEERING / OPS/TOOLS; Third-party API integrations kept on the DATA ENGINEERING line; Working Knowledge and Recent Training unchanged; no new skills added (GCP listed under CLOUD as platform already present via GCP Datastore / GCP Cloud Functions / Key Skills)

### Point 6 — Add CI/CD evidence (verified)
- **Where:** UpPass Experience (2 bullets), Key Skills, Skills → Production → DATA ENGINEERING
- **Change:**
  1. After COJ/BDEX: added `"Designed and built the GitLab CI/CD pipeline for the BDEX service, automating deployment for the pipeline."` (full ownership — matches independently owned BDEX)
  2. Bank-statement/utility-bill bullet: appended `"; maintained and resolved GitLab CI/CD pipeline issues supporting its deployment."` (troubleshooting — matches co-owned ~50% service)
  3. Key Skills: inserted `CI/CD (GitLab CI)` after ETL/ELT; included BigQuery in the line
  4. DATA ENGINEERING: inserted `CI/CD (GitLab CI, GitHub Actions)` after Batch processing
- **Not added to CV:** personal repo `datapipeline_cicd_github` (GitHub Actions → GCS Airflow DAGs) — deferred to a future Projects section pending README cleanup
- **Hard constraint:** no unverified metrics; ownership verbs on other bullets unchanged

### Point 7 — Verified scale + COJ/BDEX architecture + Asia Verify (KBTG Job 2)
- **Where:** Header badge (no change), UpPass Cloud Functions / COJ-BDEX / bank-statement bullets; synced to `resume-ds.json`
- **Change:**
  1. Badge `"5+ partner APIs"` confirmed as-is (BDEX, Creden, Asia Verify, ComplyAdvantage/AML, BOL) — no number change
  2. Cloud Functions: `"multiple"` → `"4+"`
  3. COJ/BDEX: split architecture — COJ as crawler on upstream source updates; BDEX via partner APIs (including BOL), cached per user request; dropped `"scheduled"`; kept GCP Datastore → decision flows
  4. Bank-statement: added Asia Verify external verification API for international bank statements; kept OCR/LLM + GitLab CI/CD clause
- **Not named in bullets:** Creden, ComplyAdvantage (badge count only); no PH eVerify, Stripe, or unverified throughput numbers
- **Untouched:** Profile, Sinwattana, Education, Contacts, Skills

### Point 4 — Reduce repeated "Owned"
- **Where:** UpPass bullets (3), Sinwattana payment bullet (1), Sinwattana description (keep 1× Owned)
- **Change:**
  1. COJ/BDEX: `"Owned two..."` → `"Designed and delivered two..."`
  2. Cloud Functions: `"Built and owned..."` → `"Developed and maintained..."`
  3. Support loop: `"Owned the technical-support loop..."` → `"Managed the technical-support loop..."`
  4. Sinwattana payments: `"Owned payment..."` → `"Delivered payment..."`
  5. **Kept** single `"Owned"` at Sinwattana description (`Owned delivery end-to-end` — sole-ownership / independently-built context)

### Point 5 — Cut non-JD bullets (Data version only)
- **Where:** UpPass Experience
- **Removed (kept in SE version):**
  1. Rabbit Cash consumer credit product bullet
  2. UpPass credit-coin billing / Stripe bullet
  3. ID OCR / face-recognition cross-team support bullet
- **Kept:** COJ/BDEX, Cloud Functions, bank-statement/utility-bill LLM extraction, DAP/AML, technical-support loop, production monitoring, decision-flow development, cross-team reassignment

### Skipped
- **Point 2 (metrics):** skipped per instruction — waiting on additional data from you
