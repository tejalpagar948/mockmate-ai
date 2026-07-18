"use client"

interface Question {
    question: string;
    answer: string;
}

interface QuestionTabsProps {
    questions: Question[];
    activeQ: number;
    onQuestionChange: (index: number) => void;
}

export default function QuestionTabs({ questions, activeQ, onQuestionChange }: QuestionTabsProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {questions.map((item, i) => (
                <button
                    key={i}
                    onClick={() => onQuestionChange(i)}
                    aria-selected={i === activeQ}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${i === activeQ
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    Question {i + 1}
                </button>
            ))}
        </div>
    );
}