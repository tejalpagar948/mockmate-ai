import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Sora } from "next/font/google";
import StarField from '@/components/homepage/utils/starfield';

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const clerkAppearance = {
  layout: {
    socialButtonsVariant: 'blockButton' as const,
    showOptionalFields: false,
    logoPlacement: 'inside' as const,
  },
  elements: {
    footer: 'hidden',
    footerAction: 'hidden',
    footerActionText: 'hidden',

    card: {
      backgroundColor: 'rgba(255,255,255,0.035)',
      borderRadius: '20px',
      boxShadow: 'none',
      backdropFilter: 'blur(24px)',
    },

    headerTitle: {
      color: '#f0eeff',
      fontWeight: '600',
      letterSpacing: '-0.5px',
    },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.35)',
      fontWeight: '300',
    },

    socialButtonsBlockButton: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      borderRadius: '12px',
      color: '#d8d5f5',
    },

    dividerText: {
      color: 'rgba(255,255,255,0.25)',
      fontSize: '12px',
      letterSpacing: '0.5px',
    },

    formFieldLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },

    formFieldInput: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: '#e8e5ff',
      fontWeight: '300',
    },

    formButtonPrimary: {
      background: 'linear-gradient(135deg, #7060f0, #5a4dd6)',
      borderRadius: '12px',
      fontWeight: '500',
      letterSpacing: '0.2px',
      boxShadow: 'none',
    },

    footerActionLink: {
      color: '#8b7ff0',
      fontWeight: '500',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>

        <body className={sora.className} suppressHydrationWarning>
          <div className="relative min-h-screen overflow-hidden bg-[#0B0B14] text-slate-200 antialiased">
            <StarField />
            <div className="pointer-events-none fixed inset-0">
              <div className="absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-fuchsia-600/10 blur-3xl" />
            </div>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
