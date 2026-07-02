// utils/scoreColors.ts

/**
 * Returns Tailwind text color class based on score value.
 */
export function getScoreTextColor(score: number): string {
  if (score >= 85) return 'text-green-400';
  if (score >= 70) return 'text-violet-400';
  return 'text-red-400';
}

/**
 * Returns Tailwind background color class based on score value.
 */
export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-green-400/10';
  if (score >= 70) return 'bg-violet-400/10';
  return 'bg-red-400/10';
}

/**
 * Returns hex color string based on score value.
 */
export function getScoreHexColor(score: number): string {
  if (score >= 85) return '#4ade80';
  if (score >= 70) return '#a78bfa';
  return '#f87171';
}
