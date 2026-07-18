import { SignIn } from '@clerk/nextjs';
import { Montserrat } from 'next/font/google';
import { Stars } from '@/components/common/stars';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ fallbackRedirectUrl?: string }>;
}) {
  const { fallbackRedirectUrl } = await searchParams;

  return (
    <main className={`relative min-h-dvh flex flex-col items-center justify-center px-4 overflow-hidden bg-[#0e0d14] ${montserrat.variable}`}>
      {/* Radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #2a1f5e 0%, #0e0d14 55%)',
        }}
      />

      <Stars />

      {/* Clerk card */}
      <div className="relative z-10">
        <SignIn
          fallbackRedirectUrl={fallbackRedirectUrl}
          signUpFallbackRedirectUrl={fallbackRedirectUrl}
          appearance={{
            variables: {
              colorPrimary: '#5f51dc',
              colorBackground: '#0a0a0a',
              colorText: '#ffffff',
              colorInputBackground: '#1a1a1a',
              colorInputText: '#ffffff',
              fontFamily: 'var(--font-montserrat)',
              borderRadius: '0.5rem',
            },
            elements: {
              footer: 'hidden',
              card: 'bg-[#0a0a0a] border border-white/5 shadow-2xl shadow-black/90 rounded-[0.5rem]',
              headerTitle: 'text-white font-bold text-xl tracking-tight font-montserrat',
              headerSubtitle: 'text-white/60 text-sm',
              formButtonPrimary: 'bg-[#8D0006] hover:bg-[#b30008] text-white rounded-[0.5rem] font-medium py-2 px-4 transition-colors duration-200 cursor-pointer shadow-none border-none',
              formFieldInput: 'bg-[#1a1a1a] border border-white/10 text-white rounded-[0.5rem] focus:border-[#8D0006] focus:ring-1 focus:ring-[#8D0006] transition-colors duration-150',
              formFieldLabel: 'text-white/70 text-xs font-semibold uppercase tracking-wide',
              identityPreviewText: 'text-white',
              socialButtonsBlockButton: 'bg-[#1a1a1a] border border-white/10 text-white hover:bg-white/5 rounded-[0.5rem] transition-colors',
              dividerLine: 'bg-white/10',
              dividerText: 'text-white/40 text-xs uppercase tracking-wider',
            },
          }}
        />
      </div>

      {/* Sign up link */}
      {/* <p className="relative z-10 mt-4 text-sm text-white/35 font-sora">
        Don&apos;t have an account?{' '}
        <a
          href="/sign-up"
          className="text-[#8b7ff0] font-medium hover:text-[#a897f5] transition-colors duration-200">
          Sign up
        </a>
      </p> */}
    </main>
  );
}


