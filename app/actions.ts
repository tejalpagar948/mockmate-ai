'use server'

import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/utils/db";
import { UserAnswer, mockInterview } from "@/utils/schema";
import { eq, desc, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Send form inputs (Generate questions from AI + save mock interview to DB)
export async function sendFormInputsAction(params: {
    jobRole: string;
    experience: string;
    jobDescription: string;
}) {
    try {
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            throw new Error("Unauthorized");
        }
        const { jobRole, experience, jobDescription } = params;

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
            existingAnswerId
        } = params;

        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            throw new Error("Unauthorized");
        }

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
            const existing = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.id, existingAnswerId));

            if (!existing || existing.length === 0 || existing[0].userEmail !== userEmail) {
                throw new Error("Not found or access denied");
            }

            await db.update(UserAnswer)
                .set(payload)
                .where(eq(UserAnswer.id, existingAnswerId));

            return { success: true, id: existingAnswerId };
        } else {
            const interview = await db
                .select()
                .from(mockInterview)
                .where(
                    and(
                        eq(mockInterview.mockId, mockIdRef),
                        eq(mockInterview.createdBy, userEmail)
                    )
                );

            if (interview.length === 0) {
                throw new Error("Interview not found or access denied");
            }

            const resp = await db
                .insert(UserAnswer)
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
export async function generateFeedbackAction(mockIdRef: string) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            throw new Error("Unauthorized");
        }

        // Verify ownership before proceeding
        const ownershipCheck = await db
            .select()
            .from(mockInterview)
            .where(
                and(
                    eq(mockInterview.mockId, mockIdRef),
                    eq(mockInterview.createdBy, email)
                )
            );

        if (!ownershipCheck || ownershipCheck.length === 0) {
            throw new Error("Not found or access denied");
        }

        const answers = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, mockIdRef))
            .orderBy(UserAnswer.id);

        const pending = answers.filter(
            item => !item.feedback || !item.rating
        );

        if (pending.length === 0) {
            return { success: true };
        }

        const prompt = `
You are an expert technical interviewer.

Evaluate every answer independently.

For each answer return:

{
  "results":[
    {
      "rating":8,
      "feedback":"..."
    }
  ]
}

Questions:

${pending.map((item, index) => `
Question ${index + 1}
${item.question}

User Answer:
${item.userAnswer}
`).join("\n-----------------\n")}
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const cleaned = response.text
            ?.replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        if (!cleaned) {
            throw new Error("No response text received from Gemini");
        }

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", cleaned);
            throw new Error("Invalid response format received from AI");
        }

        if (!parsed.results || parsed.results.length < pending.length) {
            throw new Error("AI response did not cover all pending questions");
        }

        await db.transaction(async (tx) => {
            for (let i = 0; i < pending.length; i++) {
                await tx.update(UserAnswer)
                    .set({
                        rating: String(parsed.results[i].rating),
                        feedback: parsed.results[i].feedback,
                    })
                    .where(eq(UserAnswer.id, pending[i].id));
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error("generateFeedbackAction error:", error);
        throw new Error(`Failed to generate feedback: ${error?.message || error}`);
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
        const user = await currentUser();
        const userEmail = user?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            throw new Error("Unauthorized");
        }

        const { mockId, status } = params;
        const resp = await db.update(mockInterview)
            .set({ status })
            .where(
                and(
                    eq(mockInterview.mockId, mockId),
                    eq(mockInterview.createdBy, userEmail)
                )
            )
            .returning({ mockId: mockInterview.mockId });

        if (!resp || resp.length === 0) {
            throw new Error("Not found or access denied");
        }

        return { success: true };
    } catch (error: any) {
        console.error("updateInterviewStatusAction error:", error);
        throw new Error(`Failed to update interview status: ${error?.message || error}`);
    }
}



