import Button from '@/components/shared/Button';

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The requested resource could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-5 sm:px-8 text-center pt-24 pb-16">
      <div className="max-w-md mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
          <span>HTTP 404</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          The requested engineering resource or page does not exist or has been relocated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button href="/" variant="primary" size="md">
            Return Home
          </Button>
          <Button href="/projects" variant="secondary" size="md">
            Explore Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
