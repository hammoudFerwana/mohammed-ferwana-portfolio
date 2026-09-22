# Command Palette

> Ctrl+K powered quick navigation and actions.

---

## Purpose

Provide a fast, keyboard-accessible command interface that communicates engineering identity. This feels like a developer's tool — not a gimmick.

---

## Trigger

| Platform | Shortcut |
|----------|----------|
| Windows/Linux | `Ctrl + K` |
| macOS | `⌘ + K` |

Also accessible via a subtle search icon in the navbar.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│                  [Backdrop: blur + dark overlay]     │
│                                                     │
│        ┌──────────────────────────────────┐         │
│        │  🔍 Type a command...            │         │
│        │                                  │         │
│        │  ─────────────────────────────── │         │
│        │                                  │         │
│        │  NAVIGATION                      │         │
│        │  → Home                          │         │
│        │  → Projects                      │         │
│        │  → About                         │         │
│        │  → Experience                    │         │
│        │  → Contact                       │         │
│        │  → Engineering Lab               │         │
│        │                                  │         │
│        │  SOCIAL                          │         │
│        │  ↗ GitHub                        │         │
│        │  ↗ LinkedIn                      │         │
│        │                                  │         │
│        │  ACTIONS                         │         │
│        │  ↓ Download Resume               │         │
│        │                                  │         │
│        └──────────────────────────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Commands

| Command | Group | Action | Target |
|---------|-------|--------|--------|
| Home | Navigation | Navigate | `/` |
| Projects | Navigation | Navigate | `/projects` |
| About | Navigation | Navigate | `/about` |
| Experience | Navigation | Navigate | `/experience` |
| Contact | Navigation | Navigate | `/contact` |
| Engineering Lab | Navigation | Navigate | `/lab` |
| GitHub | Social | Open external | https://github.com/hammoudFerwana |
| LinkedIn | Social | Open external | https://linkedin.com/in/mohammed-ferwana/ |
| Download Resume | Actions | Download file | `/resume/...` |

---

## Search / Filtering

- As user types, filter commands in real-time
- Match against command labels (fuzzy matching not required, simple `includes` is fine)
- Empty results: "No commands found"
- Clear input: show all commands

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Ctrl+K` / `⌘+K` | Open palette |
| `Escape` | Close palette |
| `↑` / `↓` | Navigate through commands |
| `Enter` | Execute selected command |
| Type characters | Filter commands |

---

## Interactions

| Element | Behavior |
|---------|----------|
| **Open** | Backdrop fades in, palette slides down with spring ease |
| **Close** | Reverse animation |
| **Hover command** | Subtle background highlight |
| **Active command** | Accent border left indicator |
| **Click outside** | Close palette |
| **Execute command** | Close palette + navigate/action |

---

## Technical Implementation

```jsx
// CommandPalette.jsx — 'use client'
// - useState for open/close, search query, selected index
// - useEffect for keyboard listeners (Ctrl+K, Escape, arrows, Enter)
// - useRouter for navigation
// - Portal rendered at root level
// - Focus trap when open
// - Body scroll lock when open
```

### Performance
- Render only when open (conditional rendering or Portal)
- No external search library needed
- Keyboard event listeners cleaned up on unmount

### Accessibility
- `role="dialog"` with `aria-modal="true"`
- `aria-label="Command palette"`
- Search input auto-focused on open
- Commands are a listbox with `aria-activedescendant`
- Focus trapped inside palette
- Escape to close
- Screen reader: announces "Command palette opened" / "closed"

---

## Visual Style

- **Backdrop:** `bg-black/60 backdrop-blur-sm` (fixed overlay)
- **Palette container:** `bg-bg-elevated border border-border-default rounded-xl`
- **Max width:** `560px`, centered
- **Search input:** Full width, monospace font, no border (just bottom separator)
- **Command items:** `py-3 px-4`, hover: `bg-bg-tertiary`
- **Group labels:** Label style (uppercase, tracking, text-muted)
- **Active item:** Left accent border + subtle bg change
