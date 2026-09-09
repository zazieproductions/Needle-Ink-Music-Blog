import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { WRITERS, writerById } from '../data/writers';
import { ALL_REVIEWS } from '../data/catalog';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { formatDate } from '../lib/format';

export function WritersIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">The masthead</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">The Critics</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-smoke)]">Twelve writers, four time zones, one shared belief: that a record deserves your full attention and our full honesty.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WRITERS.map((w) => {
          const n = ALL_REVIEWS.filter((r) => r.writerId === w.id).length;
          const avg = n ? ALL_REVIEWS.filter((r) => r.writerId === w.id).reduce((a, b) => a + b.score, 0) / n : 0;
          return (
            <Link key={w.id} to={`/writers/${w.id}`} className="group border-2 border-black bg-[var(--color-card)] p-5 shadow-[3px_3px_0_#141310] hover:bg-[var(--color-cream)]">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
                <div>
                  <div className="font-display text-xl leading-tight font-black"><span className="headline-hover">{w.name}</span></div>
                  <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{w.role}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-[13px] text-[var(--color-smoke)]">{w.bio}</p>
              <div className="font-mono2 mt-3 flex items-center justify-between border-t border-black/15 pt-2 text-[10px] tracking-widest uppercase opacity-70">
                <span>{n} reviews</span><span>avg {avg.toFixed(2)}</span><span>{w.location}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function WriterDetail() {
  const { id = '' } = useParams();
  const w = writerById(id);
  const reviews = ALL_REVIEWS.filter((r) => r.writerId === w.id);
  const sorted = [...reviews].sort((a, b) => b.score - a.score);
  const avg = reviews.length ? reviews.reduce((a, b) => a + b.score, 0) / reviews.length : 0;
  const bnm = reviews.filter((r) => r.bnm).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Link to="/writers" className="font-mono2 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase hover:underline"><ArrowLeft size={13} /> All critics</Link>
      <div className="mt-3 grid gap-6 border-2 border-black bg-[var(--color-card)] p-6 shadow-[5px_5px_0_#141310] sm:p-8 lg:grid-cols-[auto_1fr_auto]">
        <span className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white sm:h-28 sm:w-28" style={{ background: w.color }}>{w.initials}</span>
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">{w.name}</h1>
          <div className="font-mono2 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-widest uppercase opacity-60">
            <span>{w.role}</span><span className="flex items-center gap-1"><MapPin size={11} /> {w.location}</span><span>Since {w.joined}</span>
          </div>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed">{w.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {w.beats.map((b) => (
              <Link key={b} to={`/genres/${encodeURIComponent(b)}`} className="font-mono2 border border-black px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">{b}</Link>
            ))}
          </div>
        </div>
        <div className="flex gap-6 lg:flex-col lg:gap-3 lg:border-l-2 lg:border-black lg:pl-6">
          {[['Reviews', reviews.length], ['Avg score', avg.toFixed(2)], ['BNMs', bnm]].map(([l, v]) => (
            <div key={l as string}>
              <div className="font-display text-3xl font-black">{v}</div>
              <div className="font-mono2 text-[10px] tracking-widest uppercase opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <h2 className="font-display mt-8 mb-2 text-2xl font-black">Latest from {w.name.split(' ')[0]} ({reviews.length})</h2>
      <div className="grid gap-x-8 md:grid-cols-2">
        {[...reviews].sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1)).slice(0, 20).map((r) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-4 border-b border-black/15 py-3.5">
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre}</div>
              <div className="font-display truncate text-[16px] leading-tight font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 mt-0.5 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{formatDate(r.reviewDate)}</div>
            </div>
            <ScoreBadge score={r.score} size="sm" />
          </Link>
        ))}
      </div>
      {sorted[0] && (
        <div className="mt-6 border-2 border-black bg-[var(--color-ink)] p-5 text-[var(--color-paper)]">
          <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">{w.name.split(' ')[0]}'s highest call</div>
          <Link to={`/reviews/${sorted[0].slug}`} className="font-display mt-1 block text-2xl font-black hover:underline">{sorted[0].artist} — <span className="font-light italic">{sorted[0].album}</span> ({sorted[0].score.toFixed(1)})</Link>
        </div>
      )}
    </div>
  );
}
