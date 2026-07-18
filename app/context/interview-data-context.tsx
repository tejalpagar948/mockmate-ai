"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo
} from "react";

export interface InterviewData {
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    jsonMockResp: string;
    status: "pending" | "completed";
}

interface InterviewContextType {
    interviewData: InterviewData | null;
    loading: boolean;
    interviewId: string;
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
    const [interviewData, setInterviewData] =
        useState<InterviewData | null>(initialData);

    const [loading, setLoading] = useState(false);

    const contextValue = useMemo(() => ({
        interviewData,
        loading,
        interviewId,
    }), [interviewData, loading, interviewId]);

    return (
        <InterviewDataContext.Provider
            value={contextValue}>
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