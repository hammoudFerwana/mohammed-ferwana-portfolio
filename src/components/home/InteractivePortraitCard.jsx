import Image from 'next/image';

export default function InteractivePortraitCard() {
  return (
    <div className="relative w-full max-w-sm select-none">
      {/* Dynamic Ambient Glow Field Behind Card */}
      <div
        className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-accent/35 via-accent-secondary/25 to-sea/20 blur-xl opacity-60 transition-opacity duration-700 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Card Shell */}
      <div
        className="relative w-full aspect-square rounded-2xl shadow-2xl transition-shadow duration-500"
        role="region"
        aria-label="Engineering Identity Card of Mohammed Ferwana"
      >
        <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-strong backdrop-blur-md">
          {/* Base Portrait Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/portrait.jpg"
              alt="Mohammed Ferwana - Backend Engineer"
              width={480}
              height={480}
              priority
              className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-95"
            />
          </div>

          {/* Cinematic Vignette Gradient Overlay */}
          <div
            className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/20 to-transparent opacity-80 pointer-events-none"
            aria-hidden="true"
          />

          {/* Micro Tactical Brackets */}
          <div
            className="absolute inset-3 pointer-events-none border border-border-subtle rounded-xl transition-all duration-300 z-10"
            aria-hidden="true"
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent/70 rounded-tl" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent/70 rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent/70 rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent/70 rounded-br" />
          </div>

          {/* Bottom Identity & Origin Pill */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-border-default shadow-lg text-xs font-mono">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary font-bold tracking-tight">Mohammed Ferwana</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <span className="text-[10px] text-text-muted">Backend Engineer</span>
              </div>
              <div className="text-right">
                <span className="text-accent font-medium text-[11px] block">Gaza, Palestine</span>
                <span className="text-[9px] text-text-muted tracking-wide">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
