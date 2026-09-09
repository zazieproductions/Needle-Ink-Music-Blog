import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, ArrowUpRight, Star, TrendingUp, Newspaper, BookOpen, Trophy, Flame } from 'lucide-react';
import { ALL_REVIEWS, BNM_REVIEWS, GENRES } from '../data/catalog';
import { ALL_NEWS, ALL_FEATURES } from '../data/editorial';
import { writerById } from '../data/writers';
import { formatDate, timeAgo } from '../lib/format';
import CoverArt from '../components/CoverArt';
import ScoreBadge, { ScoreBar } from '../components/ScoreBadge';
import { ReviewCard, ReviewTile } from '../components/cards';

function SectionHead({ kicker, title, to, toLabel }: { kicker: string; title: string; to: string; toLabel: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b-4 border-black pb-2">
      <div>
        <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">{kicker}</div>
        <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <Link to={to} className="font-mono2 hidden shrink-0 items-center gap-1 border-2 border-black px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase hover:bg-black hover:text-white sm:inline-flex">
        {toLabel} <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function Hero() {
  const lead = ALL_REVIEWS[0];
  const secondary = ALL_REVIEWS.slice(1, 4);
  const w = writerById(lead.writerId);
  return (
    <section className="grid gap-0 border-2 border-black bg-[var(--color-card)] shadow-[6px_6px_0_#141310] lg:grid-cols-[1.5fr_1fr]">
      <Link to={`/reviews/${lead.slug}`} className="group relative block min-h-[380px] overflow-hidden sm:min-h-[460px]">
        <img src="/images/hero-crowd.jpg" alt="Concert crowd" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-[var(--color-accent)] px-2.5 py-1 font-mono2 text-[11px] font-bold tracking-[0.2em] text-white uppercase">Cover story</span>
          {lead.bnm && (
            <span className="flex items-center gap-1 bg-[var(--color-gold)] px-2.5 py-1 font-mono2 text-[11px] font-bold tracking-[0.2em] text-black uppercase">
              <Award size={12} /> Best New Music
            </span>
          )}
        </div>
        <div className="absolute right-5 bottom-5 left-5 sm:right-8 sm:bottom-7 sm:left-8">
          <div className="font-mono2 mb-2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">{lead.genre} · {formatDate(lead.reviewDate)}</div>
          <h1 className="font-display max-w-2xl text-4xl leading-[0.95] font-black text-white sm:text-6xl">
            {lead.artist}
            <span className="block font-light italic">{lead.album}</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-snug text-white/85">{lead.dek}</p>
          <div className="mt-4 flex items-center gap-4">
            <ScoreBadge score={lead.score} size="md" />
            <div className="font-mono2 text-[11px] tracking-widest text-white/80 uppercase">
              <span className="font-bold text-white">{w.name}</span> · {lead.readTime} min read
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col divide-y divide-black/15 border-t-2 border-black lg:border-t-0 lg:border-l-2">
        <div className="font-mono2 bg-[var(--color-ink)] px-5 py-2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">The latest verdicts</div>
        {secondary.map((r) => (
          <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex flex-1 items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-cream)]">
            <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{r.genre}</div>
              <div className="font-display truncate text-lg leading-tight font-black"><span className="headline-hover">{r.artist}</span> <span className="font-light italic">— {r.album}</span></div>
              <div className="font-mono2 mt-0.5 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{timeAgo(r.reviewDate)} · {writerById(r.writerId).name}</div>
            </div>
            <ScoreBadge score={r.score} size="sm" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function ScoreHistogram() {
  const buckets = useMemo(() => {
    const b = Array.from({ length: 12 }, (_, i) => ({ lo: 4 + i * 0.5, count: 0 }));
    ALL_REVIEWS.forEach((r) => {
      const idx = Math.min(11, Math.max(0, Math.floor((r.score - 4) / 0.5)));
      b[idx].count++;
    });
    return b;
  }, []);
  const max = Math.max(...buckets.map((x) => x.count));
  return (
    <div className="border-2 border-black bg-[var(--color-card)] p-4 shadow-[4px_4px_0_#141310]">
      <div className="font-mono2 mb-1 text-[11px] font-bold tracking-[0.25em] uppercase">The shape of our taste</div>
      <h3 className="font-display text-xl font-black">324 scores, plotted</h3>
      <div className="mt-3 flex h-28 items-end gap-1">
        {buckets.map((b, i) => (
          <div key={i} className="group relative flex-1">
            <div
              className="w-full transition-all"
              style={{ height: `${Math.max(4, (b.count / max) * 100)}%`, background: b.lo >= 8.5 ? 'var(--color-accent)' : 'var(--color-ink)' }}
              title={`${b.lo.toFixed(1)}–${(b.lo + 0.5).toFixed(1)}: ${b.count} reviews`}
            />
            <div className="font-mono2 pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white opacity-0 group-hover:opacity-100">
              {b.count} reviews
            </div>
          </div>
        ))}
      </div>
      <div className="font-mono2 mt-1 flex justify-between text-[10px] text-[var(--color-smoke)]"><span>4.0</span><span>7.0</span><span>10</span></div>
    </div>
  );
}

function GenreStrip() {
  return (
    <div className="border-2 border-black bg-[var(--color-ink)] p-4 text-[var(--color-paper)] shadow-[4px_4px_0_#141310]">
      <div className="font-mono2 mb-2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Browse by sound</div>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((g) => {
          const n = ALL_REVIEWS.filter((r) => r.genre === g).length;
          return (
            <Link key={g} to={`/genres/${encodeURIComponent(g)}`} className="font-mono2 border border-white/30 px-2.5 py-1 text-[11px] tracking-wider uppercase hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
              {g} <span className="opacity-60">({n})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [bestsTab, setBestsTab] = useState<'week' | 'all'>('week');
  const weekBest = ALL_REVIEWS.filter((r) => r.reviewDate >= '2026-08-26').sort((a, b) => b.score - a.score).slice(0, 5);
  const allBest = [...ALL_REVIEWS].sort((a, b) => b.score - a.score).slice(0, 5);
  const bestList = bestsTab === 'week' ? weekBest : allBest;
  const mostRead = [...ALL_REVIEWS].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const grid = ALL_REVIEWS.slice(4, 12);
  const bnmRow = BNM_REVIEWS.slice(0, 4);
  const features = ALL_FEATURES.slice(0, 3);
  const news = ALL_NEWS.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pt-6">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <SectionHead kicker="Fresh off the desk" title="Latest Reviews" to="/reviews" toLabel="All 324 reviews" />
          <div className="border-t-2 border-black">
            {ALL_REVIEWS.slice(12, 20).map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="border-2 border-black bg-[var(--color-card)] shadow-[4px_4px_0_#141310]">
            <div className="flex items-center justify-between bg-[var(--color-ink)] px-4 py-2">
              <span className="font-mono2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase"><Trophy size={13} /> Highest scored</span>
              <div className="flex gap-1">
                {(['week', 'all'] as const).map((t) => (
                  <button key={t} onClick={() => setBestsTab(t)} className={`font-mono2 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${bestsTab === t ? 'bg-[var(--color-gold)] text-black' : 'text-white/60 hover:text-white'}`}>
                    {t === 'week' ? 'This week' : 'All time'}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-black/10">
              {bestList.map((r, i) => (
                <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-cream)]">
                  <span className="font-display w-6 text-2xl font-black text-black/25 italic">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold"><span className="headline-hover">{r.artist}</span> <span className="font-normal italic">— {r.album}</span></div>
                    <ScoreBar score={r.score} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="border-2 border-black bg-[var(--color-card)] shadow-[4px_4px_0_#141310]">
            <div className="font-mono2 flex items-center gap-1.5 bg-[var(--color-accent)] px-4 py-2 text-[11px] font-bold tracking-[0.25em] text-white uppercase"><Flame size={13} /> Most read</div>
            <div className="divide-y divide-black/10">
              {mostRead.map((r, i) => (
                <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-cream)]">
                  <span className="font-mono2 w-6 text-[11px] font-bold text-black/40">0{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold"><span className="headline-hover">{r.artist}</span> <span className="font-normal italic">— {r.album}</span></div>
                    <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{r.plays.toLocaleString()} plays · {r.score.toFixed(1)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <ScoreHistogram />
        </aside>
      </section>

      <section className="border-2 border-black bg-[var(--color-ink)] p-5 text-[var(--color-paper)] shadow-[6px_6px_0_#141310] sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase"><Award size={13} /> Best New Music</div>
            <h2 className="font-display text-3xl font-black sm:text-4xl">The gold-sticker shelf</h2>
          </div>
          <Link to="/best-new-music" className="font-mono2 inline-flex items-center gap-1 border-2 border-[var(--color-gold)] px-3 py-1.5 text-[11px] font-bold tracking-widest text-[var(--color-gold)] uppercase hover:bg-[var(--color-gold)] hover:text-black">
            All {BNM_REVIEWS.length} BNMs <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bnmRow.map((r) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} className="group block bg-[var(--color-paper)] p-2.5 text-[var(--color-ink)]">
              <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} className="aspect-square w-full" />
              <div className="flex items-start justify-between gap-2 pt-2">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-black"><span className="headline-hover">{r.artist}</span></div>
                  <div className="truncate text-[13px] italic opacity-80">{r.album}</div>
                  <div className="font-mono2 mt-1 flex items-center gap-1 text-[10px] tracking-widest uppercase opacity-60"><Star size={10} className="fill-[var(--color-gold)] text-[var(--color-gold)]" /> {r.score.toFixed(1)} · {r.genre}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHead kicker="From the archive floor" title="More Verdicts" to="/reviews" toLabel="Browse all" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-4">
          {grid.map((r) => <ReviewTile key={r.id} review={r} />)}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
          <div className="font-mono2 mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase"><Newspaper size={13} /> News wire</div>
          <div className="space-y-4">
            {news.map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group block border-b border-black/10 pb-4 last:border-0 last:pb-0">
                <div className="font-mono2 text-[10px] font-bold tracking-widest uppercase opacity-60">{n.category} · {timeAgo(n.publishedAt)}</div>
                <h3 className="font-display text-lg leading-snug font-black"><span className="headline-hover">{n.headline}</span></h3>
              </Link>
            ))}
          </div>
          <Link to="/news" className="font-mono2 mt-4 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase underline underline-offset-4">All news <ArrowUpRight size={13} /></Link>
        </div>
        <div className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
          <div className="font-mono2 mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase"><BookOpen size={13} /> Long reads</div>
          <div className="space-y-4">
            {features.map((f) => (
              <Link key={f.id} to={`/features/${f.slug}`} className="group block border-b border-black/10 pb-4 last:border-0 last:pb-0">
                <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{f.tag} · {f.readTime} min</div>
                <h3 className="font-display text-lg leading-snug font-black"><span className="headline-hover">{f.title}</span></h3>
                <p className="mt-1 line-clamp-2 text-[13px] text-[var(--color-smoke)]">{f.dek}</p>
              </Link>
            ))}
          </div>
          <Link to="/features" className="font-mono2 mt-4 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase underline underline-offset-4">All features <ArrowUpRight size={13} /></Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="relative overflow-hidden border-2 border-black shadow-[4px_4px_0_#141310]">
          <img src="/images/vinyl.jpg" alt="Vinyl close-up" className="h-56 w-full object-cover sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute bottom-0 p-5">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Sunday essay</div>
            <Link to="/features" className="font-display block max-w-md text-2xl leading-tight font-black text-white hover:underline sm:text-3xl">In defence of the 7.4: a critic's confession</Link>
          </div>
        </div>
        <div className="relative overflow-hidden border-2 border-black shadow-[4px_4px_0_#141310]">
          <img src="/images/studio.jpg" alt="Studio console" className="h-56 w-full object-cover sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute bottom-0 p-5">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Nashville week</div>
            <Link to="/features" className="font-display block max-w-md text-2xl leading-tight font-black text-white hover:underline sm:text-3xl">The session players saving country music</Link>
          </div>
        </div>
      </section>

      <GenreStrip />

      <section className="grid overflow-hidden border-2 border-black shadow-[6px_6px_0_#141310] lg:grid-cols-2">
        <div className="relative min-h-[260px]">
          <img src="/images/jazz.jpg" alt="Saxophonist in a dark club" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </div>
        <div className="flex flex-col justify-center bg-[var(--color-ink)] p-6 text-[var(--color-paper)] sm:p-10">
          <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Jazz · Blue Notes, New Voices</div>
          <h2 className="font-display mt-2 text-3xl leading-tight font-black sm:text-4xl">Jazz's second second coming, reported from the front row.</h2>
          <p className="mt-3 max-w-md text-[15px] text-white/75">Inge Halvorsen on the pianists, poets and producers dragging the music somewhere it has never been — while honouring everywhere it has.</p>
          <Link to="/features" className="font-mono2 mt-5 inline-flex w-fit items-center gap-1 border-2 border-[var(--color-gold)] px-4 py-2 text-[12px] font-bold tracking-widest text-[var(--color-gold)] uppercase hover:bg-[var(--color-gold)] hover:text-black">
            Read the essay <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-2 border-black shadow-[6px_6px_0_#141310]">
        <img src="/images/live-guitar.jpg" alt="Live guitar" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[var(--color-ink)]/80" />
        <div className="relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">The Sunday Setlist — newsletter</div>
            <h2 className="font-display mt-2 max-w-xl text-3xl leading-tight font-black text-white sm:text-5xl">Every 8.0+, every Sunday. No filler.</h2>
            <p className="mt-3 max-w-lg text-[15px] text-white/75">One email with the week's essential reviews, the BNM shortlist and one archival gem. Read by 84,000 people who still buy records.</p>
          </div>
          <NewsletterBox dark />
        </div>
      </section>
    </div>
  );
}

function NewsletterBox({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  return (
    <div className={`border-2 p-5 ${dark ? 'border-[var(--color-gold)] bg-black/40' : 'border-black bg-[var(--color-cream)]'}`}>
      {done ? (
        <div>
          <div className={`font-display text-2xl font-black ${dark ? 'text-white' : ''}`}>You're on the list.</div>
          <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-[var(--color-smoke)]'}`}>First edition lands Sunday, 6am sharp. Put the kettle on.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr('That email looks off — try again.'); return; } setDone(true); }}>
          <label className={`font-mono2 text-[11px] font-bold tracking-[0.25em] uppercase ${dark ? 'text-[var(--color-gold)]' : ''}`}>Email address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`mt-2 w-full border-2 px-3 py-2.5 text-sm outline-none ${dark ? 'border-white/40 bg-white/10 text-white placeholder:text-white/40' : 'border-black bg-white'}`} />
          {err && <div className="mt-1 text-xs font-bold text-[var(--color-accent)]">{err}</div>}
          <button className="font-mono2 mt-3 w-full bg-[var(--color-accent)] px-3 py-2.5 text-[12px] font-bold tracking-[0.2em] text-white uppercase hover:bg-[var(--color-accent-deep)]">
            Sign me up
          </button>
          <div className={`font-mono2 mt-2 text-[10px] tracking-wider uppercase ${dark ? 'text-white/50' : 'text-[var(--color-smoke)]'}`}>Free forever · Unsubscribe anytime</div>
        </form>
      )}
    </div>
  );
}

export { NewsletterBox };

export function TrendingStrip() {
  const items = [...ALL_REVIEWS].sort((a, b) => b.comments - a.comments).slice(0, 6);
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
      {items.map((r) => (
        <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex w-64 shrink-0 items-center gap-3 border-2 border-black bg-[var(--color-card)] p-2.5 hover:bg-[var(--color-cream)]">
          <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase"><TrendingUp size={10} /> {r.comments} comments</div>
            <div className="truncate text-[13px] font-bold"><span className="headline-hover">{r.artist}</span></div>
            <div className="truncate text-[12px] italic opacity-70">{r.album} · {r.score.toFixed(1)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
