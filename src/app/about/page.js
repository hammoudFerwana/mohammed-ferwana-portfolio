import Link from 'next/link';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutPhilosophy from '@/components/about/AboutPhilosophy';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutTechStack from '@/components/about/AboutTechStack';
import AboutCTA from '@/components/about/AboutCTA';

export const metadata = {
  title: 'About Mohammed Ferwana | Backend Engineer',
  description:
    'Engineering journey, philosophy, verified milestones, and technical capabilities of Mohammed Ferwana, Backend Engineer.',
  openGraph: {
    title: 'About Mohammed Ferwana | Backend Engineer',
    description:
      'Engineering journey, philosophy, verified milestones, and technical capabilities of Mohammed Ferwana, Backend Engineer.',
    type: 'profile',
  },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-5 sm:px-8">
      {/* ── Back Navigation ── */}
      <RevealOnScroll>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-200 mb-10 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="uppercase tracking-wider">Back to Home</span>
        </Link>
      </RevealOnScroll>

      {/* ── Main About Sections ── */}
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutTimeline />
      <AboutTechStack />
      <AboutCTA />
    </div>
  );
}
