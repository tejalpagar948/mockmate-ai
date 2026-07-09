'use client';
import Navbar from '@/components/homepage/sections/navbar';
import HeroSection from '@/components/homepage/sections/hero-section';
import BentoFeatures from '@/components/homepage/sections/bento-features';
import ProcessStrip from '@/components/homepage/sections/process-trip';
import FaqSection from '@/components/homepage/sections/faq-section';
import CtaSection from '@/components/homepage/sections/cta-section';
import Footer from '@/components/homepage/sections/footer';

export default function Homepage() {
  return (
    <>
      <Navbar variant='landing' />
      <main>
        <HeroSection />
        <BentoFeatures />
        <ProcessStrip />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
