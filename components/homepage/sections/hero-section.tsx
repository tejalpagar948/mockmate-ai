'use client';

import { useState } from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import DemoCard from '../elements/democard';
import type { DemoTab } from '../utils/types';
import { useInterview } from '@/app/context/interview-modal-context';

export default function HeroSection() {
  // ← no props
  const [activeTab, setActiveTab] = useState<DemoTab>('behavioral');
  const { openModal } = useInterview();

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Practice every round, before it counts
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your AI interviewer,
            <span className="block text-violet-400">ready 24/7.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Pick a question type on the right and see how Mock Mate AI responds
            — then run the real thing with full voice, scoring, and feedback.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-500">
              <Play className="h-4 w-4 fill-current" />
              Start your first interview
            </button>
            <a
              href="#faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10">
              Common questions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <DemoCard activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </section>
  );
}
