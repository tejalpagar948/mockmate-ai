import { Mic } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <Mic className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-sm font-semibold text-white">Mock Mate AI</span>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Mock Mate AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
