// app/api/get-feedback/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser(); // request ke andar, server-side function

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const UserAnswerData = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""))
            // 👆 apne schema ka actual column name daalo (createdBy/userEmail/etc)
            .orderBy(desc(UserAnswer.createdAt));

        return NextResponse.json(UserAnswerData);
    } catch (err) {
        console.error("get-user-answer-data error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch user answer data" },
            { status: 500 }
        );
    }
}