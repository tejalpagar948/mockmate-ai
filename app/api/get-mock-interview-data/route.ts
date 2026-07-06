// app/api/get-feedback/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import { mockInterview } from "@/utils/schema";
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

        const feedbackData = await db
            .select()
            .from(mockInterview)
            .where(eq(mockInterview.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""))
            // 👆 apne schema ka actual column name daalo (createdBy/userEmail/etc)
            .orderBy(desc(mockInterview.id));

        return NextResponse.json(feedbackData);
    } catch (err) {
        console.error("get-feedback error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch feedback" },
            { status: 500 }
        );
    }
}