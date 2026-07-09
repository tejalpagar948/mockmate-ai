import { ArrowRight } from 'lucide-react';

const STEPS = [
  { n: '01', t: 'Pick a role' },
  { n: '02', t: 'Run the interview' },
  { n: '03', t: 'Get your score' },
  { n: '04', t: 'Fix weak spots' },
];

export default function ProcessStrip() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:py-12 lg:px-8" id='process'>
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#15101F] to-[#0E0B17] p-8 sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
              <span className="text-2xl font-bold text-violet-500/40">
                {step.n}
              </span>
              <p className="text-sm font-semibold text-white">{step.t}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 text-slate-600 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}