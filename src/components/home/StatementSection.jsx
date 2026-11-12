export default function StatementSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="statement-reveal">
          <div className="flex items-center gap-3 mb-6">
            <span aria-hidden="true" className="w-[28px] h-px bg-sun shrink-0" />
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
              Approach
            </p>
          </div>

          <p className="font-sans text-[clamp(26px,3.6vw,44px)] font-[520] leading-[1.22] tracking-[-0.02em] text-ink max-w-[26ch] text-balance">
            Most costly bugs are rules nobody enforced. I put the rules where they cannot be skipped:{' '}
            <span
              className="bg-no-repeat pb-[2px]"
              style={{
                backgroundImage: 'linear-gradient(to right, var(--hz-sun), var(--hz-sun))',
                backgroundSize: '100% 2px',
                backgroundPosition: '0 100%',
              }}
            >
              inside the database write itself
            </span>
            , and I prove them with tests.
          </p>
        </div>
      </div>
    </section>
  );
}
