// app/dashboard/interview/[interview-id]/start/page.tsx
import { getInterviewDetails } from "@/utils/queries";
import { redirect } from "next/navigation";
import { InterviewDataProvider } from "@/app/context/interview-data-context";
import StartClient from "./StartClient";

interface StartPageProps {
  params: Promise<{ "interview-id": string }>;
}

export default async function StartPage({ params }: StartPageProps) {
  const { "interview-id": interviewId } = await params;
  const interviewData = await getInterviewDetails(interviewId);

  if (interviewData?.status === "completed") {
    redirect(`/dashboard/interview/${interviewId}/feedback`);
  }

  return (
    <InterviewDataProvider interviewId={interviewId} initialData={interviewData}>
      <StartClient />
    </InterviewDataProvider>
  );
}