'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { useAudio } from '@/context/AudioContext';
import { siteMetadata } from '@/data/siteMetadata';
import { techStack } from '@/data/techStack';
import { metrics } from '@/data/metrics';
import { claimFsm } from '@/data/claimFsm';

const AVAILABLE_COMMANDS = [
  'help',
  'status',
  'fsm',
  'metrics',
  'whoami',
  'projects',
  'stack',
  'about',
  'experience',
  'contact',
  'github',
  'linkedin',
  'curl',
  'clear',
  'exit',
];

const QUICK_CHIPS = ['help', 'status', 'fsm', 'metrics', 'projects', 'stack', 'contact', 'clear'];

export default function MiniTerminal() {
  const router = useRouter();
  const { isTerminalOpen, closeTerminal, openTerminal } = useOverlay();
  const { playTerminalKey, playTerminalEnter, playClick, playSuccess, playWarning, playHover } = useAudio();
  const shouldReduceMotion = useReducedMotion();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Mohammed Ferwana — Interactive Engineering Terminal [v2.0.0]' },
    { type: 'system', text: 'Architecture: Clean Architecture • Node.js • Next.js • 26/26 Invariants Verified' },
    { type: 'system', text: 'Type "help" to view commands, click any quick chip below, or press Tab to autocomplete.' },
  ]);

  // Command history for ArrowUp / ArrowDown
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isTerminalOpen]);

  // Auto-scroll to bottom of terminal screen
  useEffect(() => {
    if (isTerminalOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTerminalOpen]);

  // Prevent background body scroll when terminal is open
  useEffect(() => {
    if (!isTerminalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isTerminalOpen]);

  const handleCommand = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    // Record in command history
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryPointer(-1);

    const tokens = raw.toLowerCase().split(/\s+/);
    const cmd = tokens[0];
    const newHistory = [...history, { type: 'input', text: `guest@ferwana-engine:~$ ${raw}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  status     — Live telemetry & system health report
  fsm        — Simulate InsurFlow claim lifecycle transition guards
  metrics    — Verified test suite & concurrency benchmarks
  whoami     — Engineering profile & core specialization
  projects   — List backend systems & navigate to case studies
  stack      — Backend architectures, databases & testing tools
  about      — View engineering background & principles
  experience — Inspect career track record & leadership
  contact    — Connect for engineering roles or contracts
  curl       — Mock curl /api/health endpoint
  github     — Open GitHub profile in new tab
  linkedin   — Open LinkedIn profile in new tab
  clear      — Clear terminal screen buffer
  exit       — Close interactive terminal session`,
        });
        break;

      case 'status':
        newHistory.push({
          type: 'output',
          text: `● ENGINE TELEMETRY REPORT:
  System:         Mohammed Ferwana Engineering Portfolio
  Runtime:        Next.js 14 App Router (Zero-npm Framer Motion & WebGL/Canvas)
  FSM Status:     26/26 Invariants PASSED (100% Deterministic)
  Concurrency:    ${metrics.concurrentRequests} req/burst without sequence collisions
  Integration:    ${metrics.integrationTests} automated tests across ${metrics.testSuites} suites
  Claims Engine:  ${metrics.claimsEngineTests} automated tests across ${metrics.claimsEngineSuites} suites
  Status:         HEALTHY • READY FOR INTERVIEWS & CONTRACTS`,
        });
        break;

      case 'fsm': {
        const transitionTrace = [
          'INIT: Validating InsurFlow Claim Lifecycle FSM...',
          '▶ NEW                 -> PENDING_ACCEPTANCE  [HTTP 200 OK]',
          '▶ PENDING_ACCEPTANCE  -> ASSIGNED            [HTTP 200 OK]',
          '▶ ASSIGNED            -> IN_PROGRESS         [HTTP 200 OK]',
          '▶ IN_PROGRESS         -> SUBMITTED           [HTTP 200 OK]',
          '▶ SUBMITTED           -> UNDER_REVIEW        [HTTP 200 OK]',
          '▶ UNDER_REVIEW        -> APPROVED            [HTTP 200 OK]',
          '▶ APPROVED            -> CLOSED (Terminal)   [HTTP 200 OK]',
          '🛡️ FORBIDDEN CHECK:   NEW -> IN_PROGRESS      [HTTP 409 CONFLICT - REJECTED]',
          `✔ All ${claimFsm.states.length} states, transition guards, and terminal invariants verified.`,
        ].join('\n');
        newHistory.push({ type: 'output', text: transitionTrace });
        break;
      }

      case 'metrics':
        newHistory.push({
          type: 'output',
          text: `● VERIFIABLE ENGINEERING METRICS:
  • Integration Tests:     ${metrics.integrationTests} automated tests (${metrics.testSuites} suites)
  • Claims Engine Tests:   ${metrics.claimsEngineTests} automated tests (${metrics.claimsEngineSuites} suites)
  • FSM States:            ${metrics.fsmStates} deterministic lifecycle states
  • Concurrency Gate:      ${metrics.concurrentRequests} concurrent filings (0 counter collisions)
  • Branch Status:         Passing GitHub Actions CI on '${metrics.ciBadgeBranch}'`,
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'output',
          text: `Mohammed Ferwana — Backend Engineer & Team Leader
Specialization: High-reliability REST APIs, finite state machine lifecycles,
multi-tenant compound database indexing, and automated defensive testing.
Location:       Palestine (Available for remote global roles & contracts)`,
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'output',
          text: `ARCHITECTURAL SYSTEMS:
  1. InsurFlow     — B2B Motor Insurance Claims Engine (FSM, 553 Tests)
  2. TeamLine      — Agile Team Collaboration Workspace (Team Lead)
  3. SAIOS Academy — Modular LMS Progress Evaluation Backend
  4. PCD / PCED    — Non-profit Community Volunteer Coordination

Navigating to /projects...`,
        });
        setTimeout(() => {
          closeTerminal();
          router.push('/projects');
        }, 800);
        break;

      case 'stack': {
        const stackSummary = techStack.categories
          .map((cat) => `[${cat.name}]\n  ${cat.items.map((i) => i.name).join(', ')}`)
          .join('\n\n');
        newHistory.push({ type: 'output', text: stackSummary });
        break;
      }

      case 'about':
        newHistory.push({ type: 'output', text: 'Navigating to /about...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/about');
        }, 500);
        break;

      case 'experience':
        newHistory.push({ type: 'output', text: 'Navigating to /experience...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/experience');
        }, 500);
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `Direct channels:
  Email:    ${siteMetadata.email}
  GitHub:   ${siteMetadata.social.github}
  LinkedIn: ${siteMetadata.social.linkedin}
Navigating to /contact...`,
        });
        setTimeout(() => {
          closeTerminal();
          router.push('/contact');
        }, 600);
        break;

      case 'curl':
        newHistory.push({
          type: 'output',
          text: `HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "UP",
  "engineer": "Mohammed Ferwana",
  "role": "Backend Engineer",
  "fsm_invariants": 26,
  "integration_tests": 553,
  "uptime": "99.99%",
  "tenant_isolation": "verified"
}`,
        });
        break;

      case 'github':
        newHistory.push({ type: 'output', text: 'Opening GitHub profile in new tab...' });
        window.open(siteMetadata.social.github, '_blank', 'noopener,noreferrer');
        break;

      case 'linkedin':
        newHistory.push({ type: 'output', text: 'Opening LinkedIn profile in new tab...' });
        window.open(siteMetadata.social.linkedin, '_blank', 'noopener,noreferrer');
        break;

      case 'clear':
        playSuccess();
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      default:
        playWarning();
        newHistory.push({
          type: 'error',
          text: `Command not found: "${raw}". Type "help" to see available commands or click a chip below.`,
        });
        break;
    }

    if (cmd !== 'clear' && AVAILABLE_COMMANDS.includes(cmd)) {
      playSuccess();
    }

    // Keep history capped at 60 items
    if (newHistory.length > 60) {
      newHistory.splice(0, newHistory.length - 60);
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      playTerminalEnter();
      handleCommand(inputVal);
    } else if (e.key === 'Escape') {
      closeTerminal();
    } else {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
        playTerminalKey();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const nextPointer =
          historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer] || '');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyPointer === -1) return;
        const nextPointer = historyPointer + 1;
        if (nextPointer >= commandHistory.length) {
          setHistoryPointer(-1);
          setInputVal('');
        } else {
          setHistoryPointer(nextPointer);
          setInputVal(commandHistory[nextPointer]);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const current = inputVal.trim().toLowerCase();
        if (!current) return;
        const match = AVAILABLE_COMMANDS.find((cmd) => cmd.startsWith(current));
        if (match) {
          playClick();
          setInputVal(match);
        }
      }
    }
  };

  return (
    <>
      {/* ── Floating HUD Terminal Trigger (Always accessible at bottom right) ── */}
      {!isTerminalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            type="button"
            onClick={openTerminal}
            aria-label="Open Interactive Engineering Terminal"
            title="Open Interactive Terminal (Press ` or Ctrl+Shift+T)"
            className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-bg-secondary/90 hover:bg-bg-elevated border border-border-default hover:border-accent/50 shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
              &gt;_ CLI
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-subtle">
              `
            </span>
          </button>
        </motion.div>
      )}

      {/* ── Interactive Modal Terminal Window ── */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            key="terminal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-bg-primary/85 backdrop-blur-md"
            onClick={closeTerminal}
            role="dialog"
            aria-modal="true"
            aria-label="Interactive Engineering Terminal"
          >
            <motion.div
              key="terminal-window"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 450, damping: 32 }
              }
              className="w-full max-w-3xl rounded-2xl bg-bg-primary/95 border border-border-strong shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[520px] max-h-[85vh] backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary/90 border-b border-border-default select-none">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block hover:opacity-100 transition-opacity" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block hover:opacity-100 transition-opacity" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block hover:opacity-100 transition-opacity" />
                  <span className="ml-2 text-text-muted text-[11px] font-mono tracking-tight hidden sm:inline">
                    guest@ferwana-engine:~/portfolio
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted hidden md:inline">
                    ESC to close • Tab to complete
                  </span>
                  <button
                    type="button"
                    onClick={closeTerminal}
                    aria-label="Close terminal window"
                    className="text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded hover:bg-bg-tertiary transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Quick Command Action Chips */}
              <div className="px-4 py-2 bg-bg-secondary/40 border-b border-border-subtle/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] text-text-muted uppercase tracking-wider shrink-0 mr-1 select-none">
                  Quick:
                </span>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onMouseEnter={playHover}
                    onClick={() => {
                      playClick();
                      setInputVal(chip);
                      handleCommand(chip);
                    }}
                    className="px-2 py-0.5 rounded-md bg-bg-tertiary hover:bg-accent/20 hover:text-accent border border-border-subtle text-[11px] text-text-secondary transition-colors whitespace-nowrap shrink-0"
                  >
                    ${chip}
                  </button>
                ))}
              </div>

              {/* Terminal Screen Output Buffer */}
              <div
                className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-2.5 text-text-secondary leading-relaxed bg-[#0a0a10]/95 selection:bg-accent/30 selection:text-white"
                tabIndex={0}
                aria-label="Terminal output stream"
              >
                {history.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.type === 'input'
                        ? 'text-accent font-semibold flex items-start gap-1.5'
                        : line.type === 'error'
                        ? 'text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-900/30'
                        : line.type === 'system'
                        ? 'text-emerald-400/90 text-[11px]'
                        : 'text-text-primary whitespace-pre-wrap'
                    }
                  >
                    {line.text}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input Command Line */}
              <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary/80 border-t border-border-default">
                <span className="text-emerald-400 font-bold shrink-0">➜</span>
                <span className="text-accent font-medium text-xs hidden sm:inline shrink-0">
                  guest@ferwana:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type command (e.g. status, fsm, projects, help)..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none font-mono text-xs"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => handleCommand(inputVal)}
                  className="px-2.5 py-1 rounded-md bg-accent/20 hover:bg-accent text-accent hover:text-white transition-colors text-xs font-semibold shrink-0"
                >
                  Run
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
