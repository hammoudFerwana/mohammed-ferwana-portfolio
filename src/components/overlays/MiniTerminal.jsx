'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/context/OverlayContext';
import { siteMetadata } from '@/data/siteMetadata';
import { techStack } from '@/data/techStack';

export default function MiniTerminal() {
  const router = useRouter();
  const { isTerminalOpen, closeTerminal } = useOverlay();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Mohammed Ferwana — Interactive Terminal [v1.0.0]' },
    { type: 'system', text: 'Type "help" to view available commands, or "exit" to quit.' },
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTerminalOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: `$ ${cmdText}` }];

    switch (trimmed) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `Available commands:
  projects   — Navigate to projects & case studies
  stack      — Inspect backend technologies & architecture skills
  about      — View engineering background & philosophy
  experience — Inspect professional background & leadership
  contact    — Reach out / schedule a call
  github     — Open GitHub profile in new tab
  linkedin   — Open LinkedIn profile in new tab
  clear      — Clear terminal screen
  exit       — Close this terminal session`,
        });
        break;

      case 'projects':
        newHistory.push({ type: 'output', text: 'Redirecting to /projects...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/projects');
        }, 500);
        break;

      case 'stack': {
        const stackSummary = techStack.categories
          .map((cat) => `[${cat.name}]\n  ${cat.items.map((i) => i.name).join(', ')}`)
          .join('\n\n');
        newHistory.push({ type: 'output', text: stackSummary });
        break;
      }

      case 'about':
        newHistory.push({ type: 'output', text: 'Redirecting to /about...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/about');
        }, 500);
        break;

      case 'experience':
        newHistory.push({ type: 'output', text: 'Redirecting to /experience...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/experience');
        }, 500);
        break;

      case 'contact':
        newHistory.push({ type: 'output', text: 'Redirecting to /contact...' });
        setTimeout(() => {
          closeTerminal();
          router.push('/contact');
        }, 500);
        break;

      case 'github':
        newHistory.push({ type: 'output', text: 'Opening GitHub profile...' });
        window.open(siteMetadata.social.github, '_blank', 'noopener,noreferrer');
        break;

      case 'linkedin':
        newHistory.push({ type: 'output', text: 'Opening LinkedIn profile...' });
        window.open(siteMetadata.social.linkedin, '_blank', 'noopener,noreferrer');
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      case '':
        break;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not found: "${trimmed}". Type "help" for a list of commands.`,
        });
        break;
    }

    // Limit history length to 50 entries
    if (newHistory.length > 50) {
      newHistory.splice(0, newHistory.length - 50);
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'Escape') {
      closeTerminal();
    }
  };

  if (!isTerminalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-md"
      onClick={closeTerminal}
      role="dialog"
      aria-modal="true"
      aria-label="Engineering Terminal"
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-bg-primary border border-border-strong shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-border-default select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-functional-error/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-functional-warning/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-functional-success/80 inline-block" />
            <span className="ml-2 text-text-muted text-[11px]">bash — mohammed@portfolio:~</span>
          </div>
          <button
            type="button"
            onClick={closeTerminal}
            aria-label="Close terminal"
            className="text-text-muted hover:text-text-primary px-1"
          >
            ✕
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-text-secondary leading-relaxed bg-[#0a0a0f]">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input'
                  ? 'text-accent font-semibold'
                  : line.type === 'error'
                  ? 'text-functional-error'
                  : line.type === 'system'
                  ? 'text-text-muted italic'
                  : 'text-text-primary whitespace-pre-wrap'
              }
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Line */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary/70 border-t border-border-default">
          <span className="text-accent font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type command..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
