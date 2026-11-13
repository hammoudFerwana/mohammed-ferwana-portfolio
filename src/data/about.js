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
      "I'm a backend engineer from Gaza. I build the server side of web and mobile apps with Node.js, Express and MongoDB, and I write tests for the rules that keep the data correct.",
    highlights: [
      { label: 'Role', value: 'Co-founder & Backend Engineer, Sawn' },
      { label: 'Education', value: 'B.Sc. Computer Systems Engineering (Al-Azhar)' },
      { label: 'Core Focus', value: 'REST APIs, State Machines, Data Modeling' },
      { label: 'Location', value: 'Gaza, Palestine' },
    ],
  },

  story: {
    title: 'My story',
    chapters: [
      {
        label: '2022 · Foundations',
        text: 'I started Computer Systems Engineering at Al-Azhar University in 2022. Courses in data structures, operating systems, databases and networks pulled me toward the server side.',
      },
      {
        label: '2026 · TeamLine at TAQAT',
        text: 'In the TAQAT CodeMap 2026 program I was backend developer and team leader for TeamLine. I built the REST API, workspace roles and real-time task updates.',
      },
      {
        label: '2026 · Sawn',
        text: `Sawn started in the Startup MVP Bootcamp, where our team placed 4th. I am a co-founder and the only backend engineer: I built the claim lifecycle, tenant isolation and a suite of ${metrics.integrationTests} passing tests (run ${formattedTestRunDate}).`,
      },
      {
        label: '2027 · Next',
        text: 'I graduate in 2027. I want to keep building backends where the data has to stay correct.',
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
