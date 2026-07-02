// components/dashboard/MiniBar.tsx

interface MiniBarProps {
  value: number;
}

export function MiniBar({ value }: MiniBarProps) {
  const color =
    value >= 85 ? 'bg-green-400' : value >= 70 ? 'bg-violet-400' : 'bg-red-400';

  return (
    <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
      <div
        className={`${color} h-1.5 rounded-full transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
