import { metrics } from './metrics';

const formattedTestRunDate = new Date(`${metrics.testRunDate}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const aboutData = {
  hero: {
    title: 'About Mohammed Ferwana',
    role: 'Backend Engineer',
    summary:
      'Backend Engineer focused on building reliable and well-architected systems. Grounded in computer systems engineering principles, domain-driven boundaries, and evidence-first reliability.',
    highlights: [
      { label: 'Role', value: 'Backend Developer & Team Leader' },
      { label: 'Education', value: 'B.Sc. Computer Systems Engineering (Al-Azhar)' },
      { label: 'Core Focus', value: 'REST APIs, State Machines, Data Modeling' },
      { label: 'Location', value: 'Gaza, Palestine' },
    ],
  },

  story: {
    title: 'From Computer Systems to Backend Architecture',
    subtitle:
      'My progression as an engineer is built on curiosity about how systems behave under the hood, practical project delivery, and technical team leadership.',
    chapters: [
      {
        number: '01',
        title: 'Foundations & Low-Level Discovery',
        period: '2022',
        content:
          'My journey into software engineering began in 2022 when I enrolled in Computer Systems Engineering at Al-Azhar University. Studying data structures, algorithms, operating systems and computer networks demystified how computers actually execute instructions and manage memory. That foundation shaped my preference for server-side engineering: I found myself far more fascinated by what happens behind the API endpoint — data integrity, atomic updates, and state management — than by purely visual interfaces.',
      },
      {
        number: '02',
        title: 'Backend Developer and Team Leader at TAQAT',
        period: '2026',
        content:
          'In the TAQAT CodeMap 2026 program, I served as Backend Developer and Team Leader for TeamLine, a collaborative team workspace platform. I designed REST APIs, implemented workspace role-based access control (RBAC), and built real-time task updates with version-guarded task moves.',
      },
      {
        number: '03',
        title: 'Backend Engineering & Sawn (formerly InsurFlow)',
        period: '2026',
        content:
          `Designing and implementing the backend for Sawn (formerly InsurFlow) — a multi-tenant B2B motor insurance claim management platform — represented a major focus on complex server-side systems. Managing multi-party claims cannot rely on arbitrary database updates; it requires strict lifecycle state machines to prevent illegal state transitions, granular permission middleware, and audit trails. I wrote the test suite: ${metrics.integrationTests} tests passing in ${metrics.testSuites} suites (run ${formattedTestRunDate}).`,
      },
      {
        number: '04',
        title: 'Where I am Heading',
        period: 'Looking Ahead → 2027',
        content:
          'As I continue working toward my expected university graduation in 2027, my engineering trajectory remains focused on reliable backend systems and data integrity. I believe the best engineering is characterized not by complexity, but by simplicity, defensive boundaries, and verifiable proof.',
      },
    ],
  },

  principles: [
    {
      num: '01',
      title: 'Test behavior, not just happy paths',
      tagline: 'Edge cases reveal system quality.',
      description:
        'A system is only as reliable as its error handling. I write automated integration tests targeting unauthorized roles, malformed payloads, state conflicts, and boundary conditions.',
      takeaway: 'True confidence comes from proving how software behaves under failure conditions.',
    },
    {
      num: '02',
      title: 'Take ownership of engineering decisions',
      tagline: 'Explain why, not just what.',
      description:
        'Every technical choice entails tradeoffs. I take ownership by documenting why an architecture or data model was chosen, acknowledging constraints, and guiding team consensus.',
      takeaway: 'Disciplined engineering means taking full responsibility for the tradeoffs you choose.',
    },
  ],
};
