// app/dashboard/interview/[interview-id]/page.tsx
import { getInterviewDetails } from "@/utils/queries";
import { InterviewDataProvider } from "@/app/context/interview-data-context";
import InterviewClient from "./InterviewClient";

interface InterviewPageProps {
  params: Promise<{ "interview-id": string }>;
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { "interview-id": interviewId } = await params;
  const interviewData = await getInterviewDetails(interviewId);

  return (
    <InterviewDataProvider interviewId={interviewId} initialData={interviewData}>
      <InterviewClient />
    </InterviewDataProvider>
  );
}