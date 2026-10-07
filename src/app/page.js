import HeroSection from '@/components/home/HeroSection';
import ArchitectureHub from '@/components/home/ArchitectureHub';
import EngineeringIdentity from '@/components/home/EngineeringIdentity';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import HowIThink from '@/components/home/HowIThink';
import CurrentlyExploring from '@/components/home/CurrentlyExploring';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ArchitectureHub />
      <EngineeringIdentity />
      <FeaturedProjects />
      <HowIThink />
      <CurrentlyExploring />
      <CTASection />
    </>
  );
}
