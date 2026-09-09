import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { ALL_REVIEWS, GENRES } from '../data/catalog';
import { WRITERS } from '../data/writers';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { formatDate } from '../lib/format';

const PER_PAGE = 24;

export default function ReviewsIndex() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const genre = params.get('genre') ?? '';
  const writer = params.get('writer') ?? '';
  const min = parseFloat(params.get('min') ?? '0');
  const sort = params.get('sort') ?? 'new';
  const bnmOnly = params.get('bnm') === '1';
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10));
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (!v) p.delete(k); else p.set(k, v);
    p.delete('page');
    setParams(p);
  };

  const filtered = useMemo(() => {
    let r = [...ALL_REVIEWS];
    if (q) r = r.filter((x) => `${x.artist} ${x.album} ${x.genre} ${x.label}`.toLowerCase().includes(q.toLowerCase()));
    if (genre) r = r.filter((x) => x.genre === genre || x.subgenres.includes(genre));
    if (writer) r = r.filter((x) => x.writerId === writer);
    if (min > 0) r = r.filter((x) => x.score >= min);
    if (bnmOnly) r = r.filter((x) => x.bnm);
    if (sort === 'new') r.sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1));
    if (sort === 'score') r.sort((a, b) => b.score - a.score);
    if (sort === 'az') r.sort((a, b) => a.artist.localeCompare(b.artist));
    return r;
  }, [q, genre, writer, min, sort, bnmOnly]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  const goto = (p: number) => {
    const np = new URLSearchParams(params);
    np.set('page', String(p));
    setParams(np);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">The archive</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">All Reviews <span className="text-[var(--color-accent)]">({filtered.length})</span></h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-smoke)]">Every verdict since January 2024, newest first. Filter by genre, critic, score — or just scroll until something catches your ear.</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-y-2 border-black py-3">
        <div className="flex flex-1 items-center gap-2 border-2 border-black bg-white px-3 py-1.5 sm:max-w-xs">
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Filter by artist, album, label…" className="w-full bg-transparent text-sm outline-none placeholder:text-black/40" />
        </div>
        <select value={sort} onChange={(e) => set('sort', e.target.value)} className="font-mono2 border-2 border-black bg-white px-2 py-1.5 text-[11px] font-bold tracking-widest uppercase">
          <option value="new">Newest first</option>
          <option value="score">Highest scored</option>
          <option value="az">Artist A–Z</option>
        </select>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className={`font-mono2 flex items-center gap-1 border-2 border-black px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase ${filtersOpen ? 'bg-black text-white' : 'bg-white'}`}>
          <SlidersHorizontal size={13} /> Filters {(genre || writer || min > 0 || bnmOnly) && '●'}
        </button>
        <div className="ml-auto flex gap-1">
          <button onClick={() => setView('list')} className={`border-2 border-black p-1.5 ${view === 'list' ? 'bg-black text-white' : 'bg-white'}`} aria-label="List view"><List size={15} /></button>
          <button onClick={() => setView('grid')} className={`border-2 border-black p-1.5 ${view === 'grid' ? 'bg-black text-white' : 'bg-white'}`} aria-label="Grid view"><LayoutGrid size={15} /></button>
        </div>
      </div>

      {filtersOpen && (
        <div className="grid gap-4 border-b-2 border-black bg-[var(--color-card)] p-4 sm:grid-cols-4">
          <div>
            <div className="font-mono2 mb-1 text-[11px] font-bold tracking-widest uppercase">Genre</div>
            <select value={genre} onChange={(e) => set('genre', e.target.value)} className="w-full border-2 border-black bg-white px-2 py-1.5 text-sm">
              <option value="">All genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <div className="font-mono2 mb-1 text-[11px] font-bold tracking-widest uppercase">Critic</div>
            <select value={writer} onChange={(e) => set('writer', e.target.value)} className="w-full border-2 border-black bg-white px-2 py-1.5 text-sm">
              <option value="">All critics</option>
              {WRITERS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <div className="font-mono2 mb-1 text-[11px] font-bold tracking-widest uppercase">Min score: {min > 0 ? min.toFixed(1) : 'any'}</div>
            <input type="range" min={0} max={9} step={0.5} value={min} onChange={(e) => set('min', e.target.value)} className="w-full accent-[#ff3d00]" />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="font-mono2 flex cursor-pointer items-center gap-2 text-[12px] font-bold tracking-widest uppercase">
              <input type="checkbox" checked={bnmOnly} onChange={(e) => set('bnm', e.target.checked ? '1' : '')} className="h-4 w-4 accent-[#ff3d00]" /> Best New Music only
            </label>
            <button onClick={() => setParams({})} className="font-mono2 border-2 border-black px-2 py-1.5 text-[11px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">Clear all</button>
          </div>
        </div>
      )}

      {view === 'list' ? (
        <div className="divide-y divide-black/15">
          {slice.map((r) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-4 py-4">
              <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
              <div className="min-w-0 flex-1">
                <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre}{r.bnm ? ' · BNM' : ''}</div>
                <div className="font-display text-lg leading-tight font-black sm:text-xl"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
                <div className="font-mono2 mt-0.5 truncate text-[11px] tracking-widest text-[var(--color-smoke)] uppercase">{formatDate(r.reviewDate)} · {r.label}</div>
              </div>
              <ScoreBadge score={r.score} size="sm" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 py-6 sm:grid-cols-3 lg:grid-cols-4">
          {slice.map((r) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} className="group block">
              <div className="relative">
                <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} className="aspect-square w-full" />
                <div className="absolute bottom-2 left-2"><ScoreBadge score={r.score} size="sm" /></div>
              </div>
              <div className="pt-2">
                <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre}</div>
                <div className="font-display text-[15px] leading-tight font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="border-2 border-dashed border-black/40 p-10 text-center">
          <div className="font-display text-2xl font-black">Nothing in the crates matches that.</div>
          <button onClick={() => setParams({})} className="font-mono2 mt-3 border-2 border-black px-4 py-2 text-[11px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">Clear filters</button>
        </div>
      )}

      <div className="flex items-center justify-between border-t-2 border-black py-4">
        <button disabled={cur <= 1} onClick={() => goto(cur - 1)} className="font-mono2 flex items-center gap-1 border-2 border-black px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase disabled:opacity-30"><ChevronLeft size={13} /> Prev</button>
        <div className="font-mono2 text-[12px] font-bold tracking-widest uppercase">Page {cur} of {pages}</div>
        <button disabled={cur >= pages} onClick={() => goto(cur + 1)} className="font-mono2 flex items-center gap-1 border-2 border-black px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase disabled:opacity-30">Next <ChevronRight size={13} /></button>
      </div>
    </div>
  );
}
