import HeroSection from '@/components/home/HeroSection';
import HolographicCore3D from '@/components/home/HolographicCore3D';
import EngineeringIdentity from '@/components/home/EngineeringIdentity';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import HowIThink from '@/components/home/HowIThink';
import CurrentlyExploring from '@/components/home/CurrentlyExploring';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HolographicCore3D />
      <EngineeringIdentity />
      <FeaturedProjects />
      <HowIThink />
      <CurrentlyExploring />
      <CTASection />
    </>
  );
}
