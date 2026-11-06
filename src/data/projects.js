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
