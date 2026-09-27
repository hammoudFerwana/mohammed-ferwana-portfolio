import { siteMetadata } from '@/data/siteMetadata';

export default function ContactInfo() {
  const directChannels = [
    {
      platform: 'Email',
      value: siteMetadata.email,
      href: `mailto:${siteMetadata.email}`,
      external: false,
      description: 'Best for project proposals, hiring inquiries, or detailed discussions.',
      icon: (
        <svg
          className="w-5 h-5 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      platform: 'LinkedIn',
      value: 'mohammed-ferwana',
      href: siteMetadata.social.linkedin,
      external: true,
      description: 'Professional networking, background overview, and industry connections.',
      icon: (
        <svg
          className="w-5 h-5 text-accent"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      platform: 'GitHub',
      value: 'hammoudFerwana',
      href: siteMetadata.social.github,
      external: true,
      description: 'Source code, open-source repositories, and backend system commits.',
      icon: (
        <svg
          className="w-5 h-5 text-accent"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Availability Status Card */}
      <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-functional-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-functional-success" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-functional-success font-semibold">
            Status: Available
          </span>
        </div>
        <h3 className="text-base font-bold text-text-primary">
          Available for Backend Engineering Opportunities
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Actively open to full-time roles, contract engineering, and backend architecture consulting.
        </p>
      </div>

      {/* Direct Communication Channels */}
      <div className="rounded-2xl bg-bg-secondary border border-border-default p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-text-primary tracking-tight">Direct Channels</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Prefer direct contact? Reach out through any of these platforms:
          </p>
        </div>

        <ul className="space-y-3" role="list">
          {directChannels.map((channel) => (
            <li key={channel.platform}>
              <a
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-4 p-3.5 rounded-xl bg-bg-tertiary/50 border border-border-subtle hover:border-accent/40 hover:bg-bg-tertiary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-default group-hover:border-accent/30 transition-colors shrink-0">
                  {channel.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                      {channel.platform}
                    </span>
                    {channel.external && (
                      <span className="text-xs text-text-muted group-hover:text-accent transition-colors">
                        ↗
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate mt-0.5">
                    {channel.value}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {channel.description}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Location & Timezone Details */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted font-mono">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-text-muted shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{siteMetadata.location}</span>
          </div>
          <span>Remote / Async</span>
        </div>
      </div>
    </div>
  );
}
