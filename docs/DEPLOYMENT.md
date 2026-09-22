# Deployment Guide

> Build, deploy, and maintain Mohammed Ferwana's engineering portfolio on Vercel.

---

## 1. Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | 18.17+ |
| npm | 9+ |
| Git | Latest |
| Vercel Account | Free tier |

---

## 2. Local Development

```bash
# Clone the repository
git clone <repository-url>
cd My_portofolio

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

Development server runs at `http://localhost:3000`.

---

## 3. Environment Variables

### Required for Full Functionality

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form endpoint | [formspree.io](https://formspree.io) |
| `NEXT_PUBLIC_SITE_URL` | Production URL | Your domain |

### Optional

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (if added) |

### `.env.example`

```env
# Contact Form
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id

# Site URL (for SEO canonical URLs)
NEXT_PUBLIC_SITE_URL=https://mohammedferwana.dev
```

---

## 4. Build & Preview

```bash
# Production build
npm run build

# Preview production build locally
npm start

# Lint code
npm run lint
```

### Build Output

The build generates static pages for all routes. Expected output:

```
Route (app)                    Size     First Load JS
┌ ○ /                         X kB     XX kB
├ ○ /about                    X kB     XX kB
├ ○ /contact                  X kB     XX kB
├ ○ /experience               X kB     XX kB
├ ○ /lab                      X kB     XX kB
├ ○ /projects                 X kB     XX kB
├ ● /projects/[slug]          X kB     XX kB
│   ├ /projects/insurflow
│   ├ /projects/teamline
│   ├ /projects/saios-academy
│   └ /projects/pcd-pced
└ ○ /not-found                X kB     XX kB
```

All routes should be `○` (static) or `●` (SSG with params).

---

## 5. Vercel Deployment

### First-Time Setup

1. Push repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" → Select the repository
4. Vercel auto-detects Next.js — no configuration needed
5. Set environment variables in Project Settings → Environment Variables
6. Deploy

### Automatic Deployments

- **Production:** Every push to `main` triggers a production deployment
- **Preview:** Every PR creates a preview deployment with a unique URL

### Custom Domain

1. In Vercel Project Settings → Domains
2. Add custom domain (e.g., `mohammedferwana.dev`)
3. Update DNS records as instructed by Vercel
4. SSL certificate is automatic

---

## 6. Post-Deployment Checklist

- [ ] All routes load correctly
- [ ] Contact form submissions work
- [ ] Resume download works
- [ ] External links (GitHub, LinkedIn) open correctly
- [ ] Mobile layout looks correct
- [ ] Command palette (`Ctrl+K`) works
- [ ] 404 page shows for invalid routes
- [ ] Meta tags / Open Graph previews correct (use [og-image debugger](https://www.opengraph.xyz/))
- [ ] Lighthouse scores meet targets (Perf ≥90, SEO ≥95, A11y ≥95)
- [ ] Vercel Analytics is receiving data

---

## 7. Updating Content

### Add a New Project

1. Edit `src/data/projects.js` — add new project object
2. Add screenshot to `public/images/projects/`
3. Commit and push — Vercel auto-deploys

### Update Resume

1. Replace file in `public/resume/`
2. Keep the same filename to avoid breaking the download link
3. Commit and push

### Update Professional Photo

1. Replace file in `public/images/portrait/`
2. Commit and push

---

## 8. Performance Monitoring

### Vercel Analytics

- Automatically tracks Core Web Vitals
- Dashboard at: Vercel Project → Analytics tab

### Lighthouse

Run periodically:
```bash
npx lighthouse https://mohammedferwana.dev --output html --output-path report.html
```

### Target Metrics

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 100ms |
