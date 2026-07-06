"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { HeroScore } from "@/components/dashboard/sections/heroscore";
import { useParams } from "next/navigation";

interface feedback {
    id: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    rating: number;
    feedback: string;
}

export default function FeedbackPage() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [ringProgress, setRingProgress] = useState(0);
    const params = useParams();
    const interviewId = params?.["interview-id"];
    const [feedbackList, setFeedbackList] = useState<feedback[]>([]);

    const countRating = feedbackList?.length
        ? (feedbackList?.reduce((sum, item) => sum + item?.rating, 0) / feedbackList?.length)
        : 0;

    const bestQuestion = feedbackList?.length
        ? feedbackList.reduce((best, item) =>
            item?.rating > best?.rating ? item : best
        )
        : null;

    const weakestQuestion = feedbackList?.length
        ? feedbackList.reduce((worst, item) =>
            item?.rating < worst?.rating ? item : worst
        )
        : null;

    useEffect(() => {
        setMounted(true);
        const timeout = setTimeout(() => setRingProgress(countRating), 300);
        return () => clearTimeout(timeout);
    }, [countRating]);

    const toggleExpand = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    // Unified color tokens (matches dashboard: emerald / violet / red)
    const tone = (rating: number) => {
        if (rating >= 8) return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-400", glow: "shadow-[0_0_20px_-4px_rgba(52,211,153,0.4)]" };
        if (rating >= 5) return { text: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "bg-violet-400", glow: "shadow-[0_0_20px_-4px_rgba(139,92,246,0.4)]" };
        return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-400", glow: "shadow-[0_0_20px_-4px_rgba(248,113,113,0.4)]" };
    };

    const GetFeedbackData = async () => {
        if (!interviewId) return;
        try {
            const response = await fetch(`/api/get-feedback?interviewId=${interviewId}`);
            if (response.ok) {
                const result = await response.json();
                const normalized = result.map((item: any) => ({
                    ...item,
                    rating: Number(item.rating?.split("/")[0]) || 0,
                }));

                setFeedbackList(normalized);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    useEffect(() => {
        GetFeedbackData();
    }, [interviewId]);

    console.log("feedbackList", feedbackList)

    return (
        <div className="min-h-screen bg-[#050408] text-white font-sans relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <main className="relative max-w-6xl mx-auto py-10 px-4">
                <HeroScore
                    score={Number(countRating)}
                    maxScore={10}
                    userName="Your Feedback Report"
                    greeting="Interview complete"
                    subtitle={`Reviewed across ${feedbackList.length} questions`}
                    showNewInterviewButton={false}
                />

                {/* Quick insight strip */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8 mt-8">
                    {bestQuestion && (
                        <button
                            onClick={() => setExpandedId(bestQuestion.id)}
                            className={`...`}
                            style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-emerald-400" />
                                <span className="text-xs uppercase tracking-wide font-medium text-emerald-400">Strongest Answer</span>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 text-left">{bestQuestion.question}</p>
                        </button>
                    )}
                    {weakestQuestion && <button
                        onClick={() => setExpandedId(weakestQuestion.id)}
                        className={`text-left bg-[#12121a] hover:border-red-500/40 hover:-translate-y-0.5 rounded-2xl p-5 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{ transitionDelay: mounted ? "300ms" : "0ms" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown size={16} className="text-red-400" />
                            <span className="text-xs uppercase tracking-wide font-medium text-red-400">Needs Improvement</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{weakestQuestion.question}</p>
                    </button>}
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
                                className={`bg-[#12121a] rounded-3xl overflow-hidden transition-all duration-500  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                style={{ transitionDelay: mounted ? `${350 + index * 80}ms` : "0ms" }}
                            >
                                <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="w-full flex items-center justify-between gap-4 p-5 text-left group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Score badge — matches dashboard's 91/78/85 boxes */}
                                        <div className={`shrink-0 w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex flex-col items-center justify-center`}>
                                            <span className={`text-lg font-bold leading-none ${c.text}`}>{item?.rating}</span>
                                            <span className="text-[10px] text-gray-500 leading-none mt-1">/10</span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-md text-white truncate group-hover:text-violet-200 transition-colors mb-1.5">
                                                {item?.question}
                                            </p>

                                        </div>
                                    </div>

                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-400" : ""}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 grid gap-3 accordion-open">
                                        <div className="!bg-[#ef444415] rounded-2xl p-4 fade-in-item">
                                            <p className="text-xs font-medium text-red-400 mb-1.5">Your Answer</p>
                                            <p className="text-sm text-gray-300">{item?.userAnswer}</p>
                                        </div>
                                        <div className="bg-emerald-500/5 rounded-2xl p-4 fade-in-item">
                                            <p className="text-xs font-medium text-emerald-400 mb-1.5">Correct Answer</p>
                                            <p className="text-sm text-gray-300">{item?.correctAnswer}</p>
                                        </div>
                                        <div className="!bg-[#8b5cf615] rounded-2xl p-4 fade-in-item">
                                            <p className="text-xs font-medium text-violet-400 mb-1.5">Feedback</p>
                                            <p className="text-sm text-gray-300">{item?.feedback}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );

                    })}
                </div>

                <div
                    className={`flex justify-center mt-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: mounted ? "800ms" : "0ms" }}
                >
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 hover:scale-105 text-white text-sm font-medium px-6 py-3 rounded-full transition-all"
                    >
                        <Home size={16} />
                        Go to Home
                    </Link>
                </div>
            </main>

            <style jsx>{`
                .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.25; }
                .orb-1 { width: 320px; height: 320px; background: #8b5cf6; top: -80px; left: -80px; animation: float1 14s ease-in-out infinite; }
                .orb-2 { width: 280px; height: 280px; background: #6d28d9; bottom: 0px; right: -60px; animation: float2 16s ease-in-out infinite; }
                @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, 60px); } }
                @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, -40px); } }
                @keyframes fadeInItem { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in-item { animation: fadeInItem 0.35s ease-out; }
                @keyframes accordionOpen { from { opacity: 0; } to { opacity: 1; } }
                .accordion-open { animation: accordionOpen 0.25s ease-out; }
            `}</style>
        </div>
    );
}