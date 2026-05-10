import { Hero } from '@/components/hero';
import { DiscoverSection } from '@/components/discover-section';
import { HowItWorks } from '@/components/how-it-works';
import { Testimonials } from '@/components/testimonials';
import { FinalCTA } from '@/components/final-cta';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <DiscoverSection />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
