// app/dashboard/interview/[interview-id]/feedback/page.tsx
import Navbar from '@/components/homepage/sections/navbar';
import Footer from '@/components/homepage/sections/footer';
import FeedbackContent from "./feedback-content";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ "interview-id": string }>;
}) {
    const { "interview-id": interviewId } = await params;

    let feedback = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

    // ✅ Jinka feedback abhi tak null hai, unke liye Gemini call karo
    const pending = feedback.filter((item) => !item.feedback || !item.rating);

    if (pending.length > 0) {
        await Promise.all(
            pending.map(async (item) => {
                try {
                    const prompt = `Question : ${item.question} , UserAnswer : ${item.userAnswer} , Depends on question and user answer please give us rating for answer and feedback as area of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                    });

                    const cleaned = response?.text
                        ?.replace('```json', '')
                        ?.replace('```', '')
                        ?.trim();
                    if (!cleaned) {
                        throw new Error("No feedback response received from Gemini");
                    }
                    const parsed = JSON.parse(cleaned);

                    await db
                        .update(UserAnswer)
                        .set({ feedback: parsed.feedback, rating: String(parsed.rating) })
                        .where(eq(UserAnswer.id, item.id));

                } catch (err) {
                    console.error(`Feedback generation failed for answer ${item.id}:`, err);
                }
            })
        );

        // ✅ Update ke baad fresh data dobara fetch karo
        feedback = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewId))
            .orderBy(UserAnswer.id);
    }

    const feedbackList = feedback.map((item) => ({
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
                <FeedbackContent feedbackList={feedbackList} />
            </main>
            <Footer />
        </>
    );
}