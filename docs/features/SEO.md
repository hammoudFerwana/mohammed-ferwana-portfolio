# SEO Strategy

> Meta tags, Open Graph, structured data, and search engine optimization.

---

## Page Metadata

### Global Defaults

```javascript
const siteMetadata = {
  title: 'Mohammed Ferwana — Backend Engineer',
  description: 'Backend Engineer building scalable systems, reliable APIs, and thoughtful software architecture.',
  siteUrl: 'https://mohammedferwana.dev', // Update with actual domain
  ogImage: '/images/og-image.png',
  locale: 'en_US',
  type: 'website',
};
```

### Per-Page Titles

| Page | Title |
|------|-------|
| Home | `Mohammed Ferwana — Backend Engineer` |
| Projects | `Projects — Mohammed Ferwana` |
| Project (case study) | `InsurFlow — Mohammed Ferwana` |
| About | `About — Mohammed Ferwana` |
| Experience | `Experience — Mohammed Ferwana` |
| Contact | `Contact — Mohammed Ferwana` |
| Engineering Lab | `Engineering Lab — Mohammed Ferwana` |
| 404 | `404 — Page Not Found` |

### Per-Page Descriptions

| Page | Meta Description |
|------|-----------------|
| Home | Backend Engineer building scalable systems, reliable APIs, and thoughtful software architecture. |
| Projects | Engineering projects featuring backend systems, API design, and architecture case studies. |
| About | The engineering journey of Mohammed Ferwana — from software engineering to backend systems and technical leadership. |
| Experience | Professional experience, training, and education in backend engineering and software development. |
| Contact | Get in touch with Mohammed Ferwana for backend engineering, collaboration, or project inquiries. |

---

## Open Graph

```html
<meta property="og:title" content="Mohammed Ferwana — Backend Engineer" />
<meta property="og:description" content="Backend Engineer building scalable systems..." />
<meta property="og:image" content="https://mohammedferwana.dev/images/og-image.png" />
<meta property="og:url" content="https://mohammedferwana.dev" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
```

### OG Image

- **Size:** 1200 × 630px
- **Content:** Name + title + subtle branding
- **Design:** Dark background, large typography, professional
- **Format:** PNG

---

## Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Mohammed Ferwana — Backend Engineer" />
<meta name="twitter:description" content="Backend Engineer building scalable systems..." />
<meta name="twitter:image" content="https://mohammedferwana.dev/images/og-image.png" />
```

---

## Structured Data (JSON-LD)

### Person Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mohammed Ferwana",
  "jobTitle": "Backend Engineer",
  "description": "Backend Engineer building scalable systems, reliable APIs, and thoughtful software architecture.",
  "url": "https://mohammedferwana.dev",
  "email": "mohammedferwana2@gmail.com",
  "sameAs": [
    "https://www.linkedin.com/in/mohammed-ferwana/",
    "https://github.com/hammoudFerwana"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Al-Azhar University"
  }
}
```

### Website Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Mohammed Ferwana — Backend Engineer",
  "url": "https://mohammedferwana.dev"
}
```

---

## Technical SEO

### Robots

```
// public/robots.txt
User-agent: *
Allow: /
Sitemap: https://mohammedferwana.dev/sitemap.xml
```

### Sitemap

Next.js can auto-generate sitemaps. Create `app/sitemap.js`:

```javascript
export default function sitemap() {
  return [
    { url: 'https://mohammedferwana.dev', lastModified: new Date() },
    { url: 'https://mohammedferwana.dev/projects', lastModified: new Date() },
    { url: 'https://mohammedferwana.dev/about', lastModified: new Date() },
    { url: 'https://mohammedferwana.dev/experience', lastModified: new Date() },
    { url: 'https://mohammedferwana.dev/contact', lastModified: new Date() },
    { url: 'https://mohammedferwana.dev/lab', lastModified: new Date() },
    // Dynamic project pages
    ...projects.map((project) => ({
      url: `https://mohammedferwana.dev/projects/${project.slug}`,
      lastModified: new Date(),
    })),
  ];
}
```

### Canonical URLs

Each page should have a canonical URL via Next.js metadata:

```javascript
export const metadata = {
  alternates: {
    canonical: 'https://mohammedferwana.dev/about',
  },
};
```

---

## Semantic HTML Checklist

- [ ] Single `<h1>` per page
- [ ] Logical heading hierarchy (h1 → h2 → h3)
- [ ] `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>` used correctly
- [ ] All images have descriptive `alt` text
- [ ] Links have descriptive text (not "click here")
- [ ] Language attribute: `<html lang="en">`

---

## Verification

After deployment:
- Test OG preview: https://www.opengraph.xyz/
- Test structured data: https://search.google.com/test/rich-results
- Check indexing: Google Search Console
- Validate robots.txt: `https://domain.com/robots.txt`
- Validate sitemap: `https://domain.com/sitemap.xml`
