import { InterviewDataProvider } from "@/app/context/interview-data-context";
import { WebcamProvider } from "@/app/context/webcam-context";

export default async function InterviewLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ "interview-id": string }>;
}) {
    const { "interview-id": interviewId } = await params;

    return (
        <InterviewDataProvider interviewId={interviewId}>
            <WebcamProvider>
                {children}
            </WebcamProvider>
        </InterviewDataProvider>
    );
}