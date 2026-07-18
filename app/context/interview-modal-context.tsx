// context/InterviewModalContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { JobDetails } from '@/components/homepage/modal/jobdetailsmodal';
import { useUser } from '@clerk/nextjs';
import { sendFormInputsAction } from '@/app/actions';
import { toast } from 'sonner';

interface InterviewModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleStartInterview: (details: JobDetails) => Promise<void>;
  loading: boolean;
  jsonResponse: string | undefined;
}

const InterviewModalContext = createContext<InterviewModalContextType | null>(null);

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

  useEffect(() => {
    setIsOpen(false);
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoaded) return;

    const params = new URLSearchParams(window.location.search);
    if (user && params.get('start_interview') === 'true') {
      setIsOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isLoaded, user]);

  // 👇 useCallback lagaya — function ka reference stable rahega
  const handleStartInterview = useCallback(async (details: JobDetails) => {
    setLoading(true);
    try {
      const data = await sendFormInputsAction({
        jobRole: details.jobPosition,
        experience: details.yearsOfExperience,
        jobDescription: details.skills,
      });

      if (!data || !data.success || !data.mockId) {
        throw new Error('Invalid response from the server.');
      }

      setJsonResponse(data.jsonMockResp);
      router.push(`/dashboard/interview/${data.mockId}`);
      return;
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      const message = error?.message || "";
      const isQuotaError =
        error?.status === 429 ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("quota");

      toast.error(
        isQuotaError
          ? "You've hit the API rate limit. Please wait a minute and try again."
          : "Something went wrong while generating questions."
      );
    }
  }, [router]);

  const openModal = useCallback(() => {
    if (!user) {
      const intentRedirect = encodeURIComponent('/?start_interview=true');
      router.push(`/sign-in?fallbackRedirectUrl=${intentRedirect}`);
      return;
    }
    setIsOpen(true);
  }, [user, router]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
      handleStartInterview,
      loading,
      jsonResponse,
    }),
    [isOpen, openModal, closeModal, handleStartInterview, loading, jsonResponse]
  );

  return (
    <InterviewModalContext.Provider value={value}>
      {children}
    </InterviewModalContext.Provider>
  );
}

export const useInterviewModal = () => {
  const context = useContext(InterviewModalContext);
  if (!context) {
    throw new Error('useInterviewModal must be used inside InterviewModalProvider');
  }
  return context;
};