import { CheckCircle2 } from 'lucide-react';
import type { DemoTab } from '../utils/types';
import { DEMO_CONTENT } from '../utils/constants';

interface DemoCardProps {
  activeTab: DemoTab;
  onTabChange: (tab: DemoTab) => void;
}

const TABS: DemoTab[] = ['behavioral', 'technical', 'system'];

export default function DemoCard({ activeTab, onTabChange }: DemoCardProps) {
  const demo = DEMO_CONTENT[activeTab];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* Tab switcher */}
      <div className="inline-flex w-full items-center gap-2 rounded-xl bg-white/5 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors sm:text-sm ${
              activeTab === tab
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* AI question */}
      <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-4">
        <p className="text-xs font-medium text-violet-300">AI Interviewer</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          &ldquo;{demo.question}&rdquo;
        </p>
      </div>

      {/* Live transcript */}
      <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs font-medium text-slate-500">
          Your answer (live transcript)
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          &ldquo;{demo.answerStart}&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
          <span className="ml-1 text-xs text-slate-500">Listening...</span>
        </div>
      </div>

      {/* Coach tip */}
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <p className="text-sm leading-relaxed text-emerald-200">{demo.tip}</p>
      </div>
    </div>
  );
}
