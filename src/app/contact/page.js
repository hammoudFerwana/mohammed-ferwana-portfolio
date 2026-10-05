import Link from 'next/link';
import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export const metadata = {
  title: 'Contact & Collaboration',
  description:
    'Get in touch with Mohammed Ferwana for backend engineering opportunities, scalable system architecture consulting, or technical collaboration.',
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-5 sm:px-8">
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

      {/* ── Page Header ── */}
      <RevealOnScroll>
        <SectionHeading
          as="h1"
          eyebrow="LET'S CONNECT"
          title="Let's Build Something Meaningful"
          description="Have a project in mind or want to discuss backend engineering? Let's connect."
        />
      </RevealOnScroll>

      {/* ── Contact Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-12 items-start">
        {/* Left: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <RevealOnScroll delay={0.08}>
            <ContactForm />
          </RevealOnScroll>
        </div>

        {/* Right: Direct Channels & Status */}
        <div className="lg:col-span-5">
          <RevealOnScroll delay={0.16}>
            <ContactInfo />
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
