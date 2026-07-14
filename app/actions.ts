'use server'

import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/utils/db";
import { UserAnswer, mockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Send form inputs (Generate questions from AI + save mock interview to DB)
export async function sendFormInputsAction(params: {
    jobRole: string;
    experience: string;
    jobDescription: string;
    userEmail: string;
}) {
    try {
        const { jobRole, experience, jobDescription, userEmail } = params;

        const InputPrompt = `Generate exactly 5 interview questions.
Role: ${jobRole}
Experience: ${experience}
Job Description:
${jobDescription}

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanation.

{
  "questions": [
    {
      "question": "",
      "answer": ""
    }
  ]
}`;

        console.time("Gemini");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: InputPrompt,
                        },
                    ],
                },
            ],
        });

        console.timeEnd("Gemini");

        const resultText = response.text;
        if (!resultText) {
            throw new Error("No response text received from Gemini");
        }

        const MockJsonResponse = resultText.replace('```json', '').replace('```', '').trim();

        const newMockId = uuidv4();
        const resp = await db.insert(mockInterview).values({
            mockId: newMockId,
            jsonMockResp: MockJsonResponse,
            jobPosition: jobRole,
            jobDesc: jobDescription,
            jobExperience: experience,
            createdBy: userEmail,
            createdAt: new Date(),
        }).returning({ mockId: mockInterview.mockId });

        if (!resp || resp.length === 0) {
            throw new Error("Failed to save mock interview to database");
        }

        return {
            success: true,
            mockId: resp[0].mockId,
            jsonMockResp: MockJsonResponse
        };
    } catch (error: any) {
        console.error("sendFormInputsAction error:", error);
        throw new Error(`Failed to generate interview questions: ${error?.message || error}`);
    }
}

// 2. Save/Update answer
export async function saveAnswerAction(params: {
    mockIdRef: string;
    question: string;
    correctAnswer?: string | null;
    userAnswer?: string | null;
    feedback?: string | null;
    rating?: string | null;
    userEmail?: string | null;
    existingAnswerId?: number | null;
}) {
    try {
        const {
            mockIdRef,
            question,
            correctAnswer,
            userAnswer,
            feedback,
            rating,
            userEmail,
            existingAnswerId
        } = params;

        const payload = {
            mockIdRef,
            question,
            correctAnswer,
            userAnswer,
            feedback,
            rating,
            userEmail,
            createdAt: new Date()
        };

        if (existingAnswerId) {
            await db.update(UserAnswer)
                .set(payload)
                .where(eq(UserAnswer.id, existingAnswerId));

            return { success: true, id: existingAnswerId };
        } else {
            const resp = await db.insert(UserAnswer)
                .values(payload)
                .returning({ id: UserAnswer.id });

            return { success: true, id: resp[0].id };
        }
    } catch (err: any) {
        console.error("saveAnswerAction error:", err);
        throw new Error(`Failed to save answer: ${err?.message || err}`);
    }
}

// 3. Generate feedback batch (Migration of generate-feedback-batch API)
export async function generateFeedbackBatchAction(params: { mockIdRef: string }) {
    try {
        const { mockIdRef } = params;

        const answers = await db.select().from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, mockIdRef));

        const pending = answers.filter((item) => !item.feedback || !item.rating);

        if (pending.length > 0) {
            await Promise.all(
                pending.map(async (ans) => {
                    try {
                        const prompt = `Question : ${ans.question} , UserAnswer : ${ans.userAnswer} , Depends on question and user answer please give us rating for answer and feedback as area of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

                        const response = await ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: [{ role: "user", parts: [{ text: prompt }] }],
                        });

                        const cleaned = response.text?.replace('```json', '').replace('```', '').trim();
                        if (!cleaned) throw new Error("No feedback response received from Gemini");

                        const parsed = JSON.parse(cleaned);

                        await db.update(UserAnswer)
                            .set({ feedback: parsed.feedback, rating: String(parsed.rating) })
                            .where(eq(UserAnswer.id, ans.id));
                    } catch (err) {
                        console.error(`Feedback generation failed for answer ${ans.id}:`, err);
                    }
                })
            );
        }

        const finalData = await db.select().from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, mockIdRef))
            .orderBy(UserAnswer.id);

        return {
            results: finalData.map((item) => ({
                ...item,
                createdAt: item.createdAt.toISOString(),
            })),
        };
    } catch (error: any) {
        console.error("generateFeedbackBatchAction error:", error);
        throw new Error(`Batch feedback generation failed: ${error?.message || error}`);
    }
}

// 4. Get user answer data
export async function getUserAnswerDataAction() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("Unauthorized");
        }

        const data = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""))
            .orderBy(desc(UserAnswer.createdAt));

        // Convert Dates to ISO strings or handle them for next.js serialization
        return data.map(item => ({
            ...item,
            createdAt: item.createdAt.toISOString()
        }));
    } catch (err: any) {
        console.error("getUserAnswerDataAction error:", err);
        throw new Error(`Failed to fetch user answer data: ${err?.message || err}`);
    }
}

// 5. Update mock interview status
export async function updateInterviewStatusAction(params: {
    mockId: string;
    status: 'pending' | 'completed';
}) {
    try {
        const { mockId, status } = params;
        const resp = await db.update(mockInterview)
            .set({ status })
            .where(eq(mockInterview.mockId, mockId))
            .returning({ mockId: mockInterview.mockId });

        if (!resp || resp.length === 0) {
            throw new Error("Interview not found");
        }

        return { success: true };
    } catch (error: any) {
        console.error("updateInterviewStatusAction error:", error);
        throw new Error(`Failed to update interview status: ${error?.message || error}`);
    }
}

// 6. Get single mock interview details
export async function getInterviewDetailsAction(mockId: string) {
    try {
        console.log("getInterviewDetailsAction called with mockId:", mockId);
        const data = await db
            .select()
            .from(mockInterview)
            .where(eq(mockInterview.mockId, mockId));

        console.log("getInterviewDetailsAction query data:", data);

        if (!data || data.length === 0) {
            return null;
        }

        const interview = data[0];
        const result = {
            ...interview,
            createdAt: interview.createdAt.toISOString()
        };
        console.log("getInterviewDetailsAction returning:", result);
        return result;
    } catch (error: any) {
        console.error("getInterviewDetailsAction error:", error);
        throw new Error(`Failed to fetch interview details: ${error?.message || error}`);
    }
}


