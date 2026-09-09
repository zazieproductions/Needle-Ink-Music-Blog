import { memo } from 'react';
import { scoreColor, scoreLabel } from '../lib/format';

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const dims = {
    sm: 'h-9 w-9 text-[15px]',
    md: 'h-12 w-12 text-xl',
    lg: 'h-20 w-20 text-4xl',
    xl: 'h-28 w-28 text-6xl',
  }[size];
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${dims} font-display stamp flex shrink-0 rotate-[-4deg] items-center justify-center rounded-full font-black text-white shadow-[2px_2px_0_rgba(0,0,0,.85)]`}
        style={{ background: scoreColor(score) }}
        title={`${score.toFixed(1)} — ${scoreLabel(score)}`}
      >
        <span className="translate-y-[1px]">{score.toFixed(1)}</span>
      </div>
      {(size === 'lg' || size === 'xl') && (
        <span className="font-mono2 text-[10px] font-bold tracking-widest uppercase opacity-80">{scoreLabel(score)}</span>
      )}
    </div>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/15">
        <div className="h-full rounded-full" style={{ width: `${score * 10}%`, background: scoreColor(score) }} />
      </div>
      <span className="font-display text-sm font-black" style={{ color: scoreColor(score) }}>{score.toFixed(1)}</span>
    </div>
  );
}

export default memo(ScoreBadge);
