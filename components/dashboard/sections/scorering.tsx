// components/dashboard/ScoreRing.tsx

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? '#4ade80' : score >= 70 ? '#a78bfa' : '#f87171';

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#ffffff12"
        strokeWidth="6"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fill: color,
          fontSize: size < 60 ? '12px' : '16px',
          fontWeight: 700,
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
        }}>
        {score}
      </text>
    </svg>
  );
}
