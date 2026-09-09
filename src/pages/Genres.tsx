import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award } from 'lucide-react';
import { ALL_REVIEWS, GENRES, genreStats } from '../data/catalog';
import { writerById } from '../data/writers';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { formatDate } from '../lib/format';

export function GenresIndex() {
  const stats = genreStats();
  const max = Math.max(...stats.map((s) => s.count));
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Find your frequency</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">Genres A–Z</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-smoke)]">{ALL_REVIEWS.length} reviews across {GENRES.length} desks. Bar length is volume, the number is our average score — argue accordingly.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.genre} to={`/genres/${encodeURIComponent(s.genre)}`} className="group border-2 border-black bg-[var(--color-card)] p-4 shadow-[3px_3px_0_#141310] hover:bg-[var(--color-cream)]">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-black"><span className="headline-hover">{s.genre}</span></h2>
              <span className="font-display text-lg font-black text-[var(--color-accent-deep)]">{s.avg.toFixed(2)}</span>
            </div>
            <div className="mt-2 h-2.5 w-full bg-black/10">
              <div className="h-full bg-[var(--color-ink)] transition-all group-hover:bg-[var(--color-accent)]" style={{ width: `${(s.count / max) * 100}%` }} />
            </div>
            <div className="font-mono2 mt-2 flex justify-between text-[10px] tracking-widest uppercase opacity-60">
              <span>{s.count} reviews</span>
              <span>{s.bnm} BNM{s.bnm === 1 ? '' : 's'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GenreDetail() {
  const { name = '' } = useParams();
  const genre = decodeURIComponent(name);
  const list = ALL_REVIEWS.filter((r) => r.genre === genre || r.subgenres.includes(genre) || r.tags.includes(genre));
  if (!GENRES.includes(genre) && list.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="font-display text-5xl font-black">No such frequency</div>
        <Link to="/genres" className="font-mono2 mt-6 inline-block border-2 border-black px-4 py-2 text-[12px] font-bold tracking-west uppercase">All genres</Link>
      </div>
    );
  }
  const sorted = [...list].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const avg = list.length ? list.reduce((a, b) => a + b.score, 0) / list.length : 0;
  const bnm = list.filter((r) => r.bnm).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Link to="/genres" className="font-mono2 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase hover:underline"><ArrowLeft size={13} /> All genres</Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">{genre}</h1>
          <p className="font-mono2 mt-2 text-[12px] tracking-widest uppercase opacity-60">{list.length} reviews · avg {avg.toFixed(2)} · {bnm} Best New Music{bnm === 1 ? '' : 's'}</p>
        </div>
      </div>
      {top && (
        <Link to={`/reviews/${top.slug}`} className="group mt-5 grid overflow-hidden border-2 border-black bg-[var(--color-card)] shadow-[5px_5px_0_#141310] sm:grid-cols-[240px_1fr]">
          <CoverArt hue={top.hue} pattern={top.pattern} artist={top.artist} album={top.album} className="h-56 w-full sm:h-full" />
          <div className="flex items-center gap-5 p-5 sm:p-7">
            <ScoreBadge score={top.score} size="lg" />
            <div>
              <div className="font-mono2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase"><Award size={12} /> Highest scored {genre}</div>
              <div className="font-display mt-1 text-2xl font-black sm:text-4xl"><span className="headline-hover">{top.artist}</span> <span className="font-light italic">— {top.album}</span></div>
              <p className="mt-2 max-w-xl text-[14px] text-[var(--color-smoke)]">{top.dek}</p>
            </div>
          </div>
        </Link>
      )}
      <div className="mt-6 grid gap-x-8 md:grid-cols-2">
        {sorted.map((r) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-4 border-b border-black/15 py-3.5">
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-display truncate text-[16px] leading-tight font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 mt-0.5 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{writerById(r.writerId).name} · {formatDate(r.reviewDate)}</div>
            </div>
            <ScoreBadge score={r.score} size="sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}
