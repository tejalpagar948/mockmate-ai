"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

export interface FeedbackItem {
    id: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    rating: number;
    feedback: string;
}

interface FeedbackDetailsProps {
    feedbackList: FeedbackItem[];
    bestQuestion: FeedbackItem | null;
    weakestQuestion: FeedbackItem | null;
}

export default function FeedbackDetails({
    feedbackList,
    bestQuestion,
    weakestQuestion,
}: FeedbackDetailsProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    // Unified color tokens (matches dashboard: emerald / violet / red)
    const tone = (rating: number) => {
        if (rating >= 8) {
            return {
                text: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                bar: "bg-emerald-400",
                glow: "shadow-[0_0_20px_-4px_rgba(52,211,153,0.4)]",
            };
        }
        if (rating >= 5) {
            return {
                text: "text-violet-300",
                bg: "bg-violet-500/10",
                border: "border-violet-500/20",
                bar: "bg-violet-400",
                glow: "shadow-[0_0_20px_-4px_rgba(139,92,246,0.4)]",
            };
        }
        return {
            text: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            bar: "bg-red-400",
            glow: "shadow-[0_0_20px_-4px_rgba(248,113,113,0.4)]",
        };
    };

    return (
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-4 pb-4 lg:px-8 lg:pt-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-8 mt-8">
                {bestQuestion && (
                    <button
                        onClick={() => setExpandedId(bestQuestion.id)}
                        className={`text-left bg-[#12121a] hover:border-red-500/40 hover:-translate-y-0.5 rounded-2xl p-5 transition-all duration-500 opacity-100 translate-y-0`}
                        style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-emerald-400" />
                            <span className="text-xs uppercase tracking-wide font-medium text-emerald-400">
                                Strongest Answer
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2 text-left">
                            {bestQuestion.question}
                        </p>
                    </button>
                )}
                {weakestQuestion && (
                    <button
                        onClick={() => setExpandedId(weakestQuestion.id)}
                        className={`text-left bg-[#12121a] hover:border-red-500/40 hover:-translate-y-0.5 rounded-2xl p-5 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                        style={{ transitionDelay: mounted ? "300ms" : "0ms" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown size={16} className="text-red-400" />
                            <span className="text-xs uppercase tracking-wide font-medium text-red-400">
                                Needs Improvement
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">
                            {weakestQuestion.question}
                        </p>
                    </button>
                )}
            </div>

            <p className="text-lg uppercase tracking-wide text-gray-100 font-bold mb-3 px-1">
                All Questions
            </p>

            <div className="flex flex-col gap-3">
                {feedbackList.map((item, index) => {
                    const isOpen = expandedId === item?.id;
                    const c = tone(item?.rating);
                    return (
                        <div
                            key={item?.id}
                            className={`bg-[#12121a] rounded-3xl overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                }`}
                            style={{ transitionDelay: mounted ? `${350 + index * 80}ms` : "0ms" }}
                        >
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="w-full flex items-center justify-between gap-4 p-5 text-left group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Score badge — matches dashboard's 91/78/85 boxes */}
                                    <div
                                        className={`shrink-0 w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex flex-col items-center justify-center`}
                                    >
                                        <span className={`text-lg font-bold leading-none ${c.text}`}>
                                            {item?.rating}
                                        </span>
                                        <span className="text-[10px] text-gray-500 leading-none mt-1">
                                            /10
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-md text-white truncate group-hover:text-violet-200 transition-colors mb-1.5">
                                            {item?.question}
                                        </p>
                                    </div>
                                </div>

                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-400" : ""
                                        }`}
                                />
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5 grid gap-3 accordion-open">
                                    <div className="!bg-[#ef444415] rounded-2xl p-4 fade-in-item">
                                        <p className="text-xs font-medium text-red-400 mb-1.5">
                                            Your Answer
                                        </p>
                                        <p className="text-sm text-gray-300">{item?.userAnswer}</p>
                                    </div>
                                    <div className="bg-emerald-500/5 rounded-2xl p-4 fade-in-item">
                                        <p className="text-xs font-medium text-emerald-400 mb-1.5">
                                            Correct Answer
                                        </p>
                                        <p className="text-sm text-gray-300">{item?.correctAnswer}</p>
                                    </div>
                                    <div className="!bg-[#8b5cf615] rounded-2xl p-4 fade-in-item">
                                        <p className="text-xs font-medium text-violet-400 mb-1.5">
                                            Feedback
                                        </p>
                                        <p className="text-sm text-gray-300">{item?.feedback}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
