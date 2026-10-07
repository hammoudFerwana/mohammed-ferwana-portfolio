'use client';

import { useState, useCallback, useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import Badge from '@/components/shared/Badge';
import { cn } from '@/lib/utils';
import { soundManager } from '@/lib/soundFx';

const INITIAL_TASK = {
  id: 'TL-104',
  title: 'S3 Multipart Resumable Chunk Uploader',
  column: 'IN_PROGRESS', // 'BACKLOG' | 'IN_PROGRESS' | 'DONE'
  storyPoints: 5,
  version: 12,
  assignee: 'Mohammed Ferwana (Team Lead)',
};

const CONNECTED_CLIENTS = [
  { id: 'c1', name: 'Mohammed (Team Lead)', role: 'lead', latency: '4ms', status: 'online' },
  { id: 'c2', name: 'Frontend Dev (Client A)', role: 'member', latency: '9ms', status: 'online' },
  { id: 'c3', name: 'QA Engineer (Client B)', role: 'member', latency: '12ms', status: 'online' },
];

export default function TeamlineWorkspaceSimulator() {
  const [task, setTask] = useState(INITIAL_TASK);
  const [activeClients, setActiveClients] = useState(CONNECTED_CLIENTS);
  const [socketLog, setSocketLog] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [occResult, setOccResult] = useState(null);
  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'packets' | 'contracts'

  const shouldReduceMotion = useReducedMotion();
  const liveRegionId = useId();

  const handleMoveTask = useCallback(
    async (targetColumn) => {
      if (isProcessing || task.column === targetColumn) return;
      setIsProcessing(true);
      soundManager.playClick();

      const newVersion = task.version + 1;
      const now = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // 1. Simulate API Route + Auth
      await new Promise((r) => setTimeout(r, shouldReduceMotion ? 30 : 150));

      // 2. Broadcast via WebSocket
      const packet = {
        id: `${Date.now()}-${Math.random()}`,
        event: 'TASK_MOVED',
        channel: 'workspace_taqat_internal',
        payload: {
          taskId: task.id,
          from: task.column,
          to: targetColumn,
          version: newVersion,
          actor: 'Mohammed Ferwana',
        },
        propagationMs: +(5.2 + Math.random() * 3.4).toFixed(1),
        timestamp: now,
      };

      setTask((prev) => ({
        ...prev,
        column: targetColumn,
        version: newVersion,
      }));

      setSocketLog((prev) => [packet, ...prev].slice(0, 15));
      setOccResult({
        type: 'success',
        message: `Task ${task.id} atomically moved to ${targetColumn}. Broadcast to 3 active peers.`,
      });

      soundManager.playSuccess();
      setIsProcessing(false);
    },
    [isProcessing, shouldReduceMotion, task]
  );

  const simulateOccConflict = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    soundManager.playClick();

    await new Promise((r) => setTimeout(r, shouldReduceMotion ? 40 : 200));

    const now = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const conflictPacket = {
      id: `${Date.now()}-${Math.random()}`,
      event: 'MUTATION_REJECTED',
      channel: 'workspace_taqat_internal',
      payload: {
        error: 'OPTIMISTIC_CONCURRENCY_VIOLATION',
        expectedVersion: task.version,
        incomingVersion: task.version - 1,
        status: 409,
      },
      propagationMs: +(2.1 + Math.random() * 1.5).toFixed(1),
      timestamp: now,
    };

    setSocketLog((prev) => [conflictPacket, ...prev].slice(0, 15));
    setOccResult({
      type: 'conflict',
      message: `Race condition detected: Client B submitted stale __v:${task.version - 1}. Rejected with HTTP 409 to prevent lost update.`,
    });

    soundManager.playWarning();
    setIsProcessing(false);
  }, [isProcessing, shouldReduceMotion, task.version]);

  const resetSimulator = useCallback(() => {
    soundManager.playWarning();
    setTask(INITIAL_TASK);
    setSocketLog([]);
    setOccResult(null);
  }, []);

  return (
    <div className="rounded-xl border border-border-default bg-bg-secondary p-4 sm:p-6 space-y-6 shadow-sm">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <h3 className="font-mono text-sm sm:text-base font-bold text-text-primary tracking-wide">
              Real-time Kanban Sync & Concurrency Lab
            </h3>
            <Badge variant="success" size="sm">
              Live WebSockets
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Simulates multi-client real-time synchronization, workspace room scoping, and Optimistic Concurrency Control (<code className="text-accent bg-bg-tertiary px-1 py-0.5 rounded">__v</code> guards) across collaborative sprint boards.
          </p>
        </div>

        <button
          onClick={resetSimulator}
          disabled={isProcessing}
          className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors px-2.5 py-1.5 rounded border border-border-subtle hover:border-border-default self-start sm:self-auto"
        >
          Reset Lab
        </button>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
        <button
          onClick={() => setActiveTab('board')}
          className={cn(
            'px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors',
            activeTab === 'board'
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Board & Peers View
        </button>
        <button
          onClick={() => setActiveTab('packets')}
          className={cn(
            'px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors',
            activeTab === 'packets'
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Socket Frame Stream ({socketLog.length})
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={cn(
            'px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors',
            activeTab === 'contracts'
              ? 'bg-accent/15 text-accent border border-accent/30'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          OCC & Room Architecture
        </button>
      </div>

      {/* ── Main Interactive Content ── */}
      {activeTab === 'board' && (
        <div className="space-y-5">
          {/* Simulated Active Peers Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-bg-primary/90 border border-border-subtle font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Tenant Channel:</span>
              <span className="text-text-primary font-bold">ws://teamline.io/rooms/workspace_taqat</span>
            </div>
            <div className="flex items-center gap-3">
              {activeClients.map((client) => (
                <div key={client.id} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-functional-success" />
                  <span className="font-medium">{client.name}</span>
                  <span className="text-text-muted">({client.latency})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* BACKLOG */}
            <div className="rounded-lg bg-bg-primary/70 border border-border-subtle p-3 space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="font-mono text-xs font-semibold text-text-muted uppercase">Backlog</span>
                <span className="font-mono text-[10px] text-text-muted">0 tasks</span>
              </div>
              <div className="min-h-[110px] flex items-center justify-center border border-dashed border-border-subtle/50 rounded-lg text-text-muted text-xs font-mono">
                Empty Column
              </div>
              <button
                onClick={() => handleMoveTask('BACKLOG')}
                disabled={task.column === 'BACKLOG' || isProcessing}
                className="w-full py-1.5 rounded text-xs font-mono border border-border-subtle text-text-muted hover:text-text-primary hover:border-accent disabled:opacity-40 transition-colors"
              >
                ← Move to Backlog
              </button>
            </div>

            {/* IN PROGRESS */}
            <div className="rounded-lg bg-bg-primary/90 border border-accent/30 p-3 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="font-mono text-xs font-semibold text-accent uppercase">In Progress</span>
                <span className="font-mono text-[10px] text-accent">Active Task</span>
              </div>

              {task.column === 'IN_PROGRESS' ? (
                <div className="p-3 rounded-lg bg-bg-secondary border border-accent/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-accent">{task.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted">
                      rev: #{task.version}
                    </span>
                  </div>
                  <div className="text-text-primary text-xs font-sans font-medium">{task.title}</div>
                  <div className="text-[11px] text-text-muted pt-1 flex items-center justify-between">
                    <span>{task.storyPoints} pts</span>
                    <span className="text-text-secondary text-[10px] truncate max-w-[130px]">{task.assignee}</span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[110px] flex items-center justify-center border border-dashed border-border-subtle/50 rounded-lg text-text-muted text-xs font-mono">
                  Empty
                </div>
              )}

              <button
                onClick={() => handleMoveTask('IN_PROGRESS')}
                disabled={task.column === 'IN_PROGRESS' || isProcessing}
                className="w-full py-1.5 rounded text-xs font-mono border border-accent text-accent hover:bg-accent/10 disabled:opacity-40 transition-colors"
              >
                Move In Progress
              </button>
            </div>

            {/* DONE / REVIEW */}
            <div className="rounded-lg bg-bg-primary/70 border border-border-subtle p-3 space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="font-mono text-xs font-semibold text-functional-success uppercase">Done / Review</span>
                <span className="font-mono text-[10px] text-functional-success">Ready</span>
              </div>

              {task.column === 'DONE' ? (
                <div className="p-3 rounded-lg bg-bg-secondary border border-functional-success/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-functional-success">{task.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted">
                      rev: #{task.version}
                    </span>
                  </div>
                  <div className="text-text-primary text-xs font-sans font-medium line-through text-text-muted">{task.title}</div>
                  <div className="text-[11px] text-text-muted pt-1 flex items-center justify-between">
                    <span>{task.storyPoints} pts</span>
                    <span className="text-functional-success text-[10px]">Verified Closed</span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[110px] flex items-center justify-center border border-dashed border-border-subtle/50 rounded-lg text-text-muted text-xs font-mono">
                  Ready for merge
                </div>
              )}

              <button
                onClick={() => handleMoveTask('DONE')}
                disabled={task.column === 'DONE' || isProcessing}
                className="w-full py-1.5 rounded text-xs font-mono border border-border-subtle text-text-muted hover:text-functional-success hover:border-functional-success disabled:opacity-40 transition-colors"
              >
                Mark as Done →
              </button>
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="p-4 rounded-lg bg-bg-primary/80 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-semibold text-text-primary">
                Simulate Stale Write / Race Condition (OCC)
              </div>
              <div className="text-xs text-text-muted">
                Simulates Client B attempting to write with stale revision <code className="text-accent font-mono">__v:{task.version - 1}</code>.
              </div>
            </div>

            <button
              onClick={simulateOccConflict}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-lg bg-bg-secondary border border-border-default hover:border-functional-warning text-functional-warning font-mono text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
            >
              ⚠️ Test Stale Version Conflict
            </button>
          </div>

          {/* Feedback banner */}
          {occResult && (
            <div
              className={cn(
                'p-3 rounded-lg border font-mono text-xs flex items-center gap-2.5',
                occResult.type === 'success'
                  ? 'bg-functional-success/10 border-functional-success/30 text-functional-success'
                  : 'bg-functional-warning/10 border-functional-warning/30 text-functional-warning'
              )}
            >
              <span>{occResult.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{occResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Packets Tab ── */}
      {activeTab === 'packets' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted px-1">
            <span>WebSocket Frame Ingestion Log</span>
            <span>Room Broadcast Fan-Out</span>
          </div>

          <div className="h-64 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {socketLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted text-center p-4">
                <span>No frames broadcast yet.</span>
                <span className="text-[11px] mt-1">Move a task or trigger a conflict in the Board tab to inspect wire packets.</span>
              </div>
            ) : (
              socketLog.map((packet) => (
                <div
                  key={packet.id}
                  className="p-3 rounded-lg bg-bg-primary/90 border border-border-subtle space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded font-bold',
                          packet.event === 'TASK_MOVED'
                            ? 'bg-accent/15 text-accent border border-accent/30'
                            : 'bg-functional-error/15 text-functional-error border border-functional-error/30'
                        )}
                      >
                        {packet.event}
                      </span>
                      <span className="text-text-muted">room: [{packet.channel}]</span>
                    </div>
                    <span className="text-text-muted">{packet.timestamp}</span>
                  </div>

                  <pre className="text-[11px] text-text-secondary bg-bg-secondary p-2 rounded overflow-x-auto">
                    {JSON.stringify(packet.payload, null, 2)}
                  </pre>

                  <div className="text-[10px] text-accent text-right">
                    Delivered to 3 sockets in {packet.propagationMs}ms
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Contracts Tab ── */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-bg-primary/90 border border-border-subtle p-4 font-mono text-xs space-y-2">
            <span className="text-accent font-semibold block uppercase tracking-wider text-[11px]">
              Optimistic Concurrency Control (OCC) Architecture
            </span>
            <p className="text-text-secondary leading-relaxed font-sans text-xs">
              In TeamLine, tasks are assigned a revision tag (<code className="text-accent font-mono">__v</code>). When concurrent team members attempt to update the same task, the server verifies that the client&apos;s submitted version equals the persisted document version. If stale, the mutation is rejected with <code className="text-functional-warning font-mono">409 CONFLICT</code> and the client is served the latest state without silent data overwrites.
            </p>
          </div>

          <div className="rounded-lg bg-bg-secondary p-3 font-mono text-[11px] overflow-x-auto border border-border-subtle">
            <pre className="text-text-secondary leading-relaxed">
{`// task.service.js — Optimistic Concurrency & Room Broadcast
async function updateTaskStatus(workspaceId, taskId, targetStatus, expectedVersion) {
  // 1. Atomic Version-Guarded Mutation
  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId, __v: expectedVersion },
    { $set: { status: targetStatus }, $inc: { __v: 1 } },
    { new: true }
  );

  if (!updatedTask) {
    throw new AppError(409, 'OPTIMISTIC_CONCURRENCY_VIOLATION');
  }

  // 2. Room-Scoped WebSocket Fan-Out
  io.to(\`workspace_\${workspaceId}\`).emit('TASK_MOVED', {
    taskId: updatedTask._id,
    status: updatedTask.status,
    version: updatedTask.__v,
    updatedAt: new Date().toISOString()
  });

  return updatedTask;
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
