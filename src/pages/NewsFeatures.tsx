import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import { ALL_NEWS, NEWS_BY_SLUG, ALL_FEATURES, FEATURE_BY_SLUG } from '../data/editorial';
import { ALL_REVIEWS } from '../data/catalog';
import { writerById } from '../data/writers';
import { timeAgo, formatDate } from '../lib/format';
import CoverArt from '../components/CoverArt';

export function NewsIndex() {
  return <NewsInner />;
}

import { useState } from 'react';
function NewsInner() {
  const [cat, setCat] = useState('');
  const cats = [...new Set(ALL_NEWS.map((n) => n.category))];
  const list = cat ? ALL_NEWS.filter((n) => n.category === cat) : ALL_NEWS;
  const [lead, ...rest] = list;
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">The wire</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">News</h1>
      <div className="mt-4 flex flex-wrap gap-1.5 border-y-2 border-black py-3">
        <button onClick={() => setCat('')} className={`font-mono2 border-2 border-black px-3 py-1 text-[11px] font-bold tracking-widest uppercase ${!cat ? 'bg-black text-white' : 'bg-white'}`}>All</button>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c === cat ? '' : c)} className={`font-mono2 border-2 border-black px-3 py-1 text-[11px] font-bold tracking-widest uppercase ${c === cat ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}>{c}</button>
        ))}
      </div>
      {lead && (
        <Link to={`/news/${lead.slug}`} className="group mt-5 grid overflow-hidden border-2 border-black bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[5px_5px_0_#141310] lg:grid-cols-2">
          <div className="flex min-h-[240px] flex-col justify-end bg-gradient-to-br from-[#3d2b1f] via-[#7c1d1d] to-[#141310] p-6 sm:p-8" style={{ background: `linear-gradient(135deg, hsl(${lead.hue},45%,18%), hsl(${(lead.hue + 40) % 360},55%,30%))` }}>
            {lead.breaking && <span className="font-mono2 mb-3 w-fit animate-pulse bg-[var(--color-accent)] px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] uppercase">Breaking</span>}
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">{lead.category} · {timeAgo(lead.publishedAt)}</div>
            <h2 className="font-display mt-2 text-3xl leading-tight font-black group-hover:underline sm:text-4xl">{lead.headline}</h2>
            <p className="mt-2 text-[14px] text-white/75">{lead.dek}</p>
          </div>
          <div className="grid content-center gap-3 border-t-2 border-white/20 p-6 sm:p-8 lg:border-t-0 lg:border-l-2">
            {ALL_NEWS.filter((n) => n.id !== lead.id).slice(0, 3).map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group/item border-b border-white/15 pb-3 last:border-0">
                <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-gold)] uppercase">{n.category} · {timeAgo(n.publishedAt)}</div>
                <div className="font-display text-lg leading-snug font-bold group-hover/item:underline">{n.headline}</div>
              </Link>
            ))}
          </div>
        </Link>
      )}
      <div className="mt-6 grid gap-x-8 md:grid-cols-2">
        {rest.map((n) => (
          <Link key={n.id} to={`/news/${n.slug}`} className="group border-b border-black/15 py-4">
            <div className="font-mono2 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
              <span className="text-[var(--color-accent-deep)]">{n.category}</span>·<span>{timeAgo(n.publishedAt)}</span>·<span>{writerById(n.writerId).name}</span>
              {n.breaking && <span className="bg-[var(--color-accent)] px-1 text-white">Breaking</span>}
            </div>
            <h3 className="font-display mt-1 text-xl leading-snug font-black"><span className="headline-hover">{n.headline}</span></h3>
            <p className="mt-1 line-clamp-2 text-[14px] text-[var(--color-smoke)]">{n.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NewsDetail() {
  const { slug = '' } = useParams();
  const n = NEWS_BY_SLUG.get(slug);
  if (!n) return <div className="mx-auto max-w-3xl px-4 py-20 text-center font-display text-4xl font-black">Story not found.</div>;
  const w = writerById(n.writerId);
  const more = ALL_NEWS.filter((x) => x.id !== n.id && x.category === n.category).slice(0, 3);
  const relReviews = ALL_REVIEWS.slice(0, 3);
  return (
    <article className="mx-auto max-w-3xl px-4 pt-6">
      <Link to="/news" className="font-mono2 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase hover:underline"><ArrowLeft size={13} /> News wire</Link>
      <div className="font-mono2 mt-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase">
        <span className="bg-black px-2 py-0.5 text-white">{n.category}</span>
        {n.breaking && <span className="bg-[var(--color-accent)] px-2 py-0.5 text-white">Breaking</span>}
        <span className="opacity-60">{timeAgo(n.publishedAt)} · {n.readTime} min</span>
      </div>
      <h1 className="font-display mt-3 text-4xl leading-[1.02] font-black tracking-tight sm:text-5xl">{n.headline}</h1>
      <p className="font-display mt-3 text-xl text-[var(--color-smoke)] italic">{n.dek}</p>
      <div className="mt-4 flex items-center gap-2.5 border-y-2 border-black py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
        <span className="text-sm font-bold">{w.name}</span>
        <span className="font-mono2 text-[11px] tracking-widest text-[var(--color-smoke)] uppercase">{w.role}</span>
      </div>
      <div className="mt-6 space-y-5">
        {n.body.map((p, i) => <p key={i} className={`text-[17px] leading-[1.75] ${i === 0 ? 'dropcap' : ''}`}>{p}</p>)}
      </div>
      <div className="mt-8 border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
        <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] uppercase">Read the records behind the story</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {relReviews.map((r) => (
            <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center gap-2.5">
              <CoverArt hue={r.hue} pattern={r.pattern} artist={r.artist} album={r.album} showText={false} className="h-14 w-14 shrink-0" />
              <div className="min-w-0"><div className="truncate text-[13px] font-bold group-hover:underline">{r.artist}</div><div className="truncate text-[12px] italic opacity-70">{r.album} · {r.score.toFixed(1)}</div></div>
            </Link>
          ))}
        </div>
      </div>
      {more.length > 0 && (
        <div className="mt-8">
          <div className="font-mono2 mb-2 border-b-2 border-black pb-1 text-[11px] font-bold tracking-[0.25em] uppercase">More {n.category}</div>
          {more.map((m) => (
            <Link key={m.id} to={`/news/${m.slug}`} className="group block border-b border-black/10 py-3">
              <div className="font-display text-lg font-black"><span className="headline-hover">{m.headline}</span></div>
              <div className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{timeAgo(m.publishedAt)}</div>
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export function FeaturesIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">Slow journalism</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-6xl">Features & Essays</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ALL_FEATURES.map((f) => {
          const w = writerById(f.writerId);
          return (
            <Link key={f.id} to={`/features/${f.slug}`} className="group flex flex-col overflow-hidden border-2 border-black bg-[var(--color-card)] shadow-[4px_4px_0_#141310]">
              <div className="flex h-40 flex-col justify-between p-5" style={{ background: `linear-gradient(135deg, hsl(${f.hue},45%,16%), hsl(${(f.hue + 50) % 360},50%,32%))` }}>
                <span className="font-mono2 w-fit bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-black uppercase">{f.tag}</span>
                <span className="font-display text-lg leading-snug font-black text-white italic">“{f.pullQuote.replace(/[“”]/g, '')}”</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-xl leading-tight font-black"><span className="headline-hover">{f.title}</span></h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] text-[var(--color-smoke)]">{f.dek}</p>
                <div className="font-mono2 mt-3 flex items-center gap-2 border-t border-black/15 pt-2 text-[10px] tracking-widest uppercase opacity-70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
                  {w.name} · {formatDate(f.date)} · <Clock size={10} /> {f.readTime} min
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function FeatureDetail() {
  const { slug = '' } = useParams();
  const f = FEATURE_BY_SLUG.get(slug);
  if (!f) return <div className="mx-auto max-w-3xl px-4 py-20 text-center font-display text-4xl font-black">Essay not found.</div>;
  const w = writerById(f.writerId);
  return (
    <article className="mx-auto max-w-3xl px-4 pt-6">
      <Link to="/features" className="font-mono2 inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase hover:underline"><ArrowLeft size={13} /> Features</Link>
      <div className="font-mono2 mt-3 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">{f.tag} · {f.readTime} min read</div>
      <h1 className="font-display mt-2 text-4xl leading-[1.0] font-black tracking-tight sm:text-6xl">{f.title}</h1>
      <p className="font-display mt-4 text-xl text-[var(--color-smoke)] italic">{f.dek}</p>
      <div className="mt-4 flex items-center gap-2.5 border-y-2 border-black py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
        <span><Link to={`/writers/${w.id}`} className="block text-sm font-bold hover:underline">{w.name}</Link><span className="font-mono2 block text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{formatDate(f.date)}</span></span>
      </div>
      <div className="mt-6 space-y-5">
        <p className="dropcap text-[17px] leading-[1.75]">{f.body[0]}</p>
        <blockquote className="font-display border-y-4 border-black py-5 text-center text-2xl font-black italic sm:text-3xl">{f.pullQuote}</blockquote>
        {f.body.slice(1).map((p, i) => <p key={i} className="text-[17px] leading-[1.75]">{p}</p>)}
      </div>
      <div className="font-mono2 mt-8 flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[11px] tracking-widest uppercase"><MessageSquare size={13} /> Join the discussion — {(parseInt(f.id.slice(2)) * 37 + 42) % 180 + 12} comments</div>
    </article>
  );
}
