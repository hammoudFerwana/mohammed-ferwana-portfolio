import SectionHeading from '@/components/shared/SectionHeading';
import RevealOnScroll from '@/components/shared/RevealOnScroll';

export default function EngineeringIdentity() {
  const pillars = [
    {
      number: '01',
      title: 'Scalable Systems & Data Architecture',
      description: 'I design backends with modular separation of concerns. From domain-driven entity boundaries in MongoDB to normalized relational schemas in PostgreSQL, I ensure data integrity and query efficiency under growth.',
      highlights: ['Modular Domain Boundaries', 'Index Optimization', 'Transaction Safety'],
    },
    {
      number: '02',
      title: 'Predictable & Hardened REST APIs',
      description: 'APIs are long-term contracts. I build RESTful endpoints with strict schema validations, structured RFC-compliant error responses, and defense-in-depth security including JWT token rotation and granular RBAC.',
      highlights: ['Declarative RBAC Middleware', 'Schema Validation', 'Stateless JWT Lifecycle'],
    },
    {
      number: '03',
      title: 'Engineering Ownership & Team Leadership',
      description: 'As a team leader on projects like TeamLine and PCD, I bridge technical architecture with collaborative delivery. I align frontend and backend contracts early, review pull requests, and foster engineering discipline.',
      highlights: ['API Contract Discipline', 'PR Reviews & Mentorship', 'Sprint Coordination'],
    },
  ];

  return (
    <section className="py-20 md:py-28 border-t border-border-subtle bg-bg-secondary/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="ENGINEERING IDENTITY"
          title="How I Build Software"
          description="Backend engineering is about reliability, maintainability, and clear architectural boundaries that allow systems to evolve without breaking."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <RevealOnScroll key={pillar.number} delay={0.1 * (idx + 1)}>
              <div className="h-full rounded-2xl bg-bg-secondary border border-border-default hover:border-border-strong p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-text-muted">
                    <span className="text-accent font-semibold">{pillar.number}</span>
                    <span>PILLAR</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border-subtle space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted block">
                    Core Focus
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary border border-border-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
