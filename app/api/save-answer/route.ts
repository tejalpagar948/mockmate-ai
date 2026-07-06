import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            mockIdRef,
            question,
            correctAnswer,
            userAnswer,
            feedback,
            rating,
            userEmail,
            existingAnswerId // agar update karna hai to ye id aayegi
        } = body;

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

            return NextResponse.json({ success: true, id: existingAnswerId });
        } else {
            const resp = await db.insert(UserAnswer)
                .values(payload)
                .returning({ id: UserAnswer.id });

            return NextResponse.json({ success: true, id: resp[0].id });
        }
    } catch (err) {
        console.error("save-answer error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to save answer" },
            { status: 500 }
        );
    }
}