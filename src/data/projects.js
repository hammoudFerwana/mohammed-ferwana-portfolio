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
    id: 'pal-store',
    slug: 'pal-store',
    title: 'Pal-Store',
    subtitle: 'منصة السوق الفلسطيني (Bab an-Najma) — Multi-Vendor Marketplace',
    description: 'Multi-vendor e-commerce marketplace and Palestinian business directory for the diaspora. Al-Azhar University – Gaza graduation project (2025/2026), supervised by Dr. Abdullah Rihan. Built with Express 5, React 19, MongoDB, and Socket.IO.',
    role: 'Backend & Database Engineer',
    category: 'Marketplace',
    tier: 1,
    featured: true,
    image: '/images/projects/pal-store.png',
    technologies: ['Node.js', 'Express 5', 'MongoDB', 'Mongoose', 'Socket.IO', 'JWT', 'REST APIs', 'Jest', 'Docker'],
    links: {
      github: 'https://github.com/qusaykhudair/pal-store',
      live: null,
      dashboard: null,
    },
    leadership: {
      type: 'collaboration',
      badge: 'Graduation Project',
      label: 'Al-Azhar University – Gaza (2025/2026)',
      description: 'Al-Azhar University – Gaza graduation project supervised by Dr. Abdullah Rihan. Developed collaboratively by Mohammed Hatem Farwana (Backend & Database Engineer), Qusay Zakaria Khudair (Frontend & UI Developer), and Salah Hazem Al-Amassi (Security Architecture & System Integration Lead).',
      responsibilities: [
        'Engineered the core Express 5 REST API architecture encompassing 128 endpoints across 19 domain modules.',
        'Designed multi-vendor database schemas with automatic order splitting per merchant and isolated seller sub-orders.',
        'Implemented product size and variant pricing engine with independent SKU stock counters and low-stock triggers.',
        'Built real-time event broadcasting via Socket.IO for order state tracking and seller inventory notifications.',
        'Authored 242 automated server tests and executed stress testing demonstrating zero errors under 1,000 concurrent virtual users.',
      ],
    },
    problem: 'The ongoing crises in the Gaza Strip forced numerous Palestinian artisans, farmers, and merchant families to relocate operations to Egypt. Displaced merchants face prohibitive brick-and-mortar storefront overhead and fragmented distribution channels, while Palestinian diaspora communities struggle to locate culturally authentic goods. Standard single-vendor platforms cannot handle multi-merchant checkouts, per-seller order fulfillment, or diaspora places directories.',
    solution: 'Constructed an Express 5 & MongoDB backend featuring automated checkout order splitting across distinct merchants, variant-level pricing and stock matrices, smart Arabic search filtering by merchant origin (Gaza, Rafah, Khan Younis), real-time order progression via Socket.IO, and community places indexing.',
    system: 'Coordinates customer checkouts, merchant storefront administration, multi-vendor order routing (Pending → Processing → Shipped → Delivered), and platform moderation across 3 dedicated portals: Customer Storefront, Seller Portal, and Super Admin Command Center.',
    backendOwnership: [
      {
        title: 'Automated Multi-Vendor Order Splitting Engine',
        description: 'Engineered checkout order splitting logic where a single multi-merchant shopping cart is transactionally decomposed into independent vendor sub-orders with isolated fulfillment lifecycles, dedicated tracking numbers, and per-merchant financial accounting.',
      },
      {
        title: 'Multi-Variant Pricing & Stock Matrix',
        description: 'Architected schema models supporting dynamic product sizes (e.g. 250g, 1kg or apparel sizes 26-30), each maintaining independent pricing and atomic inventory counters, with automatic catalog price rollups ("From X EGP").',
      },
      {
        title: 'Real-Time Event Architecture with Socket.IO',
        description: 'Integrated Socket.IO room-based event broadcasting, pushing instantaneous order state transitions to buyers, dispatching low-stock threshold alerts to seller dashboards, and streaming new order notifications.',
      },
      {
        title: 'Origin-Aware Arabic Search & Directory Indexing',
        description: 'Configured compound text and attribute indexes enabling faceted search by category, city, and merchant home origin (Gaza, Rafah, Khan Younis), accompanied by geo-aware directory queries for Palestinian restaurants and businesses.',
      },
      {
        title: 'Defensive Concurrency & Verification Rigor',
        description: 'Implemented atomic findOneAndUpdate stock reservations to prevent overselling during checkout spikes, verified through 242 automated server tests and stress tests under 1,000 concurrent simulated users.',
      },
    ],
    architecture: {
      nodes: [
        {
          id: 'client',
          label: 'Customer & Seller Portals',
          description: 'React 19 & Tailwind client serving shoppers, merchant dashboards, and administrative oversight.',
          type: 'client',
          responsibilities: ['Multi-vendor shopping', 'Merchant inventory management', 'Order dispatching'],
        },
        {
          id: 'gateway',
          label: 'Express 5 API Gateway',
          description: 'REST routing layer handling 128 endpoints across 19 modules, payload validation, and CORS.',
          type: 'api',
          responsibilities: ['Routing dispatch', 'Input validation', 'Standardized response envelopes'],
        },
        {
          id: 'auth',
          label: 'Auth & Merchant Verification',
          description: 'JWT issuance and verification protocols for customers, approved sellers, and system administrators.',
          type: 'auth',
          responsibilities: ['JWT verification', 'Role authorization', 'Merchant documentation approval'],
        },
        {
          id: 'order-engine',
          label: 'Multi-Vendor Order Router',
          description: 'Decomposes unified cart checkouts into merchant sub-orders and tracks independent shipment states.',
          type: 'logic',
          responsibilities: ['Cart decomposition', 'Tracking number generation', 'Coupon validation'],
        },
        {
          id: 'realtime',
          label: 'Socket.IO Notification Engine',
          description: 'Room-scoped WebSocket connections delivering live order updates and inventory alerts.',
          type: 'logic',
          responsibilities: ['Live order telemetry', 'Stock deficit broadcasting', 'Room management'],
        },
        {
          id: 'db',
          label: 'MongoDB Multi-Vendor DB',
          description: 'Document database housing vendors, products with size matrices, orders, and diaspora places.',
          type: 'db',
          responsibilities: ['Compound index execution', 'Atomic inventory reservations', 'Places coordinates'],
        },
      ],
      connections: [
        { from: 'client', to: 'gateway', label: 'HTTPS / REST' },
        { from: 'client', to: 'realtime', label: 'WebSockets / Socket.IO' },
        { from: 'gateway', to: 'auth', label: 'Auth Check' },
        { from: 'gateway', to: 'order-engine', label: 'Checkout Request' },
        { from: 'order-engine', to: 'realtime', label: 'Broadcast Status' },
        { from: 'order-engine', to: 'db', label: 'Atomic Updates' },
      ],
    },
    engineeringDecisions: [
      {
        title: 'Single Cart Checkout with Atomic Order Splitting',
        description: 'Allowed customers to check out items from multiple independent merchants in one unified payment transaction, with server-side transactional decomposition into isolated seller orders.',
        context: 'Preserves seamless consumer purchasing experience while delivering fully segregated inventory and order management per merchant.',
      },
      {
        title: 'Socket.IO Room-Based Scoping vs Polling',
        description: 'Scoped WebSocket rooms by userId and storeId, delivering instant status updates and inventory alerts without repetitive client polling overhead.',
        context: 'Significantly reduces database read pressure while keeping buyer and seller dashboards updated in sub-second latency.',
      },
      {
        title: 'Dynamic Place & Country Storage as Data vs Hardcoded Enums',
        description: 'Stored countries, currencies, and directory places dynamically in MongoDB, allowing administrators to add new host countries (Jordan, Syria, Türkiye) without code refactoring.',
        context: 'Provides architectural flexibility for diaspora geographical expansion beyond Egypt.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Variant-Embedded Subdocuments vs Normalized Variant Collection',
        reasoning: 'Embedded size and pricing variants directly inside the Product document to ensure single-read cache efficiency and atomic stock decrements, while capping variants to realistic limits.',
      },
      {
        decision: 'Local E-Wallets & COD vs International Gateway Locks',
        reasoning: 'Tailored payment handling for local Egyptian e-wallets (InstaPay, Vodafone Cash) and Cash on Delivery with seller confirmation workflows, matching community realities without vendor onboarding friction.',
      },
    ],
    testing: {
      approach: 'Multi-layer testing encompassing automated unit suites, integration API route verifications, and concurrency stress testing.',
      tools: ['Jest', 'Supertest', 'Artillery Load Testing', 'Socket.IO Client'],
      details: 'Maintained 242 server tests and automated all 42 graduation proposal test cases, backed by load benchmarking proving sustained zero-error performance under 1,000 concurrent virtual users.',
      metrics: {
        fullBackend: '242 server tests across 19 API modules; 1000 concurrent users verified',
      },
    },
    whatIWouldImprove: [
      {
        area: 'Automated Escrow & Payout Gateway',
        description: 'Future consideration: Integrate automated bank transfer APIs to automate vendor commission disbursements upon delivery confirmation.',
      },
      {
        area: 'Geospatial Sharding',
        description: 'Future consideration: Implement MongoDB 2dsphere index sharding as the directory expands across Jordan, Syria, and Türkiye.',
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
