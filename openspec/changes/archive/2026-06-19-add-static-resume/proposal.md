## Why

The frontend currently shows only a placeholder page. A simple static resume is needed as a baseline so later tasks (API integration, Svelte migration, cloud deployment) have real content to work against. The site will be hosted as static files in an S3 bucket and must not depend on any application server at runtime.

## What Changes

- Replace the placeholder `frontend/index.html` content with a structured resume page populated from Nourez Rawji's resume
- Add a vanilla JavaScript data file (`frontend/js/resume-data.js`) holding resume content as a plain object
- Update `frontend/js/main.js` to render resume sections from that data into the DOM
- Extend `frontend/css/style.css` with minimal readable styling for resume sections (header, experience, skills, etc.)
- Deploy as plain static files (HTML, CSS, JS) uploadable directly to S3 — no frameworks, build step, API calls, or server-side runtime
- Use relative asset paths and classic `<script src>` tags (no ES modules or bundler) so the site works on S3 static website hosting without special server configuration

## Capabilities

### New Capabilities

- `static-resume-page`: A self-contained static resume page, deployable as files to S3, that displays professional profile, qualifications, skills, education, certifications, career highlights, and work experience from structured JS data

### Modified Capabilities

- (none)

## Impact

- `frontend/index.html` — semantic HTML shell with mount points for JS-rendered content
- `frontend/js/main.js` — client-side DOM rendering logic (static asset, not a server)
- `frontend/js/resume-data.js` — new file with resume content (static asset)
- `frontend/css/style.css` — resume layout and typography
- S3 deployment target — `frontend/` contents are the deployable artifact; no server process required in production
- No changes to `api/`, `iac/`, or `packages/shared-types` in this change
