// feedback/page.tsx
import Navbar from '@/components/homepage/sections/navbar';
import Footer from '@/components/homepage/sections/footer';
import FeedbackContent from "./feedback-content";
import { getFeedback } from "@/utils/queries";

export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ "interview-id": string }>;
}) {
    const { "interview-id": interviewId } = await params;

    const results = await getFeedback(interviewId);

    const feedbackList = results.map((item) => ({
        id: item.id,
        question: item.question,
        userAnswer: item.userAnswer ?? "",
        correctAnswer: item.correctAnswer ?? "",
        feedback: item.feedback ?? "",
        rating: Number(item.rating?.split("/")[0]) || 0,
    }));

    return (
        <>
            <Navbar variant="dashboard" />
            <main>
                <FeedbackContent feedbackList={feedbackList || []} />
            </main>
            <Footer />
        </>
    );
}