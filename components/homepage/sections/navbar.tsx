"use client";

import { Mic } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NAV_LINKS } from "../utils/constants";
import { useInterviewModal } from "@/app/context/interview-modal-context";
import { useUser } from "@clerk/nextjs";
type NavbarProps = {
  variant?: "landing" | "dashboard";
};

export default function Navbar({
  variant = "landing",
}: NavbarProps) {
  const { openModal } = useInterviewModal();
  const { user } = useUser()

  return (
    <header className="relative z-10 border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
            <Mic className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </span>

          <span className="text-lg font-bold tracking-tight text-white">
            Mock Mate AI
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {variant === "landing" ? (
            <>
              {!user && <a
                href="/sign-in"
                className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:block"
              >
                Log in
              </a>}

              <button
                onClick={openModal}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-500"
              >
                Start free interview
              </button>
            </>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          )}
        </div>
      </nav>
    </header>
  );
}