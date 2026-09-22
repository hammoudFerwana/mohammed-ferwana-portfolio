export const commandGroups = [
  {
    group: 'Navigation',
    commands: [
      { id: 'nav-home', label: 'Home', shortcut: 'H', action: 'navigate', target: '/', icon: 'House' },
      { id: 'nav-projects', label: 'Projects', shortcut: 'P', action: 'navigate', target: '/projects', icon: 'Folder' },
      { id: 'nav-about', label: 'About', shortcut: 'A', action: 'navigate', target: '/about', icon: 'User' },
      { id: 'nav-experience', label: 'Experience', shortcut: 'E', action: 'navigate', target: '/experience', icon: 'Briefcase' },
      { id: 'nav-contact', label: 'Contact', shortcut: 'C', action: 'navigate', target: '/contact', icon: 'Envelope' },
      { id: 'nav-lab', label: 'Engineering Lab', shortcut: 'L', action: 'navigate', target: '/lab', icon: 'Flask' },
    ],
  },
  {
    group: 'Social & Connect',
    commands: [
      { id: 'social-github', label: 'GitHub Profile', shortcut: 'G', action: 'external', target: 'https://github.com/hammoudFerwana', icon: 'GithubLogo' },
      { id: 'social-linkedin', label: 'LinkedIn Profile', shortcut: 'I', action: 'external', target: 'https://www.linkedin.com/in/mohammed-ferwana/', icon: 'LinkedinLogo' },
      { id: 'social-email', label: 'Send Email', shortcut: 'M', action: 'external', target: 'mailto:mohammedferwana2@gmail.com', icon: 'PaperPlaneTilt' },
    ],
  },
  {
    group: 'Actions & Utilities',
    commands: [
      { id: 'act-resume', label: 'Download Resume', shortcut: 'R', action: 'download', target: '/resume/Mohammed_Ferwana_Resume.pdf', icon: 'FileText' },
      { id: 'act-terminal', label: 'Launch Interactive Terminal', shortcut: 'T', action: 'terminal', target: null, icon: 'Terminal' },
    ],
  },
];
