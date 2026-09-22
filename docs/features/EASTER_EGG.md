# Mini Terminal (Easter Egg)

> A subtle, optional engineering Easter egg — NOT the primary navigation.

---

## Purpose

Add an engineering-flavored hidden feature that rewards exploration. The main website remains a premium editorial portfolio.

---

## Trigger

- **Keyboard:** Backtick key (`` ` ``) or a specific key combination
- **UI:** Small terminal icon in footer or discoverable area
- **Discoverability:** NOT prominently displayed — this is an Easter egg

---

## Layout

```
┌─────────────────────────────────────────────┐
│  [Backdrop overlay]                          │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  $ help                                │  │
│  │                                        │  │
│  │  Available commands:                   │  │
│  │    projects  — View my projects        │  │
│  │    stack     — View my tech stack      │  │
│  │    about     — Learn about me          │  │
│  │    github    — Open GitHub profile     │  │
│  │    contact   — Get in touch            │  │
│  │    clear     — Clear terminal          │  │
│  │    exit      — Close terminal          │  │
│  │                                        │  │
│  │  $ _                                   │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Commands

| Command | Output / Action |
|---------|----------------|
| `help` | List all available commands |
| `projects` | Navigate to `/projects` |
| `about` | Navigate to `/about` |
| `stack` | Print tech stack summary |
| `github` | Open GitHub in new tab |
| `contact` | Navigate to `/contact` |
| `clear` | Clear terminal output |
| `exit` | Close terminal |
| Unknown | `Command not found: [input]. Type "help" for available commands.` |

---

## Visual Style

- **Container:** Dark surface (`bg-bg-primary`), monospace font (`Geist Mono`)
- **Prompt:** `$ ` prefix, accent color cursor
- **Output:** `text-secondary`, lighter than input
- **Width:** Max `640px`, centered
- **Border:** `border-border-default`, `rounded-lg`
- **Cursor:** Blinking block cursor animation

---

## Rules

> [!IMPORTANT]
> - This is NOT the primary navigation
> - Do NOT turn the entire site into a terminal
> - Keep it lightweight — a few commands only
> - The experience should take 30 seconds max
> - Must be closeable easily (Escape, X, `exit` command)
> - Do not overdo the technical gimmick

---

## Technical Requirements

- Client Component (`'use client'`)
- `useState` for command history, input, open/close
- Simple command parser (switch/case or object lookup)
- `useRouter` for navigation commands
- Focus auto-set to input when opened
- Keyboard: Enter to execute, Escape to close
- Scroll to bottom on new output
- Max history: 50 lines (prevent memory issues)
