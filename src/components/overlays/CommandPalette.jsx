'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/context/OverlayContext';
import { commandGroups } from '@/data/commands';
import { cn } from '@/lib/utils';

export default function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, closeCommandPalette, openTerminal } = useOverlay();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Flatten commands for index-based navigation
  const allCommands = commandGroups.flatMap((group) =>
    group.commands.map((cmd) => ({ ...cmd, group: group.group }))
  );

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = (cmd) => {
    closeCommandPalette();
    if (cmd.action === 'navigate') {
      router.push(cmd.target);
    } else if (cmd.action === 'external') {
      window.open(cmd.target, '_blank', 'noopener,noreferrer');
    } else if (cmd.action === 'download') {
      window.open(cmd.target, '_blank');
    } else if (cmd.action === 'terminal') {
      openTerminal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-bg-primary/80 backdrop-blur-md transition-opacity duration-200"
      onClick={closeCommandPalette}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-xl rounded-xl bg-bg-secondary border border-border-strong shadow-2xl overflow-hidden flex flex-col transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-default bg-bg-primary/50">
          <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or navigate to a page..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-bg-tertiary border border-border-default text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border-subtle/50">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left',
                    isSelected
                      ? 'bg-accent/15 text-text-primary border border-accent/25'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-bg-primary/80 border border-border-default">
                      {cmd.group}
                    </span>
                    <span>{cmd.label}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="font-mono text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-bg-primary/60 border border-border-default">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-bg-primary/60 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Navigate with ↑ and ↓</span>
          <span>Select with ↵</span>
        </div>
      </div>
    </div>
  );
}
