import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import ArchitectureHub from '@/components/home/ArchitectureHub';
import EngineeringIdentity from '@/components/home/EngineeringIdentity';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import HowIThink from '@/components/home/HowIThink';
import CurrentlyExploring from '@/components/home/CurrentlyExploring';
import CTASection from '@/components/home/CTASection';

const GlassPhysicsSandbox = dynamic(
  () => import('@/components/home/GlassPhysicsSandbox'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[480px] rounded-2xl bg-bg-secondary/40 border border-border-default flex items-center justify-center font-mono text-xs text-text-muted animate-pulse">
        <span>INITIALIZING GLASS SANCTUARY...</span>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <ArchitectureHub />
      <EngineeringIdentity />
      <FeaturedProjects />
      <GlassPhysicsSandbox />
      <HowIThink />
      <CurrentlyExploring />
      <CTASection />
    </>
  );
}
