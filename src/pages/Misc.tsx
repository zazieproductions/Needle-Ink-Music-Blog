import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Bookmark, Trash2, ArrowRight, ListMusic, Shuffle, Play } from 'lucide-react';
import { ALL_REVIEWS, topOfYear } from '../data/catalog';
import { writerById } from '../data/writers';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { ChartRow } from './Charts';
import { useApp } from '../components/store';
import { formatDate } from '../lib/format';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  const results = useMemo(() => {
    if (input.trim().length < 2 && q.trim().length < 2) return [];
    const term = (input || q).toLowerCase();
    return ALL_REVIEWS.filter((r) => `${r.artist} ${r.album} ${r.genre} ${r.label} ${writerById(r.writerId).name}`.toLowerCase().includes(term)).slice(0, 40);
  }, [input, q]);
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Search the stacks</div>
      <h1 className="font-display text-4xl font-black sm:text-5xl">Find a record</h1>
      <div className="mt-4 flex items-center gap-2 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_#141310]">
        <Search size={18} />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Artist, album, genre, label, critic…" className="w-full bg-transparent text-lg outline-none placeholder:text-black/40" autoFocus />
      </div>
      <div className="font-mono2 mt-3 text-[12px] tracking-widest uppercase opacity-60">{results.length} result{results.length === 1 ? '' : 's'}{input ? ` for “${input}”` : ''}</div>
      <div className="mt-2 divide-y divide-black/15">
        {results.map((r) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-4 py-3">
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-display truncate text-lg font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{r.genre} · {r.label} · {formatDate(r.reviewDate)}</div>
            </div>
            <ScoreBadge score={r.score} size="sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ReadingList() {
  const { saved, toggleSave, ratings } = useApp();
  const items = ALL_REVIEWS.filter((r) => saved.includes(r.slug));
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Your shelf</div>
      <h1 className="font-display flex items-center gap-3 text-4xl font-black sm:text-5xl"><Bookmark size={32} /> Reading List ({items.length})</h1>
      {items.length === 0 ? (
        <div className="mt-6 border-2 border-dashed border-black/40 p-10 text-center">
          <div className="font-display text-2xl font-black">Nothing saved yet.</div>
          <p className="mt-2 text-[var(--color-smoke)]">Tap “Save” on any review and it will wait for you here — synced in this browser.</p>
          <Link to="/reviews" className="font-mono2 mt-4 inline-flex items-center gap-1 border-2 border-black px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">Find something <ArrowRight size={14} /></Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-black/15">
          {items.map((r) => (
            <div key={r.id} className="flex items-center gap-4 py-3">
              <Link to={`/reviews/${r.slug}`} className="group flex min-w-0 flex-1 items-center gap-4">
                <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-display truncate text-lg font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
                  <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{r.score.toFixed(1)}{ratings[r.slug] ? ` · you rated ${ratings[r.slug]}/5` : ''}</div>
                </div>
                <ScoreBadge score={r.score} size="sm" />
              </Link>
              <button onClick={() => toggleSave(r.slug)} className="border-2 border-black p-2 hover:bg-black hover:text-white" aria-label="Remove"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ListsPage() {
  const top2026 = topOfYear(2026, 20);
  const top2025 = topOfYear(2025, 20);
  const [seed, setSeed] = useState(7);
  const shufflePicks = useMemo(() => {
    const arr = [...ALL_REVIEWS];
    let s = seed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) % 2147483648;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 10);
  }, [seed]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Ranked & filed</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">The Lists Issue</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-smoke)]">Year-end tabulations, staff ballots and the occasional drunken ranking. Updated live from the review archive.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
          <div className="font-mono2 mb-1 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Staff ballot · 2026</div>
          <h2 className="font-display text-2xl font-black">Albums of the Year (so far)</h2>
          <div className="mt-2 border-t-2 border-black">
            {top2026.slice(0, 10).map((r, i) => <ChartRow key={r.id} r={r} rank={i + 1} showMove={false} />)}
          </div>
          <Link to="/charts" className="font-mono2 mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase underline underline-offset-4">Full Top 50 <ArrowRight size={13} /></Link>
        </section>
        <section className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
          <div className="font-mono2 mb-1 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">From the vault · 2025</div>
          <h2 className="font-display text-2xl font-black">Last Year's Winners</h2>
          <div className="mt-2 border-t-2 border-black">
            {top2025.slice(0, 10).map((r, i) => <ChartRow key={r.id} r={r} rank={i + 1} showMove={false} />)}
          </div>
          <Link to="/charts" className="font-mono2 mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase underline underline-offset-4">Compare years <ArrowRight size={13} /></Link>
        </section>
      </div>

      <section className="mt-8 border-2 border-black bg-[var(--color-ink)] p-5 text-[var(--color-paper)] shadow-[5px_5px_0_#141310] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase"><ListMusic size={14} /> The crates shuffle</div>
            <h2 className="font-display mt-1 text-3xl font-black">Ten random records worth your evening</h2>
          </div>
          <button onClick={() => setSeed((s) => s + 1)} className="font-mono2 flex items-center gap-1.5 border-2 border-[var(--color-gold)] px-4 py-2 text-[12px] font-bold tracking-widest text-[var(--color-gold)] uppercase hover:bg-[var(--color-gold)] hover:text-black">
            <Shuffle size={14} /> Shuffle again
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {shufflePicks.map((r, i) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-3 border border-white/20 bg-white/5 p-2.5 hover:border-[var(--color-gold)]">
              <span className="font-mono2 w-6 text-[11px] font-bold text-white/40">{String(i + 1).padStart(2, '0')}</span>
              <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold group-hover:underline">{r.artist} <span className="font-normal italic">— {r.album}</span></div>
                <div className="font-mono2 flex items-center gap-1 text-[10px] tracking-widest text-white/60 uppercase"><Play size={9} /> {r.score.toFixed(1)} · {r.genre}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { t: 'The 7.0 Club', d: 'Great records that missed the gold sticker. The connoisseur\u2019s shelf.', f: ALL_REVIEWS.filter((r) => r.score >= 7 && r.score < 8).slice(0, 3) },
          { t: 'Divisive by Design', d: 'Our lowest scores with the longest comment threads.', f: [...ALL_REVIEWS].sort((a, b) => a.score - b.score).slice(0, 3) },
          { t: 'Reader Magnets', d: 'The most-played reviews in the archive right now.', f: [...ALL_REVIEWS].sort((a, b) => b.plays - a.plays).slice(0, 3) },
        ].map((box) => (
          <div key={box.t} className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[3px_3px_0_#141310]">
            <h3 className="font-display text-xl font-black">{box.t}</h3>
            <p className="mt-1 text-[13px] text-[var(--color-smoke)]">{box.d}</p>
            <div className="mt-3 space-y-2.5">
              {box.f.map((r) => (
                <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-2.5">
                  <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0"><div className="truncate text-[13px] font-bold group-hover:underline">{r.artist}</div><div className="truncate text-[12px] italic opacity-70">{r.album} · {r.score.toFixed(1)}</div></div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
