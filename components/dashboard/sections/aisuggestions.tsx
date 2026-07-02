// components/dashboard/AISuggestions.tsx

interface AISuggestionsProps {
  suggestions: string[];
  /** 'list' = numbered sidebar style; 'grid' = card grid with big numbers */
  variant?: 'list' | 'grid';
}

export function AISuggestions({
  suggestions,
  variant = 'list',
}: AISuggestionsProps) {
  if (variant === 'grid') {
    return (
      <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-br from-violet-900/20 to-violet-900/0 border border-violet-500/20 rounded-xl p-5">
        <h3 className="text-violet-300 font-medium mb-4">
          🤖 Personalised Improvement Plan
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
              <div className="text-violet-400 font-bold text-2xl mb-2">
                0{i + 1}
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] border border-white/[0.07] rounded-xl p-5">
      <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
        AI Coach Tips
      </h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-white/60 text-xs leading-relaxed">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
