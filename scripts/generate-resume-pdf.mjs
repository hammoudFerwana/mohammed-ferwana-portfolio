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
      margin: 10mm 12mm 10mm 12mm;
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
      line-height: 1.38;
      font-size: 9pt;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .name-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    h1 {
      font-size: 19pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .headline {
      font-size: 10.5pt;
      font-weight: 600;
      color: #0284c7;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 8.2pt;
      color: #4b5563;
      margin-top: 3px;
    }
    .contact-row a {
      color: #4b5563;
      text-decoration: none;
    }
    .contact-row span.sep {
      color: #cbd5e1;
    }
    section {
      margin-bottom: 10px;
    }
    h2 {
      font-size: 9.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h2::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 11px;
      background: #0284c7;
      border-radius: 1px;
    }
    .summary-text {
      color: #334155;
      text-align: justify;
      font-size: 8.5pt;
      line-height: 1.4;
    }
    .item {
      margin-bottom: 7px;
    }
    .item:last-child {
      margin-bottom: 0;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .item-title {
      font-weight: 700;
      font-size: 9.2pt;
      color: #0f172a;
    }
    .item-subtitle {
      font-weight: 600;
      color: #0369a1;
      font-size: 8.6pt;
    }
    .item-meta {
      font-size: 8pt;
      color: #64748b;
      font-weight: 500;
      white-space: nowrap;
    }
    ul.bullets {
      list-style-type: disc;
      padding-left: 15px;
      margin-top: 2px;
    }
    ul.bullets li {
      color: #334155;
      font-size: 8.3pt;
      line-height: 1.35;
      margin-bottom: 2px;
    }
    ul.bullets li strong {
      color: #0f172a;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 135px 1fr;
      row-gap: 4px;
      column-gap: 8px;
      font-size: 8.4pt;
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
      <span><strong>Email:</strong> <a href="mailto:mohammedferwana2@gmail.com">mohammedferwana2@gmail.com</a></span>
      <span class="sep">•</span>
      <span><strong>Location:</strong> Gaza, Palestine (Remote / Async Ready)</span>
      <span class="sep">•</span>
      <span><strong>GitHub:</strong> <a href="https://github.com/hammoudFerwana">github.com/hammoudFerwana</a></span>
      <span class="sep">•</span>
      <span><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/mohammed-ferwana/">linkedin.com/in/mohammed-ferwana</a></span>
    </div>
  </div>

  <section>
    <h2>Professional Summary</h2>
    <p class="summary-text">
      Methodical and reliability-driven Backend Engineer with demonstrated ownership in architecting high-integrity server-side systems, finite state machine (FSM) workflows, and reliable RESTful APIs. Experience leading backend engineering delivery, designing relational and document data schemas (PostgreSQL & MongoDB), enforcing strict role-based access control (RBAC), and authoring comprehensive automated integration test suites. Solid foundation in Computer Systems Engineering principles, algorithm design, and database systems.
    </p>
  </section>

  <section>
    <h2>Technical Skills & Competencies</h2>
    <div class="skills-grid">
      <div class="skill-cat">Backend Runtimes:</div>
      <div class="skill-list">Node.js, Express.js, RESTful API Design, Modular Architecture</div>

      <div class="skill-cat">Databases & Storage:</div>
      <div class="skill-list">MongoDB Atlas, PostgreSQL, Mongoose, Compound Indexing, Data Modeling</div>

      <div class="skill-cat">Architecture & Security:</div>
      <div class="skill-list">Finite State Machines (FSM), Multi-Tenant Isolation, JWT, RBAC, Data Validation, Rate Limiting</div>

      <div class="skill-cat">Testing & Quality:</div>
      <div class="skill-list">Jest, Supertest, In-Memory DB Replicas, Integration Testing, Continuous Integration (CI)</div>

      <div class="skill-cat">DevOps & Tools:</div>
      <div class="skill-list">Docker, Gitflow, GitHub Actions, Postman, Linux / Bash, Clean Architecture</div>
    </div>
  </section>

  <section>
    <h2>Professional Experience & Training</h2>
    
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Backend Developer Trainee</span>
          <span class="item-subtitle"> — Aristo Software (Khireej Qader Program)</span>
        </div>
        <div class="item-meta">May 2026 – Present · Remote</div>
      </div>
      <ul class="bullets">
        <li>Delivering modular backend endpoints and business validation logic following clean architecture principles.</li>
        <li>Designing and optimizing MongoDB queries and data models for internal tooling.</li>
        <li>Participating in technical code reviews, documentation, and agile team workflows.</li>
      </ul>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Backend Developer & Team Leader</span>
          <span class="item-subtitle"> — TAQAT (TeamLine Platform)</span>
        </div>
        <div class="item-meta">2026 · Remote</div>
      </div>
      <ul class="bullets">
        <li><strong>Architecture & Delivery:</strong> Spearheaded backend system architecture for TeamLine, a collaborative project management system, ensuring predictable RESTful API contracts across teams.</li>
        <li><strong>Security & Access Control:</strong> Designed secure authentication with JWT and granular workspace-scoped Role-Based Access Control (RBAC).</li>
        <li><strong>Engineering Leadership:</strong> Conducted sprint planning, technical task estimation, and peer code reviews, accelerating engineering velocity and code consistency.</li>
        <li><strong>System Reliability:</strong> Established centralized error handling pipelines, request sanitization, and database indexing that eliminated duplicate records.</li>
      </ul>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Backend Engineering Fellow</span>
          <span class="item-subtitle"> — Masar Tech</span>
        </div>
        <div class="item-meta">2026 · Remote</div>
      </div>
      <ul class="bullets">
        <li>Accepted to Masar Tech Backend Engineering Bootcamp, Batch 2 (2026).</li>
        <li>Rigorous immersion in backend patterns, modular architecture, database design, and production testing.</li>
      </ul>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Market Ready Developer Program</span>
          <span class="item-subtitle"> — Gaza Sky Geeks (GSG)</span>
        </div>
        <div class="item-meta">2023 – 2024 · Gaza, Palestine</div>
      </div>
      <ul class="bullets">
        <li>Completed rigorous professional immersion centered on full-stack architecture, clean code principles, and PostgreSQL relational database design.</li>
        <li>Architected reliable modular services adhering to separation of concerns, test-driven validation, and professional Gitflow branching workflows.</li>
        <li>Collaborated in pair programming, architectural reviews, and agile sprint cadence.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>Featured Engineering Systems & Projects</h2>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Sawn (formerly InsurFlow)</span>
          <span class="item-subtitle"> — Multi-Tenant B2B Motor Insurance Claim Platform</span>
        </div>
        <div class="item-meta">Sole Backend Engineer · 2026</div>
      </div>
      <ul class="bullets">
        <li><strong>Finite State Machine:</strong> Designed and implemented a deterministic 10-state claim lifecycle state machine preventing invalid status mutations with explicit HTTP 409 conflict handling.</li>
        <li><strong>Multi-Tenant Compound Indexing:</strong> Structured tenant-scoped data isolation in MongoDB Atlas using compound B-tree indexes with organizationId leading keys to guarantee zero data leakage.</li>
        <li><strong>Atomic Concurrency:</strong> Engineered sequential claim numbering (<tt>CLM-ORG-0001</tt>) via atomic counter operations, verified collision-free under automated integration tests.</li>
        <li><strong>Automated Integration Testing:</strong> Authored 616 automated integration tests across 39 test suites with Jest and MongoMemoryServer (run 2026-10-01), validating business invariants.</li>
      </ul>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">TeamLine</span>
          <span class="item-subtitle"> — Collaborative Team Workspace Platform</span>
        </div>
        <div class="item-meta">Backend Developer & Team Leader · 2026</div>
      </div>
      <ul class="bullets">
        <li>Built modular REST API services for workspace membership, task assignment, and activity tracking.</li>
        <li>Enforced schema validation and indexing that sustained rapid query response times without duplication.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>Education</h2>
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">B.Sc. in Computer Systems Engineering</span>
          <span class="item-subtitle"> — Al-Azhar University (CGPA 93.3)</span>
        </div>
        <div class="item-meta">2022 – Expected 2027</div>
      </div>
      <ul class="bullets">
        <li>Core Coursework: Operating Systems, Data Structures & Algorithms, Database Management Systems, Computer Networks, Software Engineering, Discrete Mathematics.</li>
      </ul>
    </div>
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
