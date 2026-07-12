import { InterviewDataProvider } from "@/app/context/interview-data-context";
import { WebcamProvider } from "@/app/context/webcam-context";
import { Toaster } from "sonner";
import { getInterviewDetailsAction } from "@/app/actions"; // 1. Import Server Action

export default async function InterviewLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ "interview-id": string }>;
}) {
    const { "interview-id": interviewId } = await params;

    // 2. Fetch using Server Action
    const interviewData = await getInterviewDetailsAction(interviewId);

    return (
        <InterviewDataProvider interviewId={interviewId} initialData={interviewData}>
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
