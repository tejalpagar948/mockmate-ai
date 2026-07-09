import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { mockIdRef } = await req.json();

        const answers = await db.select().from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, mockIdRef));

        // parallel generation — sequential nahi, warna slow
        const results = await Promise.all(
            answers.map(async (ans) => {
                const prompt = `Question : ${ans.question} , UserAnswer : ${ans.userAnswer} , Depends on question and user answer please give us rating for answer and feedback as area of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                });

                const cleaned = response.text?.replace('```json', '').replace('```', '').trim();
                if (!cleaned) {
                    throw new Error("No feedback response received from Gemini");
                }
                const parsed = JSON.parse(cleaned);

                await db.update(UserAnswer)
                    .set({ feedback: parsed.feedback, rating: parsed.rating })
                    .where(eq(UserAnswer.id, ans.id));

                return { ...ans, feedback: parsed.feedback, rating: parsed.rating };
            })
        );

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Batch feedback error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}