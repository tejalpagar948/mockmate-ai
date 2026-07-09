"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

export interface InterviewData {
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    jsonMockResp: string;
}

interface InterviewContextType {
    interviewData: InterviewData | null;
    loading: boolean;
    interviewId: string;
    refetchInterview: () => Promise<void>;
}

const InterviewDataContext = createContext<InterviewContextType | undefined>(
    undefined
);

interface InterviewDataProviderProps {
    interviewId: string;
    initialData: InterviewData | null;
    children: ReactNode;
}

export function InterviewDataProvider({
    interviewId,
    initialData,
    children,
}: InterviewDataProviderProps) {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(initialData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInterviewData(initialData);
    }, [initialData]);

    const refetchInterview = async () => {
        // No-op as fetching is handled server-side at layout level
    };

    return (
        <InterviewDataContext.Provider
            value={{
                interviewData,
                loading,
                interviewId,
                refetchInterview,
            }}
        >
            {children}
        </InterviewDataContext.Provider>
    );
}

export function useInterview() {
    const context = useContext(InterviewDataContext);

    if (!context) {
        throw new Error(
            "useInterview must be used within InterviewDataProvider"
        );
    }

    return context;
}