export const labTopics = [
  {
    id: 'api-design-patterns',
    title: 'REST API Design Patterns & Idempotency',
    description: 'Investigating REST best practices, idempotency keys for safe retries, structured error schemas, and API versioning strategies.',
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
    title: 'Auth Lifecycles & Role-Based Access Control',
    description: 'Evaluating safe token architectures, token expiration windows, authentication middleware, and RBAC hierarchy validation.',
    status: 'practiced',
    tags: ['security', 'auth', 'jwt', 'rbac'],
    notes: 'Balancing stateless authentication with granular route-level authorization.',
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
  'CI/CD Pipelines',
];
