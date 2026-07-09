"use client";

import { HeroScore } from "@/components/dashboard/sections/heroscore";
import FeedbackDetails, {
    FeedbackItem,
} from "@/components/dashboard/sections/feedbackdetails";

interface FeedbackContentProps {
    feedbackList: FeedbackItem[];
}

export default function FeedbackContent({
    feedbackList,
}: FeedbackContentProps) {
    const countRating = feedbackList.length
        ? Math.floor(feedbackList.reduce((sum, item) => sum + item.rating, 0) /
            feedbackList.length)
        : 0;

    const bestQuestion = feedbackList.length
        ? feedbackList.reduce((best, item) =>
            item.rating > best.rating ? item : best
        )
        : null;

    const weakestQuestion = feedbackList.length
        ? feedbackList.reduce((worst, item) =>
            item.rating < worst.rating ? item : worst
        )
        : null;

    return (
        <>
            <HeroScore
                score={Number(countRating)}
                maxScore={10}
                userName="Your Feedback Report"
                greeting="Interview complete"
                subtitle={`Reviewed across ${feedbackList.length} questions`}
                showNewInterviewButton={false}
            />

            <FeedbackDetails
                feedbackList={feedbackList}
                bestQuestion={bestQuestion}
                weakestQuestion={weakestQuestion}
            />
        </>
    );
}