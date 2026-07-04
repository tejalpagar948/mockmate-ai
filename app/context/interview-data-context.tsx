"use client"
import { createContext, useContext, useEffect, useState } from "react"
import db from "@/utils/db"
import { eq } from "drizzle-orm"
import { mockInterview } from "@/utils/schema"

export interface InterviewData {
    jobPosition: string
    jobDesc: string
    jobExperience: string
    jsonMockResp: string
}

interface InterviewContextType {
    interviewData: InterviewData | null
    loading: boolean
    interviewId: string
}

const InterviewDataContext = createContext<InterviewContextType>({
    interviewData: null,
    loading: true,
    interviewId: "",
})

export function InterviewDataProvider({
    interviewId,
    children,
}: {
    interviewId: string
    children: React.ReactNode
}) {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!interviewId) {
            setLoading(false);
            return;
        }
        const fetchInterview = async () => {
            setLoading(true)
            try {
                const result = await db
                    .select()
                    .from(mockInterview)
                    .where(eq(mockInterview.mockId, interviewId))
                setInterviewData(result[0] as InterviewData)
            } catch (err) {
                console.error("Failed to fetch interview:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchInterview()
    }, [interviewId])

    return (
        <InterviewDataContext.Provider value={{ interviewData, loading, interviewId }}>
            {children}
        </InterviewDataContext.Provider>
    )
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