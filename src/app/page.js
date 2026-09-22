import { siteMetadata } from '@/data/siteMetadata';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <Badge variant="accent" className="font-mono text-xs uppercase tracking-wider">
          System Status: Online · Active Development
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary text-balance">
          {siteMetadata.name}
        </h1>

        <p className="text-lg sm:text-xl font-medium text-accent">
          {siteMetadata.title} — {siteMetadata.tagline}
        </p>

        <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
          {siteMetadata.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button href="#projects" variant="primary" size="lg">
            Explore My Work
          </Button>
          <Button href="#contact" variant="secondary" size="lg">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
}
