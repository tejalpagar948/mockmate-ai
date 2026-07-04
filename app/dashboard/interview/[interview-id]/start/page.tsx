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
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

interface InterviewQuestionAnswers {
    question: string;
    answer: string;
}

export default function StartPage() {
    const { interviewData, loading, interviewId } = useInterview();
    const { isEnabled, isReady, enableCamera } = useWebcam();
    const [activeQ, setActiveQ] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [userAnswer, setUserAnswer] = useState<string>("");
    const { user } = useUser();

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
        setActiveQ(i);
        setSeconds(0);
    };

    const handleSkip = () => {
        setActiveQ((i) => Math.min(i + 1, interviewQuestionAnswers.length - 1));
        setSeconds(0);
    };

    useEffect(() => {
        const answer = results
            .map((result) => result.transcript)
            .join(" ");

        setUserAnswer(answer);
    }, [results]);

    const handleRecord = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer?.length < 10) {
                alert("Error while saving your answer , Please record again")
                return
            }
            const feedbackPrompt = `Question : ${interviewQuestion} , UserAnswer : ${userAnswer} , Depends on question and user answer please give us rating for answer and feedback as area of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`
            try {
                const result = await fetch('/api/generate-feedback', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        question: interviewQuestion,
                        userAnswer: userAnswer
                    })
                })

                if (!result.ok) {
                    alert("Error while generating feedback")
                    return
                }
                const json = await result.json()
                console.log(json?.result)
                const feedbackJsonResponse = json.result.replace('```json', '').replace('```', '').trim();
                const parsedFeedback = JSON.parse(feedbackJsonResponse);
                console.log(parsedFeedback);
                const resp = await db.insert(UserAnswer).values({
                    mockIdRef: interviewId,
                    question: interviewQuestion,
                    correctAnswer: interviewQuestionAnswers[activeQ]?.answer,
                    userAnswer: userAnswer,
                    feedback: parsedFeedback.feedback,
                    rating: parsedFeedback.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
                    createdAt: new Date()
                })
                console.log(resp)
            } catch (err) {
                alert("Error while generating feedback" + err)
            }

        } else {
            setResults([]);
            setUserAnswer("");
            startSpeechToText();
        }
    };

    console.log(interviewData, interviewId)

    return (
        <div className="min-h-screen bg-[#050408] text-white font-sans relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <main className="relative max-w-6xl mx-auto px-6 py-8">
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
                                            height: isRecording ? `${20 + Math.sin(i * 0.7 + seconds) * 60 + 20}%` : "15%",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleRecord}
                            className={`flex items-center justify-center gap-2 rounded-full py-3.5 font-medium text-[15px] transition-colors ${isRecording
                                ? "bg-white/10 text-white hover:bg-white/15"
                                : "bg-violet-600 text-white hover:bg-violet-500"
                                }`}
                        >
                            <Mic size={17} />
                            {isRecording ? "Stop Recording" : "Record Answer"}
                        </button>
                        <p className="text-white whitespace-pre-wrap">
                            {userAnswer}
                            {interimResult && ` ${interimResult}`}
                        </p>
                        <button onClick={() => console.log(userAnswer)}>click</button>
                    </div>
                </div>
            </main>
        </div>
    );
}