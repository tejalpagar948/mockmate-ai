import FeatureCard from '../elements/feature-card';
import { BENTO_FEATURES } from '../utils/constants';

export default function BentoFeatures() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
          Why Mock Mate AI
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Built for every round of the loop.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {BENTO_FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
