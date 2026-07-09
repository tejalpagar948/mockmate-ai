// context/InterviewModalContext.tsx
'use client';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import JobDetailsModal, {
  JobDetails,
} from '@/components/homepage/modal/jobdetailsmodal';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import db from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { NextResponse } from "next/server"

const InterviewModalContext = createContext<{
  openModal: () => void;
  jsonResponse: string | undefined;
} | null>(null);

export function InterviewModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<string>();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Close the modal and reset loading state whenever the page pathname changes (successful navigation)
  useEffect(() => {
    setIsOpen(false);
    setLoading(false);
  }, [pathname]);

  // Listen for the "Start Interview" auth continuation intent
  useEffect(() => {
    if (!isLoaded) return;

    const params = new URLSearchParams(window.location.search);
    if (user && params.get('start_interview') === 'true') {
      setIsOpen(true);

      // Clean up the URL search parameters immediately to prevent modal reopening on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isLoaded, user]);

  // ✅ lives here
  const handleStartInterview = async (details: JobDetails) => {
    setLoading(true);
    try {
      const res = await fetch('/api/send-form-inputs', {
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
        if (resp) {
          router.push(`/dashboard/interview/${resp[0].mockId}`);
          return; // Do not clear loading state on success, it will clear on pathname change
        }
      }
      setLoading(false);

    } catch (error: any) {
      console.error(error);
      setLoading(false);

      const message = error?.message || "";
      const isQuotaError =
        error?.status === 429 ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("quota");

      alert(
        isQuotaError
          ? "You've hit the API rate limit. Please wait a minute and try again."
          : "Something went wrong while generating questions."
      );
    }
  };

  const openModal = () => {
    if (!user) {
      const intentRedirect = encodeURIComponent('/?start_interview=true');
      router.push(`/sign-in?fallbackRedirectUrl=${intentRedirect}`);
      return;
    } else {
      setIsOpen(true);
    }
  };

  console.log("jsonResponse", jsonResponse)
  return (
    <InterviewModalContext.Provider value={{ openModal, jsonResponse }}>
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

export const useInterviewModal = () => {
  const context = useContext(InterviewModalContext);
  if (!context) {
    throw new Error('useInterview must be used inside InterviewModalProvider');
  }
  return context;
};
