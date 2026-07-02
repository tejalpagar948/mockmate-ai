'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

// Reusable components
import { Starfield } from './starfield';
import { HeroScore } from './heroscore';
import { TabBar } from './tabbar';
import { InterviewCard } from './interviewcard';
import { SkillCard } from './skillcard';
import { AISuggestions } from './aisuggestions';

// Types
import type { Interview } from './interviewcard';
import type { Skill } from './skillcard';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData = {
  overallScore: 82,
  userName: 'Tejal Pagar',
  interviews: [
    {
      id: 1,
      role: 'Frontend Engineer',
      company: 'Google',
      date: 'Jun 2, 2026',
      score: 91,
      tags: ['React', 'System Design', 'DSA'],
      status: 'completed',
      breakdown: {
        communication: 90,
        technical: 92,
        confidence: 88,
        clarity: 94,
      },
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      company: 'Razorpay',
      date: 'May 28, 2026',
      score: 78,
      tags: ['Node.js', 'SQL', 'APIs'],
      status: 'completed',
      breakdown: {
        communication: 80,
        technical: 75,
        confidence: 72,
        clarity: 84,
      },
    },
    {
      id: 3,
      role: 'SDE-2',
      company: 'Flipkart',
      date: 'May 20, 2026',
      score: 85,
      tags: ['Java', 'LLD', 'OOP'],
      status: 'completed',
      breakdown: {
        communication: 82,
        technical: 88,
        confidence: 84,
        clarity: 86,
      },
    },
    {
      id: 4,
      role: 'Backend Engineer',
      company: 'Zepto',
      date: 'May 12, 2026',
      score: 69,
      tags: ['Python', 'Microservices'],
      status: 'completed',
      breakdown: {
        communication: 65,
        technical: 70,
        confidence: 68,
        clarity: 74,
      },
    },
  ] satisfies Interview[],
  skills: [
    { name: 'Communication', score: 84, delta: +5 },
    { name: 'Technical Depth', score: 81, delta: +3 },
    { name: 'Confidence', score: 78, delta: +8 },
    { name: 'Problem Solving', score: 88, delta: +2 },
    { name: 'Clarity', score: 85, delta: -1 },
  ] satisfies Skill[],
  suggestions: [
    'Work on explaining trade-offs clearly during system design rounds.',
    'Practice STAR format for behavioral questions — your stories lack structure.',
    "Speed up your coding — you're accurate but slow on medium-level DSA.",
  ],
};

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'history' | 'skills';
const TABS: Tab[] = ['overview', 'history', 'skills'];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { overallScore, userName, interviews, skills, suggestions } = mockData;

  const handleToggle = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <Starfield count={60} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <HeroScore
          score={overallScore}
          userName={userName}
          onNewInterview={() => console.log('start new interview')}
        />

        <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
                Recent Sessions
              </h2>
              {interviews.slice(0, 3).map((inv) => (
                <InterviewCard
                  key={inv.id}
                  interview={inv}
                  isExpanded={expandedId === inv.id}
                  onToggle={handleToggle}
                  variant="compact"
                />
              ))}
            </div>

            <div className="space-y-5">
              <AISuggestions suggestions={suggestions} variant="list" />

              <div className="bg-[#12121a] border border-white/[0.07] rounded-xl p-5">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
                  Skill Radar
                </h3>
                <div className="space-y-3">
                  {skills.map((sk) => (
                    <SkillCard key={sk.name} skill={sk} variant="bar" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── History ── */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
              All Sessions
            </h2>
            {interviews.map((inv) => (
              <InterviewCard
                key={inv.id}
                interview={inv}
                isExpanded={expandedId === inv.id}
                onToggle={handleToggle}
                variant="full"
              />
            ))}
          </div>
        )}

        {/* ── Skills ── */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((sk) => (
              <SkillCard key={sk.name} skill={sk} variant="tile" />
            ))}
            <AISuggestions suggestions={suggestions} variant="grid" />
          </div>
        )}
      </div>
    </div>
  );
}
