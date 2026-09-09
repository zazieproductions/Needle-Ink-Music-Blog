import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import { BNM_REVIEWS } from '../data/catalog';
import { writerById } from '../data/writers';
import { formatDate } from '../lib/format';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';

export default function BNM() {
  const [sort, setSort] = useState<'new' | 'score'>('new');
  const list = [...BNM_REVIEWS].sort((a, b) => sort === 'new' ? (a.reviewDate < b.reviewDate ? 1 : -1) : b.score - a.score);
  const hero = [...BNM_REVIEWS].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <section className="grid overflow-hidden border-2 border-black bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[6px_6px_0_#141310] lg:grid-cols-[380px_1fr]">
        <CoverArt hue={hero.hue} pattern={hero.pattern} artist={hero.artist} album={hero.album} className="min-h-[300px] w-full lg:min-h-[420px]" />
        <div className="p-6 sm:p-10">
          <div className="font-mono2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase"><Award size={13} /> Best New Music · Hall of fame</div>
          <h1 className="font-display mt-2 text-4xl leading-[0.95] font-black sm:text-6xl">The records that got the <span className="text-[var(--color-gold)] italic">gold sticker.</span></h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">8.5 and above, no exceptions, no appeals. {BNM_REVIEWS.length} records in the archive currently hold the stamp — {hero.artist}'s <em>{hero.album}</em> ({hero.score.toFixed(1)}) leads the pack.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setSort('new')} className={`font-mono2 border-2 px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase ${sort === 'new' ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-black' : 'border-white/40 text-white'}`}>Newest first</button>
            <button onClick={() => setSort('score')} className={`font-mono2 border-2 px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase ${sort === 'score' ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-black' : 'border-white/40 text-white'}`}>Highest scored</button>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-x-8 gap-y-2 md:grid-cols-2">
        {list.map((r, i) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-4 border-b border-black/15 py-4">
            <span className="font-display w-8 shrink-0 text-3xl font-black text-black/20 italic">{String(i + 1).padStart(2, '0')}</span>
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-20 w-20 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre} · {formatDate(r.reviewDate)}</div>
              <div className="font-display text-lg leading-tight font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 mt-0.5 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{writerById(r.writerId).name}</div>
            </div>
            <ScoreBadge score={r.score} size="sm" />
          </Link>
        ))}
      </div>

      <Link to="/charts" className="font-mono2 mt-8 inline-flex items-center gap-1 border-2 border-black px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">
        See how they rank in the Top 50 of 2026 <ArrowRight size={14} />
      </Link>
    </div>
  );
}
