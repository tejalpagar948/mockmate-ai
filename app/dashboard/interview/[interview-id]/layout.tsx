import { InterviewDataProvider } from "@/app/context/interview-data-context";
import { WebcamProvider } from "@/app/context/webcam-context";
import { Toaster } from "sonner";
import db from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export default async function InterviewLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ "interview-id": string }>;
}) {
    const { "interview-id": interviewId } = await params;

    const [interviewData] = await db
        .select()
        .from(mockInterview)
        .where(eq(mockInterview.mockId, interviewId));

    return (
        <InterviewDataProvider interviewId={interviewId} initialData={interviewData || null}>
            <WebcamProvider>
                {children}
                <Toaster
                    theme="dark"
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#111017",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "white",
                        },
                    }}
                />
            </WebcamProvider>
        </InterviewDataProvider>
    );
}