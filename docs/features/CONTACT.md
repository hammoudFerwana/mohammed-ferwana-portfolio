# Contact Page

> Contact form with validation, social links, and email integration.

---

## Purpose

Provide a professional, accessible way for recruiters, clients, and collaborators to reach Mohammed.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  LET'S BUILD SOMETHING MEANINGFUL                   │
│  Have a project in mind or want to discuss           │
│  backend engineering? Let's connect.                │
│                                                     │
│  ┌───────────────────────┐  ┌──────────────────┐   │
│  │  CONTACT FORM         │  │  CONNECT         │   │
│  │                       │  │                  │   │
│  │  Name                 │  │  📧 Email        │   │
│  │  [________________]   │  │  mohammedferwana │   │
│  │                       │  │  2@gmail.com     │   │
│  │  Email                │  │                  │   │
│  │  [________________]   │  │  🔗 LinkedIn     │   │
│  │                       │  │  mohammed-       │   │
│  │  Subject              │  │  ferwana         │   │
│  │  [________________]   │  │                  │   │
│  │                       │  │  💻 GitHub       │   │
│  │  Message              │  │  hammoudFerwana  │   │
│  │  [________________]   │  │                  │   │
│  │  [________________]   │  │                  │   │
│  │  [________________]   │  │                  │   │
│  │                       │  │                  │   │
│  │  [Send Message]       │  │                  │   │
│  │                       │  │                  │   │
│  └───────────────────────┘  └──────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Mobile: single column, form on top, social links below.

---

## Contact Form

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | ✅ | Min 2 characters |
| Email | email | ✅ | Valid email format |
| Subject | text | ✅ | Min 3 characters |
| Message | textarea | ✅ | Min 10 characters |

### States

| State | Visual |
|-------|--------|
| **Default** | Empty form, labels visible, no errors |
| **Focused** | Input border changes to accent color |
| **Error** | Red border, error message below field |
| **Submitting** | Button shows loading spinner, form disabled |
| **Success** | Green confirmation message, form resets |
| **Server Error** | Error message with retry suggestion |

### Validation Rules

- **Client-side** validation on blur and submit
- Error messages appear below each field
- Button disabled until all required fields valid
- Email regex: standard pattern (not overly strict)

### Form Submission

**Integration: Formspree**

```javascript
// Submit to Formspree
const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
});
```

- Formspree ID stored in `NEXT_PUBLIC_FORMSPREE_ID` environment variable
- Emails delivered to mohammedferwana2@gmail.com
- CSRF protection handled by Formspree
- No fake submission if Formspree is not configured — show clear error

---

## Social Links

| Platform | URL | Icon |
|----------|-----|------|
| Email | mailto:mohammedferwana2@gmail.com | Envelope |
| LinkedIn | https://www.linkedin.com/in/mohammed-ferwana/ | LinkedIn logo |
| GitHub | https://github.com/hammoudFerwana | GitHub logo |

- External links open in new tab with `rel="noopener noreferrer"`
- Hover: subtle background + accent border
- Each link shows platform name + handle/email

---

## Accessibility

- All form fields have associated `<label>` elements
- Error messages linked via `aria-describedby`
- Focus states clearly visible
- Tab order: Name → Email → Subject → Message → Submit
- Success/error announcements via `aria-live="polite"`
- Submit button has descriptive text (not just "Submit")

---

## Technical Requirements

- Client Component (`'use client'`) for form state management
- `useState` for field values, validation errors, submission state
- Formspree integration via environment variable
- If no Formspree ID configured: show `mailto:` link as fallback
- Responsive: full-width form on mobile
- Loading spinner on submit button (no third-party spinner library)
