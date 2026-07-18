"use client"

import { Volume2, Check, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface QuestionCardProps {
    question: string;
    onSkip: () => void;
    isLastQuestion?: boolean;
    userAnswer?: string;
    interimResult?: string;
}

export default function QuestionCard({ question, onSkip, userAnswer, interimResult, isLastQuestion }: QuestionCardProps) {

    const SPEECH_DELAY_MS = 900;

    useEffect(() => {
        if (!question) return;
        window.speechSynthesis.cancel();
        const timer = setTimeout(() => textToSpeech(question), SPEECH_DELAY_MS);
        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };
    }, [question]);

    const textToSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            const speech = window.speechSynthesis;
            speech.speak(new SpeechSynthesisUtterance(text));
        } else {
            toast.error("Your browser does not support text to speech");
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div
                className="relative rounded-3xl p-7 border border-white/5 overflow-hidden"
                style={{
                    background:
                        "radial-gradient(120% 100% at 0% 0%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.05) 45%, rgba(255,255,255,0.02) 100%)",
                }}
            >
                <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="text-xs font-semibold tracking-wide text-violet-400 uppercase">AI Interviewer</span>
                    <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors" onClick={() => textToSpeech(question)}>
                        <Volume2 size={15} className="text-gray-300" />
                    </button>
                </div>
                <p className="text-[16px] leading-relaxed font-medium text-gray-100">
                    {question}
                </p>
            </div>

            <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl p-5 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} className="text-emerald-400" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-emerald-400">Use STAR: </span>
                    set up the Situation, your Task, the Action you took, and the Result. Tap Record Answer when ready.
                </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex-1 min-h-[180px]">
                <p className="text-[11px] text-white/40 font-semibold tracking-wide mb-2">
                    YOUR ANSWER
                </p>
                <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">
                    {userAnswer || ''}
                    {interimResult && ` ${interimResult}`}
                </p>
            </div>

            {!isLastQuestion && (
                <button
                    onClick={onSkip}
                    className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                    Skip to next question
                    <ChevronRight size={15} />
                </button>
            )}
        </div>
    );
}