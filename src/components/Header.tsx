import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Disc3, Bookmark, Flame, Clock3 } from 'lucide-react';
import { ALL_REVIEWS } from '../data/catalog';
import { ALL_NEWS } from '../data/editorial';
import CoverArt from './CoverArt';

const SECTIONS = [
  { label: 'Reviews', to: '/reviews' },
  { label: 'Best New Music', to: '/best-new-music' },
  { label: 'News', to: '/news' },
  { label: 'Features', to: '/features' },
  { label: 'Charts', to: '/charts' },
  { label: 'Genres', to: '/genres' },
  { label: 'Writers', to: '/writers' },
  { label: 'Lists', to: '/lists' },
];

function Ticker() {
  const items = [
    ...ALL_REVIEWS.slice(0, 8).map((r) => ({ label: `${r.artist} — ${r.album}`, score: r.score.toFixed(1), to: `/reviews/${r.slug}` })),
    ...ALL_NEWS.slice(0, 4).map((n) => ({ label: n.headline, score: 'NEWS', to: `/news/${n.slug}` })),
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-black/80 bg-[var(--color-gold)]">
      <div className="ticker-track py-1.5">
        {doubled.map((t, i) => (
          <Link key={i} to={t.to} className="font-mono2 flex shrink-0 items-center gap-2 px-5 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase hover:underline">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
            {t.label}
            <span className="bg-black px-1 text-[10px] text-[var(--color-gold)]">{t.score}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchBox({ onClose }: { onClose?: () => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const results = q.trim().length > 1
    ? ALL_REVIEWS.filter((r) =>
        `${r.artist} ${r.album} ${r.genre} ${r.label}`.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 7)
    : [];
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative w-full">
      <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5">
        <Search size={15} className="shrink-0" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) { nav(`/search?q=${encodeURIComponent(q)}`); setOpen(false); onClose?.(); } }}
          placeholder="Search 324 reviews, artists, genres…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
        />
        {q && <button onClick={() => setQ('')}><X size={14} /></button>}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 border-2 border-t-0 border-black bg-white shadow-[4px_4px_0_#141310]">
          {results.map((r) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} onClick={() => { setOpen(false); onClose?.(); }} className="flex items-center gap-3 border-b border-black/10 p-2 hover:bg-[var(--color-cream)] last:border-0">
              <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-10 w-10 shrink-0" />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold">{r.artist} <span className="font-normal italic">— {r.album}</span></div>
                <div className="font-mono2 text-[10px] tracking-wider text-black/50 uppercase">{r.genre} · {r.score.toFixed(1)}</div>
              </div>
            </Link>
          ))}
          <Link to={`/search?q=${encodeURIComponent(q)}`} onClick={() => { setOpen(false); onClose?.(); }} className="font-mono2 block bg-black p-2 text-center text-[11px] font-bold tracking-widest text-white uppercase">
            See all results
          </Link>
        </div>
      )}
    </div>
  );
}

export function MastheadDate() {
  const d = new Date('2026-09-09T12:00:00Z');
  const s = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return <span>{s} · Edition No. 1,204 · Printed-ish daily</span>;
}

export default function Header({ savedCount }: { savedCount: number }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40">
      <Ticker />
      <div className="border-b-4 border-black bg-[var(--color-paper)]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="font-mono2 flex items-center justify-between gap-2 py-1.5 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase sm:text-[11px]">
            <span className="hidden sm:inline"><MastheadDate /></span>
            <span className="sm:hidden">Wed 9 Sept 2026</span>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1 md:flex"><Flame size={12} className="text-[var(--color-accent)]" /> 324 reviews & counting</span>
              <Link to="/reading-list" className="flex items-center gap-1 font-bold text-black hover:underline">
                <Bookmark size={12} /> List ({savedCount})
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-black/20 py-3">
            <button className="border-2 border-black p-1.5 lg:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link to="/" className="group flex items-center gap-2.5 sm:gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] sm:h-12 sm:w-12">
                <Disc3 size={30} className="text-[var(--color-paper)] transition-transform duration-700 group-hover:rotate-180" />
                <span className="absolute h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span>
                <span className="font-display block text-[26px] leading-none font-black tracking-tight sm:text-4xl">
                  Needle<span className="text-[var(--color-accent)]">&</span>Ink
                </span>
                <span className="font-mono2 block text-[9px] tracking-[0.32em] uppercase sm:text-[10px]">The album review paper — est. 2011</span>
              </span>
            </Link>
            <div className="hidden max-w-sm flex-1 md:block"><SearchBox /></div>
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/charts" className="flex items-center gap-1 border-2 border-black bg-[var(--color-ink)] px-3 py-1.5 font-mono2 text-[11px] font-bold tracking-widest text-white uppercase hover:bg-[var(--color-accent-deep)]">
                <Clock3 size={13} /> Top 50 of 2026
              </Link>
            </div>
          </div>
          <nav className="hidden items-stretch gap-0 border-t-2 border-black lg:flex">
            {SECTIONS.map((s) => (
              <Link key={s.to} to={s.to} className="font-mono2 border-r border-black/20 px-4 py-2 text-[12px] font-bold tracking-widest uppercase transition-colors first:pl-0 hover:bg-black hover:text-white">
                {s.label}
              </Link>
            ))}
            <span className="font-mono2 ml-auto flex items-center gap-1.5 py-2 text-[11px] tracking-widest uppercase">
              <span className="live-dot inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]" /> Review desk open
            </span>
          </nav>
        </div>
        {menu && (
          <div className="border-t-2 border-black bg-[var(--color-paper)] px-4 pt-3 pb-4 lg:hidden">
            <SearchBox onClose={() => setMenu(false)} />
            <nav className="mt-3 grid grid-cols-2 gap-1">
              {SECTIONS.map((s) => (
                <Link key={s.to} to={s.to} onClick={() => setMenu(false)} className="font-mono2 border border-black px-3 py-2.5 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">
                  {s.label}
                </Link>
              ))}
              <Link to="/reading-list" onClick={() => setMenu(false)} className="font-mono2 border border-black px-3 py-2.5 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">
                Reading list ({savedCount})
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
