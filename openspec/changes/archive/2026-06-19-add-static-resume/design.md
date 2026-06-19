## Context

The `frontend/` package will be deployed as static files to an S3 bucket (via S3 static website hosting or CloudFront). It currently contains a placeholder `index.html`, minimal CSS, and a `main.js` that only logs to the console. The README notes this will eventually migrate to Svelte, but for now the stack is vanilla HTML/CSS/JS with no build step.

Resume content is sourced from Nourez Rawji's Word resume and must be represented as structured data so future tasks can swap the data source (API, CMS) without rewriting the page shell.

Local development uses `serve` on port 8080 (`pnpm dev:frontend`). That dev server is **not** part of production — production is file upload to S3 only.

## Goals / Non-Goals

**Goals:**

- Produce a deployable set of static files (`index.html`, CSS, JS) uploadable directly to S3
- Display a complete, readable resume when served from S3 static website hosting or CloudFront
- Separate content (data) from presentation (HTML/CSS) and client-side rendering (JS)
- Use semantic HTML for accessibility and future Svelte porting
- Keep styling minimal but legible on desktop and mobile
- Use relative asset paths so the site works at the bucket root without server-side routing

**Non-Goals:**

- Polished visual design or branding
- PDF export, print-specific layouts, or animations
- API integration, server-side rendering, or dynamic data fetching at runtime
- Framework adoption (React, Svelte, etc.)
- Build pipelines, bundlers, or transpilation
- SEO optimization beyond basic `<title>` and meta viewport

## Decisions

### 1. S3 static file deployment (no server at runtime)

**Choice:** The entire `frontend/` directory is the deployable artifact. Upload files to S3 as-is; no Node process, Express API, or SSR in production.

**Rationale:** Matches the hosting model. S3 serves files; the browser executes client-side JS. This is still "static hosting" — there is no application server.

**Alternative considered:** Server-rendered HTML via a build step — rejected to avoid introducing a build pipeline for a placeholder page.

### 2. Data in a separate `resume-data.js` file

**Choice:** Define a single `resumeData` object as a global variable in `frontend/js/resume-data.js`.

**Rationale:** Keeps `main.js` focused on rendering. Future API work can replace the data file with a fetch call while keeping the same object shape.

**Alternative considered:** Inline data in `main.js` — rejected because it mixes concerns and makes the renderer harder to read.

### 3. Classic script tags, not ES modules

**Choice:** Load `resume-data.js` then `main.js` via ordered `<script src>` tags. `resume-data.js` assigns to a global (e.g. `window.resumeData`); `main.js` reads it.

**Rationale:** ES modules (`import`/`export`) can require correct MIME types and CORS behavior that vary across S3/CloudFront setups. Classic scripts are the most portable option for plain static file hosting with zero server configuration.

**Alternative considered:** ES module `<script type="module">` — rejected for S3 portability; can be revisited when a build step exists.

### 4. Client-side DOM rendering via vanilla JS

**Choice:** `index.html` provides a `<main id="resume">` mount point; `main.js` builds sections with `document.createElement` and `textContent` (not `innerHTML`).

**Rationale:** Matches the no-build-step constraint and is easy to replace when migrating to Svelte components. Rendering runs in the browser only — no server involvement.

**Alternative considered:** All content inlined in static HTML — rejected because it duplicates structure and makes future dynamic loading harder.

### 5. Resume data shape

**Choice:** Top-level fields for contact info, profile text, and arrays for list-based sections:

```js
{
  name, location, phone, email, linkedin,
  profile: string,
  qualifications: string[],
  skills: { languages, libraries, platforms, tools },
  education: { school, degree, dates, details }[],
  certifications: { name, date }[],
  expertise: string[],
  highlights: string[],
  experience: { title, company, location, dates, description?, bullets: string[] }[]
}
```

**Rationale:** Mirrors the resume's natural sections and maps cleanly to DOM structure.

### 6. Minimal CSS extension

**Choice:** Extend existing `style.css` with section spacing, list styles, and a simple two-column skills grid on wider viewports.

**Rationale:** Avoids adding a CSS framework or preprocessor for a temporary page.

## Risks / Trade-offs

- **[Content drift]** Resume data is hardcoded and will become stale → Acceptable for a placeholder; future API task will own freshness
- **[Manual DOM rendering]** Verbose JS compared to a template engine → Acceptable given small page scope and planned Svelte replacement
- **[Incomplete Senior DevOps entry]** Source resume has an empty bullet under current role → Include role header only; omit empty bullets
- **[JS required in browser]** Resume content is rendered client-side → Acceptable; S3 still serves static files and the browser does the work. No server dependency.

## Migration Plan

Deploy by syncing `frontend/` files to the S3 bucket. Rollback is reverting the uploaded files to a prior version. No server restart or migration steps required.

## Open Questions

- None — scope is intentionally minimal
