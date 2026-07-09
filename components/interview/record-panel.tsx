"use client";

import { Mic, ChevronLeft, ChevronRight, Square, Loader2 } from "lucide-react";
import NavControlButton from "./nav-control-button";

interface RecordPanelProps {
    isRecording: boolean;
    isSubmittingAnswer: boolean;
    seconds: number;
    userAnswer: string;
    interimResult: string | undefined;
    onRecord: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onEndInterview: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    isPending: boolean;
}

export default function RecordPanel({
    isRecording,
    isSubmittingAnswer,
    seconds,
    userAnswer,
    interimResult,
    onRecord,
    onPrevious,
    onNext,
    onEndInterview,
    hasPrevious,
    hasNext,
    isPending
}: RecordPanelProps) {

    const buttonLabel = (() => {
        if (isSubmittingAnswer) return "Analyzing your response";
        if (isRecording) return "Stop Recording";
        if (userAnswer.length > 0) return "Re-record Answer";
        return "Record Answer";
    })();

    return (
        <>
            <button
                onClick={onRecord}
                disabled={isSubmittingAnswer}
                className={`flex items-center justify-center gap-2 rounded-full py-3.5 font-medium text-[15px] transition-colors ${isRecording
                    ? "bg-white/10 text-white hover:bg-white/15"
                    : "bg-violet-600 text-white hover:bg-violet-500"
                    }`}
            >
                <Mic size={17} />
                {buttonLabel}
            </button>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-3">
                    {isRecording ? "Listening…" : "Your answer will appear here"}
                </p>
                <div className="flex items-center gap-1 h-8">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${isRecording ? "bg-violet-500" : "bg-white/10"
                                }`}
                            style={{
                                height: isRecording
                                    ? `${20 + Math.sin(i * 0.7 + seconds) * 60 + 20}%`
                                    : "15%",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <NavControlButton
                    label="Previous"
                    icon={ChevronLeft}
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                />
                <NavControlButton
                    label="Next"
                    icon={ChevronRight}
                    iconPosition="right"
                    onClick={onNext}
                    disabled={!hasNext}
                />
                <NavControlButton
                    label={isPending ? "Ending..." : "End Interview"}
                    icon={isPending ? Loader2 : Square}
                    onClick={onEndInterview}
                    variant="end"
                    disabled={hasNext}
                />
            </div>
        </>
    );
}