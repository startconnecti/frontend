import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { DiscoverSection } from '@/components/discover-section';
import { HowItWorks } from '@/components/how-it-works';
import { Testimonials } from '@/components/testimonials';
import { FinalCTA } from '@/components/final-cta';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <Hero />
      <DiscoverSection />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
