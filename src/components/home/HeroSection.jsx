import Image from 'next/image';
import Button from '@/components/shared/Button';
import GazaClock from '@/components/home/GazaClock';
import { metrics } from '@/data/metrics';

const formattedTestRunDate = new Date(`${metrics.testRunDate}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const facts = [
  { label: 'Stack', value: 'Node.js · Express · MongoDB' },
  { label: 'Study', value: 'Computer Systems Engineering, Al-Azhar University, expected 2027' },
  { label: 'Base', value: 'Gaza, Palestine · Remote' },
];

export default function HeroSection() {
  return (
    <section className="pt-[84px] sm:pt-[96px] pb-[70px]">
      {/* Full-width Gaza sea port photo band */}
      <div className="relative w-full h-[clamp(260px,46vh,500px)] border-b border-line overflow-hidden">
        <Image
          src="/images/hero/gaza-port.webp"
          alt="Gaza sea port at sunset, fishing boats inside the harbour wall, with a minaret in the foreground"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Bottom gradient for legibility (transparent to bg at ~55%) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 45%, var(--hz-bg) 100%)',
          }}
        />

        {/* Clock chip & photo credit bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-4 sm:pb-5">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
            <GazaClock />

            <p className="rounded-lg border border-line bg-bg/90 backdrop-blur-sm px-3 py-1.5 font-mono text-[11.5px] leading-snug text-ink-muted max-w-full">
              Gaza sea port, before the war · Photo:{' '}
              <a
                href="https://unsplash.com/photos/a-view-of-a-sunset-over-a-body-of-water-EMH4vCucw-A"
                rel="noopener"
                target="_blank"
                className="text-ink underline decoration-line underline-offset-2 hover:text-violet transition-colors"
              >
                Mohammed Ibrahim, Unsplash
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-[34px]">
        {/* Full-width name & role block */}
        <div>
          <h1 className="font-sans text-[length:var(--text-hero)] font-bold leading-[0.95] tracking-[-0.03em] text-ink text-balance hyphens-none">
            Mohammed Ferwana
          </h1>

          <div className="mt-5 flex items-center gap-4">
            <p className="font-mono text-[15px] text-violet shrink-0">
              Backend Engineer
            </p>
            <span
              aria-hidden="true"
              className="h-px flex-1 max-w-xs"
              style={{
                background: 'linear-gradient(to right, var(--hz-violet), transparent)',
              }}
            />
          </div>
        </div>

        {/* Two columns at 900px+, one column below */}
        <div className="mt-10 grid grid-cols-1 min-[900px]:grid-cols-12 gap-10 min-[900px]:gap-12 items-start">
          {/* Left: promise + three buttons */}
          <div className="min-[900px]:col-span-6 space-y-8">
            <p className="text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-ink max-w-[42ch]">
              I build the server side of web and mobile products: the data, the logins, the permissions and the business rules that keep them correct.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button href="/projects" variant="primary" size="lg">
                See my work
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Start a project
              </Button>
              <Button
                href="/resume/Mohammed_Ferwana_Resume.pdf"
                download="Mohammed_Ferwana_Resume.pdf"
                variant="ghost"
                size="lg"
              >
                Download Resume
              </Button>
            </div>
          </div>

          {/* Right: facts list */}
          <dl className="min-[900px]:col-span-6 divide-y divide-line border-y border-line">
            {facts.map((item) => (
              <div
                key={item.label}
                className="py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline"
              >
                <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                  {item.label}
                </dt>
                <dd className="text-[15px] leading-snug text-ink">
                  {item.value}
                </dd>
              </div>
            ))}

            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline">
              <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                Status
              </dt>
              <dd className="text-[15px] leading-snug text-ink flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-block w-2 h-2 rounded-full bg-sun shrink-0"
                />
                <span>Open to backend roles, internships and freelance projects</span>
              </dd>
            </div>

            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline">
              <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                Proof
              </dt>
              <dd className="text-[15px] leading-snug text-ink flex flex-wrap items-center justify-between gap-2.5">
                <span>
                  {metrics.integrationTests} tests passing on Sawn, run {formattedTestRunDate}
                </span>
                <Image
                  src={`https://github.com/hammoudFerwana/mohammed-ferwana-portfolio/actions/workflows/ci.yml/badge.svg?branch=${metrics.ciBadgeBranch}`}
                  alt="Portfolio CI: lint, test and build"
                  width={106}
                  height={20}
                  unoptimized
                  className="h-5 w-auto shrink-0"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
