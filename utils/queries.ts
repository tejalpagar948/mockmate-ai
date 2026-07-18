import { currentUser } from "@clerk/nextjs/server";
import db from "@/utils/db";
import { UserAnswer, mockInterview } from "@/utils/schema";
import { eq, and } from "drizzle-orm";

export async function getInterviewDetails(mockId: string) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            throw new Error("Unauthorized");
        }
        const data = await db
            .select()
            .from(mockInterview)
            .where(
                and(
                    eq(mockInterview.mockId, mockId),
                    eq(mockInterview.createdBy, email)
                )
            );

        if (!data || data.length === 0) {
            return null;
        }

        const interview = data[0];
        const result = {
            ...interview,
            createdAt: interview.createdAt.toISOString()
        };
        console.log("getInterviewDetails returning:", result);
        return result;
    } catch (error: any) {
        console.error("getInterviewDetails error:", error);
        throw new Error(`Failed to fetch interview details: ${error?.message || error}`);
    }
}

export async function getFeedback(mockIdRef: string) {
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

    const data = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, mockIdRef))
        .orderBy(UserAnswer.id);

    return data.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
    }));
}
