import Image from 'next/image';
import Button from '@/components/shared/Button';
import GazaClock from '@/components/home/GazaClock';
import InteractivePortraitCard from '@/components/home/InteractivePortraitCard';
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
      <div className="relative w-full h-[clamp(200px,34vh,380px)] border-b border-line overflow-hidden">
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
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 pb-4 sm:pb-5 flex flex-col justify-end">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="pointer-events-auto">
                <GazaClock />
              </div>

              <p className="pointer-events-auto lg:absolute lg:top-4 lg:right-8 rounded-lg border border-line bg-bg/90 backdrop-blur-sm px-3 py-1.5 font-mono text-[11.5px] leading-snug text-ink-muted max-w-full">
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
      </div>

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 items-start">
          {/* Text column first in DOM for screen readers */}
          <div className="lg:col-span-7 mt-8 lg:mt-0 lg:pt-10">
            <h1 className="font-sans text-[length:var(--text-hero)] font-bold leading-[0.95] tracking-[-0.03em] text-ink text-balance hyphens-none">
              Mohammed Ferwana
            </h1>

            <div className="mt-4 flex items-center gap-4">
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

            <p className="mt-7 text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-ink max-w-[42ch]">
              I build the server side of web and mobile products: the data, the logins, the permissions and the business rules that keep them correct.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
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

          {/* Portrait card: visually first below lg, overlapping band right on lg+ */}
          <div className="order-first lg:order-last mt-8 lg:-mt-[150px] lg:col-span-5 lg:justify-self-end w-[min(78vw,300px)] lg:w-full lg:max-w-[380px] relative z-10">
            <InteractivePortraitCard loading="eager" />
          </div>
        </div>

        {/* Full-width two-column facts list */}
        <dl className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 border-b border-line">
          {facts.map((item) => (
            <div
              key={item.label}
              className="border-t border-line py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline"
            >
              <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                {item.label}
              </dt>
              <dd className="text-[15px] leading-snug text-ink">
                {item.value}
              </dd>
            </div>
          ))}

          <div className="border-t border-line py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline">
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

          <div className="md:col-span-2 border-t border-line py-3.5 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-1 sm:gap-4 items-baseline">
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
    </section>
  );
}
