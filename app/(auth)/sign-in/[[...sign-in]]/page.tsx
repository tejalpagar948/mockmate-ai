import { SignIn } from '@clerk/nextjs';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ fallbackRedirectUrl?: string }>;
}) {
  const { fallbackRedirectUrl } = await searchParams;

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center px-4 overflow-hidden bg-[#0e0d14]">
      {/* Radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #2a1f5e 0%, #0e0d14 55%)',
        }}
      />

      {/* Stars */}
      <Stars />

      {/* Clerk card */}
      <div className="relative z-10">
        <SignIn
          fallbackRedirectUrl={fallbackRedirectUrl}
          signUpFallbackRedirectUrl={fallbackRedirectUrl}
        />
      </div>

      {/* Sign up link */}
      <p className="relative z-10 mt-4 text-sm text-white/35 font-sora">
        Don&apos;t have an account?{' '}
        <a
          href="/sign-up"
          className="text-[#8b7ff0] font-medium hover:text-[#a897f5] transition-colors duration-200">
          Sign up
        </a>
      </p>
    </main>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="9"
        y="2"
        width="6"
        height="11"
        rx="3"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="22"
        x2="15"
        y2="22"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Stars() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    size: Math.random() < 0.5 ? 'w-px h-px' : 'w-[1.5px] h-[1.5px]',
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${(2 + Math.random() * 4).toFixed(1)}s`,
    delay: `-${(Math.random() * 4).toFixed(1)}s`,
    peak: (0.2 + Math.random() * 0.5).toFixed(2),
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className={`absolute rounded-full bg-white ${s.size}`}
          style={{
            left: s.left,
            top: s.top,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            opacity: 0,
            ['--peak' as string]: s.peak,
          }}
        />
      ))}
      <style>{`@keyframes twinkle { 0%,100%{opacity:0} 50%{opacity:var(--peak)} }`}</style>
    </div>
  );
}
