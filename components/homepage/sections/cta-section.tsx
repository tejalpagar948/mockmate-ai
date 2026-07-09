'use client';

import { Mic } from 'lucide-react';
import { useInterviewModal } from '@/app/context/interview-modal-context';

export default function CtaSection() {
  const { openModal } = useInterviewModal();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-violet-600 px-6 py-10 sm:px-16 sm:py-14 text-center">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your next interview starts here.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-violet-100">
          Run your first mock interview free — no credit card, no scheduling,
          just you and the AI interviewer.
        </p>
        <button
          onClick={openModal}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-violet-700 shadow-lg transition-transform hover:scale-[1.02]">
          <Mic className="h-4 w-4" />
          Start free interview
        </button>
      </div>
    </section>
  );
}
