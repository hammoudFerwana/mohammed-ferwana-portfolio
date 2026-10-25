export const siteMetadata = {
  name: 'Mohammed Ferwana',
  title: 'Backend Engineer',
  tagline: 'Backend engineer. Node.js, Express, MongoDB.',
  description: 'Backend engineer in Gaza building multi-tenant REST APIs with guarded state machines, tenant isolation and tested business rules.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '[VERCEL_URL]',
  email: 'mohammedferwana2@gmail.com',
  location: 'Gaza, Palestine',
  social: {
    linkedin: 'https://www.linkedin.com/in/mohammed-ferwana/',
    github: 'https://github.com/hammoudFerwana',
  },
  ogImage: '/images/portrait.jpg',
  formspreeKey: process.env.NEXT_PUBLIC_FORMSPREE_KEY || '',
};
