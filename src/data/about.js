export const aboutData = {
  hero: {
    eyebrow: 'THE ENGINEER',
    title: 'About Mohammed Ferwana',
    role: 'Backend Engineer',
    summary:
      'Backend Engineer focused on building scalable, reliable, and well-architected systems. Grounded in computer systems engineering principles, domain-driven boundaries, and evidence-first reliability.',
    highlights: [
      { label: 'Role', value: 'Backend Engineer & Team Leader' },
      { label: 'Education', value: 'B.Sc. Computer Systems Engineering (Al-Azhar)' },
      { label: 'Core Focus', value: 'REST APIs, State Machines, Data Modeling' },
      { label: 'Location', value: 'Palestine' },
    ],
  },

  story: {
    eyebrow: 'ENGINEERING JOURNEY',
    title: 'From Computer Systems to Backend Architecture',
    subtitle:
      'My progression as an engineer is built on curiosity about how systems behave under the hood, practical project delivery, and technical team leadership.',
    chapters: [
      {
        number: '01',
        title: 'Foundations & Low-Level Discovery',
        period: '2022',
        content:
          'My journey into software engineering began in 2022 when I enrolled in Computer Systems Engineering at Al-Azhar University. Studying data structures, algorithms, operating systems, and computer architecture demystified how computers actually execute instructions and manage memory. That foundation shaped my preference for server-side engineering: I found myself far more fascinated by what happens behind the API endpoint — data integrity, transactions, and state management — than by purely visual interfaces.',
      },
      {
        number: '02',
        title: 'Practical Immersion & Clean Engineering',
        period: '2023 – 2024',
        content:
          'To bridge academic theory and production software, I joined the Market Ready Developer program at Gaza Sky Geeks (GSG). This intensive immersion pushed me to write clean, modular JavaScript, design relational schemas with PostgreSQL, structure RESTful APIs with Express, and embrace professional Git workflows. It taught me that writing code that works is only the first step; writing code that is readable, maintainable, and testable is what defines professional engineering.',
      },
      {
        number: '03',
        title: 'Engineering Leadership & Delivery at TAQAT',
        period: '2024',
        content:
          'During my time at TAQAT, I took on the responsibility of Backend Developer & Team Leader for TeamLine, a collaborative project management platform. Leading a development team taught me that architectural clarity directly impacts team velocity. By specifying explicit API contracts upfront and establishing role-based access control (RBAC) boundaries early, we eliminated frontend-backend friction and delivered sprint commitments with high confidence.',
      },
      {
        number: '04',
        title: 'Production-Oriented Systems & InsurFlow Backend Ownership',
        period: '2024 – Present',
        content:
          'Designing and implementing the backend for InsurFlow — a B2B motor insurance claim management platform — represented a major focus on complex server-side systems. Managing complex multi-party claims cannot rely on arbitrary database updates; it requires strict lifecycle state machines to prevent illegal state transitions, granular permission middleware, and audit trails. To guarantee system resilience, I authored 553 automated integration tests across 34 test suites, all passing.',
      },
      {
        number: '05',
        title: 'Where I am Heading',
        period: 'Looking Ahead → 2027',
        content:
          'As I continue working toward my expected university graduation in 2027, my engineering trajectory remains focused on scalable distributed systems, event-driven message architectures, database optimization, and high-reliability backend infrastructure. I believe the best engineering is characterized not by complexity, but by simplicity, defensive boundaries, and verifiable proof.',
      },
    ],
  },

  principles: [
    {
      num: '01',
      title: 'Understand before implementing',
      tagline: 'Start with the problem, not the solution.',
      description:
        'Premature coding creates technical debt before the first commit. I prioritize clarifying domain boundaries, requirements, and data relationships before writing implementation code.',
      takeaway: 'Clarity at the problem boundary prevents costly architectural rewrites.',
    },
    {
      num: '02',
      title: 'Prefer simple solutions before complex ones',
      tagline: 'Complexity is a cost, not a feature.',
      description:
        'Every unnecessary abstraction, library, or distributed component adds operational friction. I build the simplest correct solution that meets system requirements cleanly.',
      takeaway: 'Simplicity is a disciplined design choice, not a lack of sophistication.',
    },
    {
      num: '03',
      title: 'Design for maintainability',
      tagline: 'Code is read far more than it is written.',
      description:
        'Software lives and evolves across teams and time. I enforce modular domain separation, explicit naming, and clear boundaries between routing, controllers, services, and persistence.',
      takeaway: 'Maintainable architecture is respectful communication with your future team.',
    },
    {
      num: '04',
      title: 'Validate assumptions',
      tagline: 'Test your understanding, not just your code.',
      description:
        'System failures frequently stem from unverified assumptions about input data or client payloads. I validate all inbound requests at the perimeter with strict schema definitions.',
      takeaway: 'Never assume incoming data conforms to your expectations.',
    },
    {
      num: '05',
      title: 'Test behavior, not just happy paths',
      tagline: 'Edge cases reveal system quality.',
      description:
        'A system is only as reliable as its error handling. I write automated integration tests targeting unauthorized roles, malformed payloads, state conflicts, and boundary conditions.',
      takeaway: 'True confidence comes from proving how software behaves under failure conditions.',
    },
    {
      num: '06',
      title: 'Improve systems based on evidence',
      tagline: 'Optimize what you can measure.',
      description:
        'Intuition is often wrong when diagnosing latency or bottlenecks. I rely on profiler metrics, database explain plans, and measured benchmarks before restructuring queries or indexing.',
      takeaway: 'Measure the actual bottleneck first; never optimize blindly.',
    },
    {
      num: '07',
      title: 'Take ownership of engineering decisions',
      tagline: 'Explain why, not just what.',
      description:
        'Every technical choice entails tradeoffs. I take ownership by documenting why an architecture or data model was chosen, acknowledging constraints, and guiding team consensus.',
      takeaway: 'Senior engineering means taking full responsibility for the tradeoffs you choose.',
    },
  ],

  timeline: [
    {
      year: '2022',
      period: '2022',
      title: 'Enrolled in Computer Systems Engineering',
      organization: 'Al-Azhar University',
      type: 'academic',
      status: 'Completed',
      description:
        'Began B.Sc. studies in Computer Systems Engineering. Built foundational knowledge in discrete mathematics, algorithms, data structures, and computer architecture.',
      highlight: 'Discovered passion for backend systems and low-level computer operation.',
    },
    {
      year: '2023 – 2024',
      period: '2023 – 2024',
      title: 'Market Ready Developer Program',
      organization: 'Gaza Sky Geeks (GSG)',
      type: 'training',
      status: 'Completed',
      description:
        'Completed an intensive professional software development immersion focused on full-stack architecture, clean code principles, PostgreSQL relational modeling, and agile workflows.',
      highlight: 'Transitioned academic knowledge into professional software development practices.',
    },
    {
      year: '2024',
      period: '2024',
      title: 'Backend Developer & Team Leader',
      organization: 'TAQAT (TeamLine)',
      type: 'leadership',
      status: 'Completed',
      description:
        'Spearheaded backend architecture and led engineering delivery for TeamLine. Designed RESTful APIs, enforced workspace role-based access control (RBAC), and conducted PR reviews.',
      highlight: 'Established API contracts and led sprint coordination across the team.',
    },
    {
      year: '2024 – Present',
      period: '2024 – Present',
      title: 'Production-Oriented Systems & InsurFlow Backend Ownership',
      organization: 'Independent Engineering',
      type: 'systems',
      status: 'Active',
      description:
        'Architected the core backend for InsurFlow, a multi-party motor claims management system. Implemented finite state machine transitions, MongoDB indexing, and 553 automated tests.',
      highlight: '553 automated tests across 34 test suites, all passing, verifying financial and claim lifecycles.',
    },
    {
      year: '2027',
      period: 'Expected 2027',
      title: 'Graduation — B.Sc. in Computer Systems Engineering',
      organization: 'Al-Azhar University',
      type: 'academic',
      status: 'Expected',
      description:
        'Anticipated completion of undergraduate engineering curriculum, continuing direct trajectory into high-scale server-side engineering and distributed systems architecture.',
      highlight: 'Expected graduation milestone.',
    },
  ],
};
