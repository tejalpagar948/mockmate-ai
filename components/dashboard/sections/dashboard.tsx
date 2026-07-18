'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroScore } from './heroscore';
import { TabBar } from './tabbar';
import { InterviewCard } from './interviewcard';
import { useInterviewModal } from '@/app/context/interview-modal-context';
import { useUser } from '@clerk/nextjs';

const JobDetailsModal = dynamic(
  () => import('@/components/homepage/modal/jobdetailsmodal'),
  { ssr: false }
);

type Tab = 'overview' | 'history' | 'skills';
const TABS: Tab[] = ['overview', 'history', 'skills'];

interface InterviewData {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdBy: string;
  createdAt: Date;
  mockId: string;
}

interface DashboardProps {
  interviewList: InterviewData[];
}

export default function Dashboard({ interviewList }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { isOpen, closeModal, handleStartInterview, loading } = useInterviewModal();

  const handleToggle = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const { user } = useUser();
  const displayGreeting = user?.firstName ? `${user.firstName}` : "Candidate";


  return (
    <main>
      <HeroScore score={87} userName={displayGreeting} />
      <div className='relative z-10 mx-auto max-w-7xl px-6 pb-10 lg:px-8'>
        <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
                Recent Sessions
              </h2>
              {interviewList.slice(0, 3).map((inv) => (
                <InterviewCard
                  key={inv.id}
                  interview={inv}
                  isExpanded={expandedId === inv.id}
                  onToggle={handleToggle}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
              All Sessions
            </h2>
            {interviewList.map((inv) => (
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

        {activeTab === 'skills' && <div>No skills</div>}
      </div>
      <JobDetailsModal
        open={isOpen}
        onClose={closeModal}
        onSubmit={handleStartInterview}
        loading={loading}
      />
    </main>
  );
}