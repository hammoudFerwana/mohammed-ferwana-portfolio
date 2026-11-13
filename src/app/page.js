import HeroSection from '@/components/home/HeroSection';
import StatementSection from '@/components/home/StatementSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}
