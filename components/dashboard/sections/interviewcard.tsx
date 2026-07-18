// components/dashboard/InterviewCard.tsx
"use client"
import Link from 'next/link';

export interface Interview {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdBy: string;
  createdAt: Date;
  mockId: string;
}

export interface UserAnswer {
  id: number;
  mockIdRef: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  rating: string;
  feedback: string;
  userEmail: string;
  createdAt: Date;
}

interface InterviewCardProps {
  interview: Interview;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  /** 'compact' shows smaller score box; 'full' shows larger with extra padding */
  variant?: 'compact' | 'full';
}

export function InterviewCard({
  interview,
  isExpanded,
  onToggle,
  variant = 'compact',
}: InterviewCardProps) {
  const {
    id,
    jobPosition,
    jobExperience,
    createdAt,
    jsonMockResp,
    jobDesc,
    createdBy,
    mockId,
  } = interview;

  const scoreBoxSize =
    variant === 'full' ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-xl';

  const padding = variant === 'full' ? 'p-5' : 'p-4';

  //  const textColor = getScoreTextColor(score);
  // const bgColor = getScoreBgColor(score);

  return (
    <div className={`bg-[#12121a] border border-white/[0.07] rounded-xl ${padding} cursor-pointer hover:border-violet-500/30 transition-all`}>
      <Link
        href={`/dashboard/interview/${mockId}/feedback`}
      // onClick={() => onToggle(id)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-medium text-sm">{jobPosition}</span>
              <span className="text-white/30 text-xs">
                {variant === 'full' ? `· ${jobExperience}` : `at ${jobExperience}`}
              </span>
            </div>
            <p className="text-white/30 text-xs mb-2">
              {createdAt ? new Date(createdAt).toDateString() : "Unknown date"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {jobDesc.split(",").map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full border border-white/[0.07]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Score badge */}
          {/* <div
          className={`${bgColor} ${textColor} ${scoreBoxSize} font-bold rounded-xl flex items-center justify-center shrink-0`}>
          {score}
        </div> */}
        </div>

        {/* Expanded breakdown */}
        {/* {isExpanded && (
        <div
          className={`mt-4 pt-4 border-t border-white/[0.06] grid gap-3 ${variant === 'full' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
            }`}>
          {Object.entries(breakdown).map(([key, value]) =>
            variant === 'full' ? (
              <div
                key={key}
                className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                <p className="text-white/40 text-xs capitalize mb-1">{key}</p>
                <p className={`text-lg font-bold ${getScoreTextColor(value)}`}>
                  {value}
                </p>
                <MiniBar value={value} />
              </div>
            ) : (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50 capitalize">{key}</span>
                  <span className="text-white/70">{value}</span>
                </div>
                <MiniBar value={value} />
              </div>
            )
          )}
        </div>
      )} */}
      </Link >
    </div>
  );
}
