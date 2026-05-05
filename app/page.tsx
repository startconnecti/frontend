import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { MentorSection } from '@/components/mentor-section';
import { HowItWorks } from '@/components/how-it-works';
import { Testimonials } from '@/components/testimonials';
import { FinalCTA } from '@/components/final-cta';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <Hero />
      <MentorSection />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
