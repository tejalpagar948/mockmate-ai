"use client";

import { Check, FileBarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewCompletedProps {
    role?: string;
    totalQuestions?: number;
    duration?: string;
    interviewId: string;
}

export default function InterviewCompleted({
    role = "Frontend developer",
    totalQuestions = 5,
    duration = "12m 40s",
    interviewId,
}: InterviewCompletedProps) {
    const router = useRouter();

    const handleViewFeedback = () => {
        router.push(`/dashboard/interview/${interviewId}/feedback`);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="rounded-2xl px-8 py-12 flex flex-col items-center text-center gap-6">
                {/* Success icon */}
                <div className="w-22 h-22 rounded-full bg-violet-500/10 flex items-center justify-center p-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Heading */}
                <div>
                    <h1 className="text-white text-2xl font-medium mb-2">
                        Interview completed
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                        Great job! You answered all {totalQuestions} questions. Your
                        responses are being analyzed to generate a detailed performance
                        report.
                    </p>
                </div>

                {/* Summary strip */}
                <div className="w-full max-w-sm bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 flex justify-between">
                    <div className="text-left">
                        <p className="text-gray-500 text-xs mb-1">Role</p>
                        <p className="text-white text-sm font-medium">{role}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-gray-500 text-xs mb-1">Questions</p>
                        <p className="text-white text-sm font-medium">
                            {totalQuestions} of {totalQuestions}
                        </p>
                    </div>
                    <div className="text-left">
                        <p className="text-gray-500 text-xs mb-1">Duration</p>
                        <p className="text-white text-sm font-medium">{duration}</p>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handleViewFeedback}
                    className="mt-1 bg-gradient-to-b from-violet-500 to-violet-700 text-white px-8 py-3.5 rounded-full text-[15px] font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <FileBarChart2 className="w-[18px] h-[18px]" />
                    View feedback
                </button>

                <p className="text-gray-600 text-xs -mt-1">
                    Your feedback report will be ready in a few seconds.
                </p>
            </div>
        </div>
    );
}