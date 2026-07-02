import type { BentoFeature } from '../utils/types';

type FeatureCardProps = BentoFeature;

export default function FeatureCard({
  icon: Icon,
  title,
  desc,
  big,
}: FeatureCardProps) {
  return (
    <div
      className={`group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-violet-500/30 hover:bg-white/[0.04] ${
        big ? 'sm:row-span-1 sm:p-8' : ''
      }`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/15 text-violet-300 transition-colors group-hover:bg-violet-600/25">
        <Icon className="h-5 w-5" />
      </span>
      <h3
        className={`mt-4 font-semibold text-white ${
          big ? 'text-lg' : 'text-base'
        }`}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}
