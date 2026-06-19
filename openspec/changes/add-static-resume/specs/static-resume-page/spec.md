## ADDED Requirements

### Requirement: Deployable as static files to S3

The website SHALL consist only of static files (HTML, CSS, JavaScript) that can be uploaded to an S3 bucket and served via S3 static website hosting or CloudFront without any application server, build step at request time, or server-side rendering.

#### Scenario: Static file deployment

- **WHEN** the contents of `frontend/` are uploaded to an S3 bucket configured for static website hosting
- **THEN** the resume page loads and displays correctly without any server-side process

#### Scenario: No runtime server dependency

- **WHEN** the site is accessed in production
- **THEN** no Node.js process, Express API, or other application server is required to serve or render the page

### Requirement: Relative asset paths

All HTML asset references (CSS, JavaScript, images) SHALL use relative paths so the site works when served from an S3 bucket root without server-side routing or path rewriting.

#### Scenario: Relative paths resolve on S3

- **WHEN** `index.html` is served from the bucket root
- **THEN** linked CSS and JavaScript files load successfully using relative paths (e.g. `css/style.css`, `js/main.js`)

### Requirement: Classic script loading without bundler

JavaScript files SHALL be loaded via ordered classic `<script src>` tags. The site SHALL NOT require ES modules, a bundler, or a transpilation step to run in production.

#### Scenario: Scripts load without module bundler

- **WHEN** `index.html` is opened from S3 static hosting
- **THEN** `resume-data.js` loads before `main.js` and the resume renders without a build pipeline

### Requirement: Resume page displays contact header

The static resume page SHALL display the candidate's name, location, phone number, email address, and LinkedIn profile link at the top of the page.

#### Scenario: Contact header visible on load

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** the page displays "Nourez Rawji" with contact details including Markham ON, phone, email, and LinkedIn link

### Requirement: Resume page displays professional profile

The static resume page SHALL display a professional profile summary paragraph.

#### Scenario: Profile section rendered

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** a "Professional Profile" section is visible with the candidate's summary text

### Requirement: Resume page displays qualifications list

The static resume page SHALL display a bulleted list of summary qualifications.

#### Scenario: Qualifications section rendered

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** a "Summary of Qualifications" section lists at least 5 qualification bullets

### Requirement: Resume page displays technical skills

The static resume page SHALL display technical skills grouped by category (languages, libraries/frameworks, platforms, tools).

#### Scenario: Skills section rendered

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** a "Technical Skills" section shows categorized skill lists including TypeScript, AWS, and Kubernetes

### Requirement: Resume page displays education and certifications

The static resume page SHALL display education history and professional certifications.

#### Scenario: Education and certifications visible

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** an "Education" section shows York University Computer Science (2013–2017)
- **AND** a "Certifications" section shows AWS Certified Cloud Practitioner (April 2023)

### Requirement: Resume page displays career highlights

The static resume page SHALL display a bulleted list of career highlights.

#### Scenario: Career highlights rendered

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** a "Career Highlights" section lists at least 3 highlight bullets including Emids and Jungle Scout achievements

### Requirement: Resume page displays work experience

The static resume page SHALL display professional experience entries with job title, company, location, date range, and accomplishment bullets.

#### Scenario: Experience entries rendered

- **WHEN** a user opens the frontend root page from S3 static hosting
- **THEN** a "Professional Experience" section lists roles at Emids, Jungle Scout, Gore Mutual, Cofax, TD Bank, and Akeelee
- **AND** each entry with bullets in the source resume displays those bullets

### Requirement: Resume content loaded from structured JS data

The resume content SHALL be defined in a dedicated JavaScript data file and rendered into the DOM by `main.js` in the browser without using a frontend framework or any server-side processing.

#### Scenario: Data-driven client-side rendering

- **WHEN** `main.js` executes in the browser on page load
- **THEN** resume sections are populated from `resume-data.js` into the `#resume` mount point
- **AND** no frontend framework runtime or server-side process is involved

### Requirement: No API or network dependency for resume content

The resume page SHALL NOT fetch resume content from an API or external network resource at runtime. All content required to render the page SHALL be present in the deployed static files.

#### Scenario: Offline-capable static content

- **WHEN** the page is served from S3 with no API available
- **THEN** the full resume still renders from local static files only
