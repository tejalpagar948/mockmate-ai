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
        <div className="flex flex-wrap gap-2">
            {questions.map((item, i) => (
                <button
                    key={i}
                    onClick={() => onQuestionChange(i)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === activeQ
                            ? "bg-violet-600 text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    Question #{i + 1}
                </button>
            ))}
        </div>
    );
}