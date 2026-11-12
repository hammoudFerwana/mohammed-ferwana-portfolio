'use client';

import { useSyncExternalStore } from 'react';

const gazaTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Gaza',
  hour: '2-digit',
  minute: '2-digit',
});

function sunAltitude(d) {
  const utcH = d.getUTCHours() + d.getUTCMinutes() / 60;
  const solar = (utcH + 34.47 / 15 + 24) % 24;
  const doy = Math.floor((d - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
  const dayLen = 12 + 2.15 * Math.sin((2 * Math.PI * (doy - 80)) / 365);
  const rise = 12 - dayLen / 2;
  const set = 12 + dayLen / 2;
  if (solar >= rise && solar <= set) return Math.sin((Math.PI * (solar - rise)) / dayLen) * 0.85;
  const night = 24 - dayLen;
  const t = solar > set ? solar - set : solar + 24 - set;
  return -Math.sin((Math.PI * t) / night) * 0.6;
}

function phaseName(a, d) {
  const h = d.getUTCHours() + 2;
  if (a > 0.18) return 'daylight';
  if (a > -0.05) return (h % 24) < 12 ? 'sunrise' : 'sunset';
  if (a > -0.2) return (h % 24) < 12 ? 'first light' : 'dusk';
  return 'night';
}

const SERVER_SNAPSHOT = '--:--|';

function getSnapshot() {
  const now = new Date();
  const time = gazaTimeFormatter.format(now);
  const phase = phaseName(sunAltitude(now), now);
  return `${time}|${phase}`;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function subscribe(callback) {
  const intervalId = setInterval(callback, 30_000);
  return () => clearInterval(intervalId);
}

export default function GazaClock() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [time, phase] = snapshot.split('|');

  const accessibleText = phase
    ? `Local time in Gaza: ${time}, ${phase}`
    : 'Local time in Gaza';

  return (
    <div
      data-gaza-clock
      className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/90 backdrop-blur-sm px-3 py-1.5 font-mono text-[12.5px] leading-none text-ink"
    >
      <span className="sr-only">{accessibleText}</span>
      <span aria-hidden="true" className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sun shrink-0" />
        <span className="text-ink-muted">Gaza</span>
        <span
          data-gaza-time
          className="inline-block w-[5ch] text-center tabular-nums text-sun font-medium"
        >
          {time}
        </span>
        {phase ? (
          <>
            <span className="text-ink-muted/70">·</span>
            <span className="text-ink-muted">{phase}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
