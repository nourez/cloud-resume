## 1. Resume Data

- [x] 1.1 Create `frontend/js/resume-data.js` defining a global `resumeData` object with contact info, profile, qualifications, skills, education, certifications, expertise, highlights, and experience arrays sourced from the resume docx
- [x] 1.2 Verify all experience entries match source resume content (skip empty bullet lists for roles with no bullets)

## 2. HTML Shell

- [x] 2.1 Update `frontend/index.html` to use `<main id="resume">` as the mount point and set page title to candidate name
- [x] 2.2 Load scripts via ordered classic `<script src>` tags (`resume-data.js` before `main.js`) with relative paths — no ES modules
- [x] 2.3 Ensure all asset references (CSS, JS) use relative paths suitable for S3 static hosting

## 3. Rendering Logic

- [x] 3.1 Implement `frontend/js/main.js` to read `resumeData` and render contact header with clickable email and LinkedIn links
- [x] 3.2 Add render functions for each section: profile, qualifications, skills (grouped), education, certifications, career highlights, and professional experience
- [x] 3.3 Use `document.createElement` and `textContent` for all DOM construction (no `innerHTML`)

## 4. Styling

- [x] 4.1 Extend `frontend/css/style.css` with section headings, list spacing, experience entry layout, and a simple skills grid for wider viewports
- [x] 4.2 Ensure readable layout on mobile (single column, adequate padding)

## 5. Verification

- [x] 5.1 Run `pnpm dev:frontend` locally and confirm the resume renders completely at `http://localhost:8080`
- [x] 5.2 Confirm the site requires no API calls or server-side rendering — all content comes from static files in `frontend/`
- [x] 5.3 Spot-check all sections against the source resume for missing or incorrect content
