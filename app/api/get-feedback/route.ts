// app/api/get-feedback/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const interviewId = searchParams.get("interviewId");

        if (!interviewId) {
            return NextResponse.json(
                { success: false, error: "Missing interviewId" },
                { status: 400 }
            );
        }

        const feedbackData = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewId))
            .orderBy(UserAnswer.id);

        return NextResponse.json(feedbackData);
    } catch (err) {
        console.error("get-feedback error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch feedback" },
            { status: 500 }
        );
    }
}