import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItemProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold text-white sm:text-base">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-violet-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`px-5 transition-all ${
          isOpen
            ? 'max-h-40 pb-4 opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}>
        <p className="text-sm leading-relaxed text-slate-400">{answer}</p>
      </div>
    </div>
  );
}
