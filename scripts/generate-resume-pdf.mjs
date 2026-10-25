import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mohammed Ferwana — Resume</title>
  <style>
    @page {
      size: A4;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.32;
      font-size: 8.5pt;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 5px;
      margin-bottom: 7px;
    }
    .name-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    h1 {
      font-size: 17pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .headline {
      font-size: 9.8pt;
      font-weight: 600;
      color: #0284c7;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 8pt;
      color: #4b5563;
      margin-top: 2px;
    }
    .contact-row a {
      color: #4b5563;
      text-decoration: none;
    }
    .contact-row span.sep {
      color: #cbd5e1;
    }
    section {
      margin-bottom: 7px;
    }
    section:last-of-type {
      margin-bottom: 0;
    }
    h2 {
      font-size: 9.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    h2::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 10px;
      background: #0284c7;
      border-radius: 1px;
    }
    .summary-text {
      color: #334155;
      text-align: justify;
      font-size: 8.2pt;
      line-height: 1.34;
    }
    .item {
      margin-bottom: 5px;
    }
    .item:last-child {
      margin-bottom: 0;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }
    .item-title {
      font-weight: 700;
      font-size: 8.8pt;
      color: #0f172a;
    }
    .item-subtitle {
      font-weight: 600;
      color: #0369a1;
      font-size: 8.3pt;
    }
    .item-meta {
      font-size: 7.8pt;
      color: #64748b;
      font-weight: 500;
      white-space: nowrap;
    }
    .item-sub {
      color: #4b5563;
      font-size: 8pt;
      line-height: 1.28;
      margin-top: 1px;
      margin-bottom: 2px;
    }
    ul.bullets {
      list-style-type: disc;
      padding-left: 14px;
      margin-top: 1px;
    }
    ul.bullets li {
      color: #334155;
      font-size: 8pt;
      line-height: 1.28;
      margin-bottom: 1px;
    }
    ul.bullets li strong {
      color: #0f172a;
    }
    .item-stack {
      color: #4b5563;
      font-size: 7.9pt;
      margin-top: 2px;
      line-height: 1.25;
    }
    .item-stack strong {
      color: #0f172a;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 85px 1fr;
      row-gap: 3px;
      column-gap: 8px;
      font-size: 8pt;
      line-height: 1.28;
    }
    .skill-cat {
      font-weight: 700;
      color: #0f172a;
    }
    .skill-list {
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name-title">
      <h1>MOHAMMED FERWANA</h1>
      <div class="headline">Backend Engineer · Node.js, Express, MongoDB</div>
    </div>
    <div class="contact-row">
      <span>Gaza, Palestine</span>
      <span class="sep">•</span>
      <span><a href="mailto:mohammedferwana2@gmail.com">mohammedferwana2@gmail.com</a></span>
      <span class="sep">•</span>
      <span><a href="https://www.linkedin.com/in/mohammed-ferwana/">linkedin.com/in/mohammed-ferwana</a></span>
      <span class="sep">•</span>
      <span><a href="https://github.com/hammoudFerwana">github.com/hammoudFerwana</a></span>
    </div>
  </div>

  <section>
    <h2>SUMMARY</h2>
    <p class="summary-text">
      Backend Engineer working in Node.js, Express and MongoDB. Sole backend engineer on Sawn, a multi-tenant motor-insurance claims platform: a 10-state claim lifecycle with atomic transitions, tenant isolation from the JWT, per-tenant claim numbering, and 616 passing tests. Computer Systems Engineering student at Al-Azhar University (CGPA 93.3).
    </p>
  </section>

  <section>
    <h2>EXPERIENCE</h2>
    
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Sawn (formerly InsurFlow)</span>
          <span class="item-subtitle"> — Sole Backend Engineer</span>
        </div>
        <div class="item-meta">2026</div>
      </div>
      <div class="item-sub">Multi-tenant B2B SaaS for motor-insurance claims. Team of four: 2 frontend, 1 mobile, 1 backend. API live on Render with MongoDB Atlas.</div>
      <ul class="bullets">
        <li>Designed the 10-state claim lifecycle: every transition is one atomic findOneAndUpdate filtered by organizationId and expected status; invalid moves return 409.</li>
        <li>Enforced tenant isolation: organizationId comes from the JWT, never from the client, and leads every compound index; cross-tenant access returns 404 to prevent ID enumeration.</li>
        <li>Built per-tenant claim numbers (CLM-&lt;ORG&gt;-0001) from an atomic counter; a test creates 15 claims concurrently and checks numbers 1 to 15 with no gaps.</li>
        <li>Found and fixed a project-wide Express 5 bug: req.query is a getter, so validation middleware silently skipped Joi transforms.</li>
        <li>616 tests passing in 39 suites (Jest, Supertest, mongodb-memory-server; run 1 Oct 2026).</li>
      </ul>
      <div class="item-stack"><strong>Stack:</strong> Node.js, Express 5, MongoDB, Mongoose, Joi, JWT, Cloudinary, FCM, Jest</div>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">TAQAT (internship)</span>
          <span class="item-subtitle"> — Backend Developer &amp; Team Leader, TeamLine</span>
        </div>
        <div class="item-meta">2026</div>
      </div>
      <div class="item-sub">TeamLine: team workspace platform with boards and tasks.</div>
      <ul class="bullets">
        <li>Led the team as Team Leader and built the backend.</li>
        <li>Implemented JWT authentication with bcrypt and workspace roles (Lead, Member, Viewer) across 20+ protected endpoints.</li>
        <li>Built boards, tasks, task comments, time tracking, real-time task updates and version-guarded task moves.</li>
      </ul>
      <div class="item-stack"><strong>Stack:</strong> Node.js, Express.js, MongoDB, Mongoose, JWT</div>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Aristo Software</span>
          <span class="item-subtitle"> — Backend Developer Trainee</span>
        </div>
        <div class="item-meta">May 2026 – Present</div>
      </div>
      <div class="item-sub">Khireej Qader program (90 hours).</div>
      <ul class="bullets">
        <li>Building backend endpoints with Node.js and Express.</li>
        <li>Writing MongoDB queries and data models.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>TRAINING</h2>
    
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Gaza Sky Geeks</span>
          <span class="item-subtitle"> — Market Ready Developer program</span>
        </div>
        <div class="item-meta">In progress, completing Nov 2026</div>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Masar Tech</span>
          <span class="item-subtitle"> — Backend Engineering Bootcamp, Batch 2</span>
        </div>
        <div class="item-meta">Accepted, 2026</div>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Udemy</span>
          <span class="item-subtitle"> — The Complete Node.js Developer Course (Jonas Schmedtmann)</span>
        </div>
        <div class="item-meta">2024</div>
      </div>
    </div>
  </section>

  <section>
    <h2>EDUCATION</h2>
    
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Al-Azhar University, Gaza</span>
          <span class="item-subtitle"> — B.Sc. Computer Systems Engineering</span>
        </div>
        <div class="item-meta">2022 – 2027 (expected)</div>
      </div>
      <div class="item-sub">CGPA 93.3</div>
      <div class="item-sub">Coursework: Operating Systems, Data Structures &amp; Algorithms, Database Systems, Advanced Database Systems, Computer Networks, Software Architecture, System Analysis &amp; Design.</div>
    </div>
  </section>

  <section>
    <h2>SKILLS</h2>
    <div class="skills-grid">
      <div class="skill-cat">Languages:</div>
      <div class="skill-list">JavaScript, SQL, Java</div>

      <div class="skill-cat">Backend:</div>
      <div class="skill-list">Node.js, Express.js (Express 5), REST API design, Joi validation</div>

      <div class="skill-cat">Databases:</div>
      <div class="skill-list">MongoDB, Mongoose; PostgreSQL and Sequelize (team projects)</div>

      <div class="skill-cat">Security:</div>
      <div class="skill-list">JWT, bcrypt, role-based access control, rate limiting, Helmet, CORS</div>

      <div class="skill-cat">Testing:</div>
      <div class="skill-list">Jest, Supertest, mongodb-memory-server</div>

      <div class="skill-cat">Tools:</div>
      <div class="skill-list">Git (Gitflow, Conventional Commits), GitHub Actions, Docker (basics), Postman</div>
    </div>
  </section>

  <section>
    <h2>LANGUAGES</h2>
    <p class="summary-text">
      Arabic (native), English (professional working proficiency)
    </p>
  </section>
</body>
</html>
`;

const tempHtmlPath = path.resolve('./temp_resume.html');
const outPdfDir = path.resolve('./public/resume');
const outPdfPath = path.join(outPdfDir, 'Mohammed_Ferwana_Resume.pdf');

if (!fs.existsSync(outPdfDir)) {
  fs.mkdirSync(outPdfDir, { recursive: true });
}

fs.writeFileSync(tempHtmlPath, resumeHtml, 'utf8');

// Try Chrome or Edge
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const bin = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log(`Using browser binary: ${bin}`);
try {
  execSync(
    `"${bin}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outPdfPath}" "${tempHtmlPath}"`,
    { stdio: 'inherit' }
  );
  console.log(`Successfully generated resume PDF at: ${outPdfPath}`);
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
