'use client';

import StarField from '@/components/homepage/utils/starfield';
import Navbar from '@/components/homepage/sections/navbar';
import HeroSection from '@/components/homepage/sections/hero-section';
import BentoFeatures from '@/components/homepage/sections/bento-features';
import ProcessStrip from '@/components/homepage/sections/process-trip';
import FaqSection from '@/components/homepage/sections/faq-section';
import CtaSection from '@/components/homepage/sections/cta-section';
import Footer from '@/components/homepage/sections/footer';

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B14] text-slate-200 antialiased">
      <StarField />
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>
      <Navbar />
      <HeroSection />
      <BentoFeatures />
      <ProcessStrip />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
