"use client"
import { useInterview } from "@/app/context/interview-data-context";
import { useWebcam } from "@/app/context/webcam-context";
import { useState, useRef, useEffect, useMemo } from "react";
import { Circle, Mic, Video, WebcamIcon } from "lucide-react";
import QuestionTabs from "@/components/interview/question-tabs";
import QuestionCard from "@/components/interview/question-card";
import LiveVideo from "@/components/interview/live-video";
import useSpeechToText from 'react-hook-speech-to-text';
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import RecordPanel from "@/components/interview/record-panel";
import { useRouter } from "next/navigation";

interface InterviewQuestionAnswers {
    question: string;
    answer: string;
}

export default function StartPage() {
    const { interviewData, loading, interviewId } = useInterview();
    const { isEnabled, isReady, enableCamera, disableCamera } = useWebcam();
    const [activeQ, setActiveQ] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [userAnswer, setUserAnswer] = useState<string>("");
    const { user } = useUser();
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
    const router = useRouter();
    const [savedAnswerIds, setSavedAnswerIds] = useState<{ [key: number]: number }>({});
    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const interviewQuestionAnswers = useMemo<InterviewQuestionAnswers[]>(() => {
        return interviewData?.jsonMockResp
            ? JSON.parse(interviewData.jsonMockResp).map((item: any) => ({
                question: item.Question,
                answer: item.Answer,
            }))
            : [];
    }, [interviewData?.jsonMockResp]);

    const interviewQuestion = interviewQuestionAnswers[activeQ]?.question ?? "";

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    const handleQuestionChange = (i: number) => {
        if (isRecording) stopSpeechToText();
        setActiveQ(i);
        setSeconds(0);
    };

    const handlePrevious = () => {
        if (isRecording) stopSpeechToText();
        setActiveQ((i) => Math.max(i - 1, 0));
        setSeconds(0);
    };

    const handleSkip = () => {
        if (isRecording) stopSpeechToText();
        setActiveQ((i) => Math.min(i + 1, interviewQuestionAnswers.length - 1));
        setSeconds(0);
    };

    const handleEndInterview = () => {
        if (isRecording) stopSpeechToText();
        disableCamera();
        router.push(`/dashboard/interview/${interviewId}/feedback`);
    };

    useEffect(() => {
        const answer = results
            .map((result) => typeof result === "string" ? result : result.transcript)
            .join(" ");

        setUserAnswer(answer);
    }, [results]);


    const handleRecord = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer?.length < 10) {
                toast.error("Answer too short. Please record at least a few sentences.");
                return;
            }
            setIsSubmittingAnswer(true);
            try {
                const result = await fetch('/api/generate-feedback', {
                    method: 'POST',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        question: interviewQuestion,
                        userAnswer: userAnswer
                    })
                });

                if (!result.ok) {
                    toast.error("Couldn't generate feedback. Please try again.");
                    return;
                }

                const json = await result.json();
                const feedbackJsonResponse = json.result.replace('```json', '').replace('```', '').trim();
                const parsedFeedback = JSON.parse(feedbackJsonResponse);

                // ✅ ab DB call yaha nahi, /api/save-answer route ko call karenge
                const saveResult = await fetch('/api/save-answer', {
                    method: 'POST',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        mockIdRef: interviewId,
                        question: interviewQuestion,
                        correctAnswer: interviewQuestionAnswers[activeQ]?.answer,
                        userAnswer: userAnswer,
                        feedback: parsedFeedback.feedback,
                        rating: parsedFeedback.rating,
                        userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
                        existingAnswerId: savedAnswerIds[activeQ] ?? null
                    })
                });

                if (!saveResult.ok) {
                    toast.error("Couldn't save your answer. Please try again.");
                    return;
                }

                const saveJson = await saveResult.json();

                // ✅ agar pehle se answer saved hai to update, warna insert (id route se aayi)
                const wasUpdate = Boolean(savedAnswerIds[activeQ]);
                setSavedAnswerIds(prev => ({ ...prev, [activeQ]: saveJson.id }));
                toast.success(wasUpdate ? "Answer updated successfully!" : "Answer saved successfully!");

            } catch (err) {
                console.error("handleRecord error:", err);
                toast.error("Something went wrong while saving your answer.");
            } finally {
                setIsSubmittingAnswer(false);
            }

        } else {
            // start ya re-record — dono same hi hai
            setResults([]);
            setUserAnswer("");
            startSpeechToText();
        }
    };

    return (
        <div className="min-h-screen bg-[#050408] text-white font-sans relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <main className="relative max-w-6xl mx-auto py-8">
                {/* Session header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Frontend Engineer <span className="text-gray-500 font-normal">at Mockmate AI</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Question {activeQ + 1} of {interviewQuestionAnswers.length}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                        <Circle
                            size={8}
                            className={isRecording ? "fill-red-500 text-red-500 animate-pulse" : "fill-gray-600 text-gray-600"}
                        />
                        <span className="text-sm font-medium tabular-nums text-gray-300">{formatTime(seconds)}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="flex flex-col gap-6">
                        <QuestionTabs
                            questions={interviewQuestionAnswers}
                            activeQ={activeQ}
                            onQuestionChange={handleQuestionChange}
                        />
                        <QuestionCard
                            question={interviewQuestion}
                            onSkip={handleSkip}
                            userAnswer={userAnswer}
                            interimResult={interimResult}
                            isLastQuestion={activeQ === interviewQuestionAnswers.length - 1}
                        />
                    </div>

                    {/* Right column — video + record */}
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-video rounded-3xl bg-[#111017] border border-white/5 overflow-hidden flex items-center justify-center">
                            {isEnabled ? (
                                <LiveVideo className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <WebcamIcon size={64} className="text-white/30" />
                                    <button
                                        onClick={enableCamera}
                                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                                    >
                                        <Video size={16} />
                                        Enable Camera & Mic
                                    </button>
                                </div>
                            )}

                            {isEnabled && !isReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <span className="text-xs text-gray-400">Requesting access…</span>
                                </div>
                            )}

                            {isRecording && (
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                                    <Circle size={8} className="fill-red-500 text-red-500 animate-pulse" />
                                    <span className="text-xs font-medium">Recording</span>
                                </div>
                            )}
                        </div>

                        <RecordPanel
                            isRecording={isRecording}
                            isSubmittingAnswer={isSubmittingAnswer}
                            seconds={seconds}
                            userAnswer={userAnswer}
                            interimResult={interimResult}
                            onRecord={handleRecord}
                            onPrevious={handlePrevious}
                            onNext={handleSkip}
                            onEndInterview={handleEndInterview}
                            hasPrevious={activeQ > 0}
                            hasNext={activeQ < interviewQuestionAnswers.length - 1}
                        />
                    </div>
                </div>
            </main >
        </div >
    );
}