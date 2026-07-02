// components/dashboard/SkillCard.tsx

import { MiniBar } from './minibar';
import { getScoreTextColor } from '../utils/scoreColors';

export interface Skill {
  name: string;
  score: number;
  delta: number;
}

interface SkillCardProps {
  skill: Skill;
  /** 'bar' = inline label+bar row; 'tile' = full card with big number */
  variant?: 'bar' | 'tile';
}

export function SkillCard({ skill, variant = 'tile' }: SkillCardProps) {
  const { name, score, delta } = skill;

  if (variant === 'bar') {
    return (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/60">{name}</span>
          <div className="flex items-center gap-1.5">
            <span
              className={delta >= 0 ? 'text-green-400' : 'text-red-400'}
              style={{ fontSize: 10 }}>
              {delta >= 0 ? '▲' : '▼'}
              {Math.abs(delta)}
            </span>
            <span className="text-white/70 font-medium">{score}</span>
          </div>
        </div>
        <MiniBar value={score} />
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm">{name}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            delta >= 0
              ? 'bg-green-400/10 text-green-400'
              : 'bg-red-400/10 text-red-400'
          }`}>
          {delta >= 0 ? '+' : ''}
          {delta} pts
        </span>
      </div>

      <div className={`text-4xl font-bold mb-2 ${getScoreTextColor(score)}`}>
        {score}
      </div>
      <p className="text-white/30 text-xs mb-3">out of 100</p>

      <div className="w-full bg-white/5 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            score >= 85
              ? 'bg-green-400'
              : score >= 70
              ? 'bg-violet-400'
              : 'bg-red-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
