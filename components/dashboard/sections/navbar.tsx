// src/components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Questions', href: '/dashboard/questions' },
  { label: 'Upgrade', href: '/dashboard/upgrade' },
  { label: 'How It Works?', href: '/dashboard/how-it-works' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.08A7 7 0 0 0 19 10z" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-white">
            Mock Mate AI
          </span>
        </div>

        {/* Links + Auth */}
        <div className="flex items-center gap-6">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/50 hover:text-white'
                }`}>
                {label}
              </Link>
            );
          })}
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
