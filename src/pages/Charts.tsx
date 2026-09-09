import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ALL_REVIEWS, topOfYear } from '../data/catalog';
import { writerById } from '../data/writers';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { hashStr } from '../lib/format';

function moveFor(r: (typeof ALL_REVIEWS)[number]): 'up' | 'down' | 'same' {
  const v = hashStr(r.id + 'chart') % 3;
  return v === 0 ? 'up' : v === 1 ? 'down' : 'same';
}

export function ChartRow({ r, rank, showMove = true }: { r: (typeof ALL_REVIEWS)[number]; rank: number; showMove?: boolean }) {
  const mv = moveFor(r);
  return (
    <Link to={`/reviews/${r.slug}`} className="group flex items-center gap-3 border-b border-black/15 py-3 sm:gap-4">
      <span className={`font-display w-10 shrink-0 text-3xl font-black italic sm:text-4xl ${rank <= 3 ? 'text-[var(--color-accent)]' : 'text-black/25'}`}>{rank}</span>
      {showMove && (
        <span className="hidden w-6 shrink-0 sm:block">
          {mv === 'up' ? <TrendingUp size={15} className="text-green-700" /> : mv === 'down' ? <TrendingDown size={15} className="text-[var(--color-accent-deep)]" /> : <Minus size={15} className="text-black/30" />}
        </span>
      )}
      <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
      <div className="min-w-0 flex-1">
        <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre}{r.bnm ? ' · BNM' : ''}</div>
        <div className="font-display truncate text-base leading-tight font-black sm:text-lg"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
        <div className="font-mono2 truncate text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{writerById(r.writerId).name}</div>
      </div>
      <ScoreBadge score={r.score} size="sm" />
    </Link>
  );
}

export default function Charts() {
  const [year, setYear] = useState(2026);
  const list = useMemo(() => topOfYear(year, 50), [year]);
  const top3 = list.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Needle & Ink charts</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">Top 50 of {year}</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-smoke)]">Ranked purely by score, tie-broken by recency and newsroom shouting. Updated as new reviews land — last tabulated 9 September 2026.</p>

      <div className="mt-4 flex gap-2">
        {[2026, 2025, 2024].map((y) => (
          <button key={y} onClick={() => setYear(y)} className={`font-mono2 border-2 border-black px-4 py-1.5 text-[12px] font-bold tracking-widest ${year === y ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}>{y}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {top3.map((r, i) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group relative overflow-hidden border-2 border-black shadow-[4px_4px_0_#141310]">
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} className="aspect-square w-full" />
            <div className="absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)] font-display text-xl font-black text-black">
              {i === 0 ? <Trophy size={18} /> : i === 1 ? <Medal size={18} /> : <Award size={18} />}
            </div>
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-3 pt-8">
              <div className="font-display text-lg leading-tight font-black text-white">#{i + 1} {r.artist} <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-gold)] uppercase">{r.score.toFixed(1)} · {r.genre}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 border-t-2 border-black">
        {list.slice(3).map((r, i) => <ChartRow key={r.id} r={r} rank={i + 4} />)}
      </div>

      <Link to="/reviews" className="font-mono2 mt-6 inline-flex items-center gap-1 border-2 border-black px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">
        <ArrowLeft size={14} /> Browse the full archive
      </Link>
    </div>
  );
}
