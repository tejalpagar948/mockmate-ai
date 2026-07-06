// components/dashboard/HeroScore.tsx
import { useInterview } from '@/app/context/interview-modal-context';

interface HeroScoreProps {
  score: number;
  maxScore?: number; // ✅ default 100, feedback page mein 10 pass karenge
  userName: string; // ✅ ye heading ki jagah use hoga
  greeting?: string; // ✅ "Welcome back," ki jagah "Interview complete" jaisa custom text
  subtitle?: string;
  onNewInterview?: () => void;
  showNewInterviewButton?: boolean; // ✅ feedback page pe hide karenge
}

export function HeroScore({
  score,
  maxScore = 100,
  userName,
  greeting = "Welcome back,",
  subtitle = "You're in the top 15% of candidates this month",
  onNewInterview,
  showNewInterviewButton = true,
}: HeroScoreProps) {
  const percent = (score / maxScore) * 100;

  const scoreColor =
    percent >= 85
      ? 'text-green-400'
      : percent >= 70
        ? 'text-violet-400'
        : 'text-red-400';
  const scoreBg =
    percent >= 85
      ? 'from-green-500/20 to-green-500/0'
      : 'from-violet-500/20 to-violet-500/0';
  const ringColor = percent >= 85 ? '#4ade80' : '#a78bfa';

  const { openModal } = useInterview();

  return (
    <div
      className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br ${scoreBg} bg-[#12121a] p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6`}>
      {/* Ring */}
      <div className="relative">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#ffffff0f"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeDasharray={`${(percent / 100) * 314} 314`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
          <span className="text-white/40 text-xs">/ {maxScore}</span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-white/50 text-sm mb-1">{greeting}</p>
        <h1 className="text-2xl font-semibold text-white mb-1">{userName}</h1>
        <p className="text-white/40 text-sm mb-4">{subtitle}</p>
      </div>

      {/* CTA — sirf tab dikhega jab showNewInterviewButton true hai */}
      {showNewInterviewButton && (
        <button
          onClick={onNewInterview ?? openModal}
          className="sm:ml-auto bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shrink-0">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          New Interview
        </button>
      )}
    </div>
  );
}