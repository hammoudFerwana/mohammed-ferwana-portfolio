export const labTopics = [
  {
    id: 'api-design-patterns',
    title: 'REST API Design Patterns & Idempotency',
    description: 'Investigating REST best practices, idempotency keys for distributed safety, structured error schemas (RFC 7807), and API versioning strategies.',
    status: 'practiced',
    tags: ['rest-api', 'architecture', 'api-design'],
    notes: 'Focusing on uniform response formatting, pagination contracts, and robust status code semantics.',
  },
  {
    id: 'db-indexing-patterns',
    title: 'Database Query & Index Optimization',
    description: 'Analyzing explain plans, compound index mechanics, and read-write performance tradeoffs across MongoDB and relational PostgreSQL.',
    status: 'exploring',
    tags: ['database', 'performance', 'mongodb', 'postgresql'],
    notes: 'Profiling query execution times and preventing unindexed collection scans under concurrent load.',
  },
  {
    id: 'auth-security-patterns',
    title: 'Auth Lifecycles & Token Rotation',
    description: 'Evaluating safe token storage architectures, sliding expiration windows, refresh token rotation with reuse detection, and RBAC hierarchy caching.',
    status: 'practiced',
    tags: ['security', 'auth', 'jwt', 'rbac'],
    notes: 'Balancing stateless scalability with instantaneous revocation capabilities.',
  },
  {
    id: 'containerization-workflows',
    title: 'Docker & Multi-Stage Production Builds',
    description: 'Building hardened, non-root multi-stage Docker images for Node.js backends to ensure deterministic runtime environments and minimal surface area.',
    status: 'exploring',
    tags: ['docker', 'devops', 'containers'],
    notes: 'Focusing on fast layer caching and lightweight alpine/distroless base images.',
  },
  {
    id: 'automated-test-pyramids',
    title: 'Integration Test Automation with Jest & Supertest',
    description: 'Designing isolated test databases and fixture seeding strategies to test entire HTTP request lifecycles without mock contamination.',
    status: 'practiced',
    tags: ['testing', 'jest', 'supertest', 'quality'],
    notes: 'Verifying end-to-end authorization barriers and schema validation edge cases.',
  },
  {
    id: 'ci-cd-pipelines',
    title: 'GitHub Actions Automated CI/CD Gates',
    description: 'Constructing automated pipeline gates that enforce code formatting, ESLint verification, automated test suites, and build artifact validations on every pull request.',
    status: 'exploring',
    tags: ['ci-cd', 'github-actions', 'devops'],
    notes: 'Eliminating deployment regressions through branch protection and verified merge conditions.',
  },
];

export const currentlyExploring = [
  'Backend Architecture',
  'System Design',
  'Database Performance',
  'Defensive Testing',
  'Docker & Containerization',
  'CI/CD Pipelines',
];
