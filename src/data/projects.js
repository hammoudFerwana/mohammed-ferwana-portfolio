import { metrics } from './metrics';

const formattedTestRunDate = new Date(`${metrics.testRunDate}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const projects = [
  {
    id: 'insurflow',
    slug: 'insurflow',
    title: 'Sawn',
    subtitle: 'formerly InsurFlow',
    description: 'Multi-tenant B2B motor-insurance claims platform. Sole backend engineer in a team of four (2 frontend, 1 mobile, 1 backend).',
    role: 'Backend Engineer (Sole Backend)',
    category: 'B2B Claims Engine',
    tier: 1,
    featured: true,
    image: '/images/projects/insurflow.jpg',
    technologies: ['Node.js', 'Express.js', 'MongoDB Atlas', 'Mongoose', 'JWT', 'RBAC', 'REST APIs', 'Jest'],
    links: {
      github: null,
      live: null,
      dashboard: 'https://insurflow-dashboard.vercel.app',
    },
    problem: 'Motor insurance claims processing involves disconnected stakeholders across tenant organizations. Standard implementations risk out-of-order state transitions, cross-tenant data exposure, and sequence collisions during concurrent claim filings.',
    solution: `Engineered a modular backend architecture featuring a ${metrics.fsmStates}-state claim lifecycle finite state machine, tenant-scoped compound indexing, atomic sequential numbering, and automated integration test suites.`,
    system: 'Sawn coordinates claim filing, field damage assessment, and claims officer review with deterministic transition guards, an append-only claim timeline, and isolated multi-tenant data access across 3 roles: ADMIN, CLAIMS_OFFICER, and FIELD_ADJUSTER.',
    backendOwnership: [
      {
        title: 'State Machine Lifecycle Engine',
        description: 'Implemented the claim lifecycle finite state machine in claim.service.js with transition guards and deterministic HTTP 409 INVALID_STATUS_TRANSITION responses.',
      },
      {
        title: 'Multi-Tenant Data Modeling & Indexing',
        description: 'Designed tenant-scoped claim access patterns and compound B-tree indexes using organizationId as the leading scope field to enforce query isolation.',
      },
      {
        title: 'Atomic Sequential Claim Numbering',
        description: 'Implemented tenant-scoped sequential claim numbering (CLM-<ORG>-0001) using atomic counter increments, verified under automated integration tests without collisions or sequence gaps.',
      },
      {
        title: 'Cross-Tenant Resource Masking',
        description: 'Implemented repository-level tenant checks that return HTTP 404 CLAIM_NOT_FOUND rather than 403 Forbidden for cross-tenant access attempts to prevent ID enumeration.',
      },
      {
        title: 'Automated Integration Testing',
        description: 'Authored and maintained automated integration test suites using Jest, Supertest, and MongoMemoryServer, validating business rules against an in-memory MongoDB (mongodb-memory-server).',
      },
    ],
    architecture: {
      nodes: [
        {
          id: 'client',
          label: 'Client Applications',
          description: 'Web dashboard used by claims officers and Flutter mobile app used by field adjusters.',
          type: 'client',
          responsibilities: ['Claims officer web dashboard', 'Field adjuster Flutter app', 'Claim lifecycle tracking'],
        },
        {
          id: 'gateway',
          label: 'API & Routing Layer',
          description: 'Express.js router handling rate limiting, CORS, payload validation, and request dispatching (hosted on Render).',
          type: 'api',
          responsibilities: ['Route dispatching', 'Input sanitization', 'Global error mediation'],
        },
        {
          id: 'auth',
          label: 'Auth & RBAC Service',
          description: 'JWT issuance and granular role evaluation for ADMIN, CLAIMS_OFFICER, and FIELD_ADJUSTER.',
          type: 'auth',
          responsibilities: ['JWT verification', 'Role authorization (ADMIN, CLAIMS_OFFICER, FIELD_ADJUSTER)', 'Tenant scoping'],
        },
        {
          id: 'claims-engine',
          label: 'Claims Core Logic',
          description: 'Business rules for the claim state machine, adjuster capacity (3 active claims) and loss assessment with deductible rules.',
          type: 'logic',
          responsibilities: ['State transition enforcement', 'Document linkage', 'Audit logging'],
        },
        {
          id: 'data-layer',
          label: 'Data Access Layer',
          description: 'Mongoose abstraction models with strict schema constraints and indexing strategies.',
          type: 'data',
          responsibilities: ['Query abstraction', 'Index optimization', 'Atomic, tenant-scoped updates'],
        },
        {
          id: 'db',
          label: 'MongoDB Atlas',
          description: 'Document database housing claims, policy references, user identities, and history logs hosted on MongoDB Atlas.',
          type: 'db',
          responsibilities: ['Persistent storage', 'Compound index lookup', 'Audit log retention'],
        },
      ],
      connections: [
        { from: 'client', to: 'gateway', label: 'HTTPS / REST' },
        { from: 'gateway', to: 'auth', label: 'Auth Check' },
        { from: 'gateway', to: 'claims-engine', label: 'Dispatch' },
        { from: 'claims-engine', to: 'data-layer', label: 'CRUD' },
        { from: 'data-layer', to: 'db', label: 'Queries' },
      ],
    },
    engineeringDecisions: [
      {
        title: 'Deterministic Finite State Machine (FSM)',
        description: 'Enforced claim status transitions through a validated state machine in claim.service.js rather than arbitrary database updates, rejecting out-of-order mutations with HTTP 409 INVALID_STATUS_TRANSITION.',
        context: 'Enforces that claims cannot bypass mandatory review stages while appending structured audit events to the timeline.',
      },
      {
        title: 'Multi-Tenant Data Modeling & Compound Indexing',
        description: 'Structured Mongoose schemas with organizationId as the leading field in all compound indexes ({ organizationId: 1, claimNumber: 1 }, { organizationId: 1, createdAt: -1, status: 1 }).',
        context: 'Aligns database B-tree indexes directly with tenant-scoped query patterns, ensuring query execution plans use efficient index-bounded lookups for primary tenant queries.',
      },
      {
        title: 'Atomic Sequential Claim Numbering',
        description: 'Tenant-scoped claim numbers (CLM-<ORG>-0001) from a per-organization counter, incremented with one atomic findOneAndUpdate and $inc, backed by a compound unique index { organizationId: 1, claimNumber: 1 }.',
        context: 'Prevents duplicate number collisions across parallel filings while maintaining separate sequential counters per tenant organization.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Embedded vs. Referenced Document Schema in MongoDB',
        reasoning: 'Embedded the claim timeline in the claim document, so one read returns the claim with its history. User accounts are referenced, not copied.',
      },
      {
        decision: 'Stateless JWT Authentication vs Stateful Server Sessions',
        reasoning: 'Signed JWTs (HS256, 8-hour expiry) carry the user role and organizationId, so the API needs no session store.',
      },
    ],
    testing: {
      approach: 'Defensive integration testing targeting state transitions, concurrency safety, cross-tenant isolation, and API error contracts.',
      tools: ['Jest', 'Supertest', 'MongoMemoryServer'],
      details: 'Automated test suite running against an in-memory MongoDB with real indexes and per-test collection clearing, validating failure conditions and business invariants.',
      metrics: {
        fullBackend: `${metrics.integrationTests} automated tests across ${metrics.testSuites} suites (run ${formattedTestRunDate})`,
      },
    },
    whatIWouldImprove: [
      {
        area: 'Asynchronous Event Pipeline',
        description: 'Future consideration: Integrate an asynchronous message queue (e.g. RabbitMQ) for long-running notifications, webhook callbacks, and PDF report generation.',
      },
      {
        area: 'Caching Layer',
        description: 'Future consideration: Introduce caching for frequently accessed policy catalogs and lookup metadata to reduce database round-trips.',
      },
    ],
  },
  {
    id: 'saios-academy',
    slug: 'saios-academy',
    title: 'SAIOS Academy',
    subtitle: 'Enterprise LMS & Course Progression Engine',
    description: 'Enterprise Learning Management System (LMS) backend for programming and professional education. Co-developed with Eng. Qusay Khudair, architecting enrollment lifecycles, curriculum engines, and security hardening.',
    role: 'Backend Engineer (Co-developer with Eng. Qusay Khudair)',
    category: 'Education',
    tier: 1,
    featured: true,
    image: '/images/projects/saios-academy.jpg',
    technologies: ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Mongoose', 'JWT', 'Zod', 'Winston', 'Jest', 'REST APIs'],
    links: {
      github: 'https://github.com/hammoudFerwana/saios-academy',
      live: null,
      dashboard: null,
    },
    leadership: {
      type: 'collaboration',
      badge: 'Collaboration',
      label: 'Co-Development with Eng. Qusay Khudair',
      description: 'Engineering collaboration with Eng. Qusay Khudair on the SAIOS Academy enterprise LMS. The project was developed jointly, with Eng. Qusay Khudair establishing the project foundation and base monorepo architecture, and Mohammed Ferwana engineering the core backend domain modules, enrollment state machine, curriculum services, and security hardening.',
      responsibilities: [
        'Collaborated with Eng. Qusay Khudair on system architecture, API contracts, and domain boundary design.',
        'Architected and implemented the atomic 4-state enrollment lifecycle (Pending, Approved, Rejected, Cancelled) with concurrency guards.',
        'Built course publishing lifecycle state machine (Draft, PendingReview, Published, Archived) and validatePublishingReadiness validator.',
        'Engineered curriculum management (Sections & Lessons) with deterministic order persistence and cascade deletion safety.',
        'Implemented API-layer content gating and video streaming redaction in syllabus endpoints for unauthorized viewers.',
        'Hardened authentication security with brute-force lockout, refresh token rotation in HTTP-only cookies, and Zod payload validation.',
      ],
    },
    problem: 'Enterprise educational platforms demand deterministic course progression, strict access gating for paid content, and resilient enrollment workflows. Uncontrolled state changes risk granting unauthorized access to copyrighted videos, exposing private syllabus assets, and causing duplicate enrollment race conditions during peak registration windows.',
    solution: 'Constructed an Express & TypeScript backend architecture featuring an atomic 4-state enrollment lifecycle engine (findOneAndUpdate with transitionStatus guards), compound unique indexes for duplicate prevention, cascade-safe curriculum hierarchies, and video asset redaction for unauthorized viewers.',
    system: 'Coordinates course authoring, multi-stage publishing workflows (Draft → PendingReview → Published → Archived), hierarchical curriculum management (Sections & Lessons), and gated student access across 4 RBAC roles: Super Admin, Admin, Instructor, and Student.',
    backendOwnership: [
      {
        title: 'Atomic Enrollment State Machine',
        description: 'Engineered the 4-state enrollment lifecycle (Pending, Approved, Rejected, Cancelled) using atomic findOneAndUpdate status transitions, eliminating race conditions and preventing duplicate enrollments via compound unique database indexes.',
      },
      {
        title: 'Course Publishing Lifecycle & Readiness Gates',
        description: 'Implemented a strict publishing state machine enforcing validatePublishingReadiness (validating category, instructor, pricing, thumbnail, and non-empty curriculum sections) before public catalog exposure.',
      },
      {
        title: 'Curriculum Hierarchy & Cascade Deletion',
        description: 'Built section and lesson management with deterministic order persistence, cascade deletion handling from sections to child lessons, and relational integrity validation across course boundaries.',
      },
      {
        title: 'Content Gating & Video Asset Redaction',
        description: 'Implemented gated content delivery at the API layer, redacting protected video URLs and learning resources in syllabus endpoints for un-enrolled students and unauthenticated viewers.',
      },
      {
        title: 'Security Hardening & Refresh Token Rotation',
        description: 'Implemented brute-force lockout protection, HTTP-only refresh token rotation, IDOR prevention on instructor course mutation, and centralized error envelopes ({ success, message, data, errors, statusCode }).',
      },
    ],
    architecture: {
      nodes: [
        {
          id: 'client',
          label: 'LMS Web Client',
          description: 'Next.js 15 frontend with Arabic/English i18n and student/instructor portal views.',
          type: 'client',
          responsibilities: ['Course browsing', 'Video player interactions', 'Enrollment checkout'],
        },
        {
          id: 'gateway',
          label: 'Express & Security Gateway',
          description: 'Versioned /api/v1 router enforcing Helmet, CORS caching, rate limiting, and Winston logging.',
          type: 'api',
          responsibilities: ['Rate limiting', 'Zod payload validation', 'Standardized error envelopes'],
        },
        {
          id: 'auth',
          label: 'Auth & RBAC Service',
          description: 'JWT issuance with refresh token rotation and 4-tier role hierarchy (Super Admin, Admin, Instructor, Student).',
          type: 'auth',
          responsibilities: ['Token rotation', 'Brute-force lockout', 'IDOR & ownership checks'],
        },
        {
          id: 'enrollment-engine',
          label: 'Enrollment & Access Engine',
          description: 'Atomic enrollment state transitions, FIFO review queues, and content gating filters.',
          type: 'logic',
          responsibilities: ['State transition guards', 'Duplicate prevention', 'Protected asset redaction'],
        },
        {
          id: 'curriculum-service',
          label: 'Curriculum & Catalog Core',
          description: 'Sections and lessons CRUD, deterministic reordering, and publishing readiness validator.',
          type: 'logic',
          responsibilities: ['Publishing lifecycle', 'Cascade deletions', 'Catalog query optimization'],
        },
        {
          id: 'db',
          label: 'MongoDB Database',
          description: 'Mongoose schemas with compound indexes for FIFO review and { status: 1, createdAt: -1 } catalog queries.',
          type: 'db',
          responsibilities: ['Atomic updates', 'Compound unique constraints', 'Document persistence'],
        },
      ],
      connections: [
        { from: 'client', to: 'gateway', label: 'HTTPS / REST' },
        { from: 'gateway', to: 'auth', label: 'Auth & RBAC' },
        { from: 'gateway', to: 'enrollment-engine', label: 'Enrollment Flow' },
        { from: 'gateway', to: 'curriculum-service', label: 'Curriculum CRUD' },
        { from: 'enrollment-engine', to: 'db', label: 'Atomic Updates' },
        { from: 'curriculum-service', to: 'db', label: 'Queries & Aggregations' },
      ],
    },
    engineeringDecisions: [
      {
        title: 'Atomic findOneAndUpdate vs Distributed Locks for Enrollments',
        description: 'Utilized atomic findOneAndUpdate transitions with condition checks and compound unique indexing at the database level rather than heavyweight external distributed locks.',
        context: 'Guarantees zero duplicate enrollments and consistent status transitions under concurrent student checkout attempts.',
      },
      {
        title: 'API-Level Video Redaction vs Separate Public DTOs',
        description: 'Implemented selective field redaction in curriculum serialization, hiding video streaming URLs and download links for non-enrolled viewers while reusing single normalized syllabus queries.',
        context: 'Prevents syllabus scraping and video leakage while keeping payload sizes compact and queries unified.',
      },
      {
        title: 'Compound Indexing for Catalog & Review Sorting',
        description: 'Indexed courses by { status: 1, createdAt: -1 } and full-text slug searches, alongside FIFO enrollment review indexes ({ status: 1, createdAt: 1 }).',
        context: 'Eliminates in-memory sorting overhead in MongoDB for public catalog lookups and administrative review queues.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Embedded Lesson Metadata vs Dedicated Collections',
        reasoning: 'Separated Sections and Lessons into dedicated collections linked by courseId and sectionId rather than deeply embedding all lectures in one massive Course document, avoiding document size limits (16MB) and enabling granular lesson updates.',
      },
      {
        decision: 'HTTP-only Cookie Refresh Tokens vs Pure Header Storage',
        reasoning: 'Placed refresh tokens in secure, same-site HTTP-only cookies while transmitting short-lived access tokens via authorization headers, mitigating XSS token theft vectors.',
      },
    ],
    testing: {
      approach: 'Automated unit and integration testing covering curriculum services, publishing readiness validations, enrollment concurrency, and access authorization.',
      tools: ['Jest', 'Supertest', 'Mongoose Mock / In-Memory'],
      details: 'Authored comprehensive test suites (over 120 automated test assertions across courses, categories, sections, lessons, and enrollment controllers) verifying HTTP status contracts, IDOR guards, and state machine transition rejections.',
      metrics: {
        fullBackend: '120+ automated tests across curriculum and enrollment services',
      },
    },
    whatIWouldImprove: [
      {
        area: 'Asynchronous Video Transcoding & Webhooks',
        description: 'Future consideration: Connect Cloudinary/MUX video webhooks to asynchronously transcode instructor uploads and generate adaptive HLS/DASH video streams.',
      },
      {
        area: 'Quiz & Certificate Engine',
        description: 'Future consideration: Implement dynamic quiz grading pipelines and automated vector PDF certificate generation upon 100% course completion.',
      },
    ],
  },
  {
    id: 'teamline',
    slug: 'teamline',
    title: 'TeamLine',
    description: 'Team workspace platform built during the TAQAT internship (2026).',
    role: 'Backend Developer & Team Leader',
    category: 'Platform',
    tier: 1,
    featured: true,
    image: '/images/projects/teamline.jpg',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'RBAC', 'REST APIs'],
    links: {
      github: null,
      live: 'https://team-line-frontend-eight.vercel.app/',
      dashboard: null,
    },
    problem: 'Small teams track tasks across scattered tools, so ownership and status get lost.',
    solution: 'Backend for workspaces, boards and tasks with role-based access (Lead, Member, Viewer), task comments, real-time task updates and version-guarded task moves.',
    system: "Modular API controllers and workspace-level access control keep each team's data separate.",
    architecture: {
      nodes: [
        {
          id: 'client',
          label: 'TeamLine Web App',
          description: 'React frontend for team boards and task lists.',
          type: 'client',
          responsibilities: ['Kanban interactions', 'Task editing', 'Member management'],
        },
        {
          id: 'gateway',
          label: 'Express API Server',
          description: 'RESTful API service providing task, board, and collaboration endpoints.',
          type: 'api',
          responsibilities: ['API routing', 'Auth parsing', 'Payload validation'],
        },
        {
          id: 'auth',
          label: 'Auth & Workspace RBAC',
          description: 'Secures team boundaries and manages user roles (Team Lead, Member, Viewer).',
          type: 'auth',
          responsibilities: ['Workspace token validation', 'Role permissions'],
        },
        {
          id: 'services',
          label: 'Workspace & Task Service',
          description: 'Manages boards, tasks, assignments and task comments.',
          type: 'logic',
          responsibilities: ['Board operations', 'Task state handling', 'Member assignment'],
        },
        {
          id: 'db',
          label: 'MongoDB Database',
          description: 'Houses workspace entities, board data, comment streams, and user profiles.',
          type: 'db',
          responsibilities: ['Data persistence', 'Query execution'],
        },
      ],
      connections: [
        { from: 'client', to: 'gateway', label: 'HTTP / REST' },
        { from: 'gateway', to: 'auth', label: 'Validate Token' },
        { from: 'gateway', to: 'services', label: 'Invoke Logic' },
        { from: 'services', to: 'db', label: 'Store & Query' },
      ],
    },
    engineeringDecisions: [
      {
        title: 'Role-Based Workspace Boundaries',
        description: 'Designed multi-tenant workspace isolation at the query level, ensuring users can only interact with resources belonging to their assigned team workspaces.',
        context: 'Prevents accidental data leakage across teams sharing the same database.',
      },
      {
        title: 'API Contracts & Workspace Boundaries',
        description: 'Established explicit frontend/backend API contracts early, ensuring clear interface boundaries between team members.',
        context: 'Served as Team Leader during the TAQAT internship (2026).',
      },
    ],
    leadership: {
      description: 'Served as Backend Developer and Team Leader during the TAQAT internship (2026), building TeamLine.',
      responsibilities: [
        'Designed REST APIs and defined endpoint specifications.',
        'Implemented workspace role-based access control (RBAC).',
        'Built real-time task updates and version-guarded task moves.',
      ],
    },
    tradeoffs: [
      {
        decision: 'Normalized Task Records vs. Single Board Document',
        reasoning: 'Stored each task as its own document with an indexed board ID, so a board never becomes one large document and tasks update one at a time.',
      },
    ],
    whatIWouldImprove: [
      {
        area: 'Board Presence',
        description: 'Future consideration: show which teammates are viewing a board, on top of the existing real-time task updates.',
      },
    ],
  },
];
