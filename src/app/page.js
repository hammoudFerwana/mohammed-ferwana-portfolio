import HeroSection from '@/components/home/HeroSection';
import InteractiveArchitectureLab from '@/components/home/InteractiveArchitectureLab';
import EngineeringIdentity from '@/components/home/EngineeringIdentity';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import HowIThink from '@/components/home/HowIThink';
import CurrentlyExploring from '@/components/home/CurrentlyExploring';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <InteractiveArchitectureLab />
      <EngineeringIdentity />
      <FeaturedProjects />
      <HowIThink />
      <CurrentlyExploring />
      <CTASection />
    </>
  );
}
