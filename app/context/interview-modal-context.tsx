// context/InterviewModalContext.tsx
'use client';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import JobDetailsModal, {
  JobDetails,
} from '@/components/homepage/modal/jobdetailsmodal';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import db from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import moment from 'moment';
import { NextResponse } from "next/server"

const InterviewModalContext = createContext<{
  openModal: () => void;
} | null>(null);

export function InterviewModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState();
  const { user } = useUser();
  const router = useRouter();

  // ✅ lives here
  const handleStartInterview = async (details: JobDetails) => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole: details.jobPosition,
          experience: details.yearsOfExperience,
          jobDescription: details.skills,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data || typeof data.result !== 'string') {
        throw new Error(data?.error || 'Invalid response from the server.');
      }

      const MockJsonResponse = data.result.replace('```json', '').replace('```', '').trim();
      console.log(JSON.parse(MockJsonResponse));
      setJsonResponse(MockJsonResponse);

      if (MockJsonResponse) {
        const resp = await db.insert(mockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResponse,
          jobPosition: details.jobPosition,
          jobDesc: details.skills,
          jobExperience: details.yearsOfExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress ?? '',
          createdAt: new Date(),
        }).returning({ mockId: mockInterview.mockId });
        console.log("resp", resp);
        if (resp) {
          setIsOpen(false);
          router.push(`/dashboard/interview/${resp[0].mockId}`);
        }
      }

    } catch (error: any) {
      console.error("Error generating interview questions:", error);

      const message = error?.message || "";
      const isQuotaError =
        error?.status === 429 ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("quota");

      return NextResponse.json(
        {
          error: isQuotaError
            ? "You've hit the API rate limit. Please wait a minute and try again."
            : "Something went wrong while generating questions.",
        },
        { status: isQuotaError ? 429 : 500 }
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = useCallback(() => setIsOpen(true), []);
  const contextValue = useMemo(() => ({
    openModal,
  }), [openModal]);

  return (
    <InterviewModalContext.Provider value={contextValue}>
      {children}
      <JobDetailsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleStartInterview}
        loading={loading}
      />
    </InterviewModalContext.Provider>
  );
}

export const useInterview = () => {
  const context = useContext(InterviewModalContext);
  if (!context) {
    throw new Error('useInterview must be used inside InterviewModalProvider');
  }
  return context;
};
