import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Award, Bookmark, Check, Share2, ChevronLeft, ChevronRight, Play, Pause, MessageSquare, ThumbsUp, ThumbsDown, Star, Disc3, Clock } from 'lucide-react';
import { REVIEW_BY_SLUG, relatedReviews, ALL_REVIEWS } from '../data/catalog';
import { writerById } from '../data/writers';
import { formatDate, scoreColor, scoreLabel } from '../lib/format';
import CoverArt from '../components/CoverArt';
import ScoreBadge from '../components/ScoreBadge';
import { ReviewTile } from '../components/cards';
import { useApp } from '../components/store';

function Stars({ value, onRate }: { value: number; onRate: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onRate(s)} aria-label={`Rate ${s} stars`}>
          <Star size={20} className={(hover || value) >= s ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-black/30'} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewDetail() {
  const { slug = '' } = useParams();
  const nav = useNavigate();
  const review = REVIEW_BY_SLUG.get(slug);
  const { saved, toggleSave, isSaved, ratings, rate, votes, vote } = useApp();
  void saved;
  const [playing, setPlaying] = useState<number | null>(null);
  const [shared, setShared] = useState(false);

  const idx = useMemo(() => ALL_REVIEWS.findIndex((r) => r.slug === slug), [slug]);
  const prev = idx > 0 ? ALL_REVIEWS[idx - 1] : null;
  const next = idx >= 0 && idx < ALL_REVIEWS.length - 1 ? ALL_REVIEWS[idx + 1] : null;

  if (!review) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="font-display text-5xl font-black">404 — Lost in the stacks</div>
        <p className="mt-3 text-[var(--color-smoke)]">That review doesn't exist. The archive apologises.</p>
        <button onClick={() => nav('/reviews')} className="font-mono2 mt-6 border-2 border-black px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">Back to reviews</button>
      </div>
    );
  }

  const w = writerById(review.writerId);
  const related = relatedReviews(review, 4);
  const savedNow = isSaved(review.slug);
  const myRating = ratings[review.slug] ?? 0;

  const comments = useMemo(() => {
    const names = ['crate.digger', 'loudquietloud', 'firstpressfan', 'midnightbus', 'feedbackloop', 'tapeloop.tess', 'sub.bass.sam', 'encore.ed', 'needle.drop.nina', 'roomtone.rob'];
    const texts = [
      'This review finally puts into words what I felt on the third listen. The bit about the closing run is exactly right.',
      'Respectfully disagree on the score — this is at least a full point higher for me. The production alone deserves it.',
      'Saw them play half of this live last month and the new arrangements are even better. Go if they come near you.',
      'Came for the score, stayed for the writing. “Drums that sound like decisions” is going straight in the group chat.',
      'The sequencing argument here is spot on. Track 4 into track 5 genuinely rearranged my week.',
      'Counterpoint: the middle sag the review mentions is actually my favourite stretch. The patience pays off.',
      'Gave it two full spins after reading this and the review only gets better. Great ear, great pen.',
      'As someone who hated the last record, this won me over completely. Fair, funny, and properly heard.',
    ];
    const out: { name: string; text: string; likes: number; time: string }[] = [];
    const n = Math.min(review.comments, 8);
    for (let i = 0; i < n; i++) {
      const h = (review.hue * 7 + i * 37) % names.length;
      out.push({ name: names[(h + i) % names.length], text: texts[(h + i * 3) % texts.length], likes: (review.hue + i * 13) % 48, time: `${(i * 3 + 2)}h ago` });
    }
    return out;
  }, [review]);

  return (
    <article className="mx-auto max-w-7xl px-4 pt-6">
      <div className="font-mono2 flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase">
        <Link to="/reviews" className="hover:underline">Reviews</Link>
        <span>/</span>
        <Link to={`/genres/${encodeURIComponent(review.genre)}`} className="text-[var(--color-accent-deep)] hover:underline">{review.genre}</Link>
        {review.bnm && <span className="flex items-center gap-1 bg-[var(--color-gold)] px-1.5 py-0.5 text-black"><Award size={11} /> Best New Music</span>}
      </div>

      <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="font-display text-4xl leading-[0.95] font-black tracking-tight sm:text-6xl">
            {review.artist}
            <span className="block font-light italic">{review.album}</span>
          </h1>
          <p className="font-display mt-4 max-w-2xl text-xl leading-snug text-[var(--color-smoke)] italic sm:text-2xl">{review.dek}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y-2 border-black py-3">
            <Link to={`/writers/${w.id}`} className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
              <span>
                <span className="block text-sm font-bold hover:underline">{w.name}</span>
                <span className="font-mono2 block text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{w.role}</span>
              </span>
            </Link>
            <span className="font-mono2 text-[11px] tracking-widest text-[var(--color-smoke)] uppercase">{formatDate(review.reviewDate)} · {review.readTime} min read · {review.label}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => toggleSave(review.slug)} className={`font-mono2 flex items-center gap-1 border-2 border-black px-2.5 py-1.5 text-[11px] font-bold tracking-widest uppercase ${savedNow ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}>
                {savedNow ? <Check size={13} /> : <Bookmark size={13} />} {savedNow ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => {}); setShared(true); setTimeout(() => setShared(false), 2000); }} className="font-mono2 flex items-center gap-1 border-2 border-black bg-white px-2.5 py-1.5 text-[11px] font-bold tracking-widest uppercase hover:bg-black hover:text-white">
                <Share2 size={13} /> {shared ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[280px_1fr]">
            <div>
              <CoverArt hue={review.hue} pattern={review.pattern} artist={review.artist} album={review.album} className="aspect-square w-full border-2 border-black" />
              <div className="font-mono2 mt-2 grid grid-cols-2 gap-1 text-[10px] tracking-widest uppercase">
                <span className="bg-black/5 px-2 py-1">Label: {review.label}</span>
                <span className="bg-black/5 px-2 py-1">Released: {formatDate(review.releaseDate)}</span>
                <span className="bg-black/5 px-2 py-1">Genre: {review.genre}</span>
                <span className="bg-black/5 px-2 py-1">{review.plays.toLocaleString()} plays</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-4">
                <ScoreBadge score={review.score} size="xl" />
                <div>
                  <div className="font-display text-2xl font-black" style={{ color: scoreColor(review.score) }}>{scoreLabel(review.score)}</div>
                  <div className="font-mono2 text-[11px] tracking-widest text-[var(--color-smoke)] uppercase">Needle & Ink score</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Stars value={myRating} onRate={(v) => rate(review.slug, v)} />
                    <span className="font-mono2 text-[11px] text-[var(--color-smoke)]">{myRating ? `You: ${myRating}/5` : 'Rate it'}</span>
                  </div>
                </div>
              </div>
              <blockquote className="font-display border-l-4 border-[var(--color-accent)] pl-4 text-xl leading-snug font-bold italic">
                {review.pullQuote}
              </blockquote>
              <div className="w-full border-2 border-black">
                <div className="font-mono2 flex items-center justify-between bg-black px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                  <span className="flex items-center gap-1.5"><Disc3 size={13} /> Tracklist</span>
                  <span className="flex items-center gap-1 text-white/60"><Clock size={11} /> {review.tracks.length} tracks</span>
                </div>
                <ol className="divide-y divide-black/10">
                  {review.tracks.map((t) => (
                    <li key={t.n} className="group flex cursor-pointer items-center gap-3 px-3 py-1.5 text-[13px] hover:bg-[var(--color-cream)]" onClick={() => setPlaying(playing === t.n ? null : t.n)}>
                      <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/30 group-hover:border-black group-hover:bg-black group-hover:text-white" aria-label={`Play ${t.title}`}>
                        {playing === t.n ? <Pause size={11} /> : <Play size={11} className="translate-x-[1px]" />}
                      </button>
                      <span className="font-mono2 w-5 text-[11px] text-black/40">{String(t.n).padStart(2, '0')}</span>
                      <span className={`flex-1 truncate font-medium ${playing === t.n ? 'underline underline-offset-2' : ''}`}>{t.title}</span>
                      {t.standout && <span className="font-mono2 hidden bg-[var(--color-gold)] px-1 text-[9px] font-bold tracking-widest uppercase sm:inline">Standout</span>}
                      <span className="font-mono2 text-[11px] text-black/50">{t.duration}</span>
                      {playing === t.n && (
                        <span className="eq playing flex h-4 items-end text-[var(--color-accent)]" aria-hidden>
                          <span style={{ height: '100%' }} /><span style={{ height: '60%' }} /><span style={{ height: '80%' }} /><span style={{ height: '45%' }} />
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="prose-ink mt-8 max-w-none space-y-5">
            {review.body.slice(0, 2).map((p, i) => (
              <p key={i} className={`text-[17px] leading-[1.75] ${i === 0 ? 'dropcap' : ''}`}>{p}</p>
            ))}
            <aside className="my-6 border-2 border-black bg-[var(--color-gold)] p-5 shadow-[4px_4px_0_#141310]">
              <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] uppercase">File under</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[review.genre, ...review.subgenres, ...review.tags.slice(0, 2)].map((t) => (
                  <Link key={t} to={`/genres/${encodeURIComponent(t)}`} className="font-mono2 border-2 border-black bg-white px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase hover:bg-black hover:text-white">{t}</Link>
                ))}
              </div>
            </aside>
            {review.body.slice(2).map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.75]">{p}</p>
            ))}
            <div className="border-2 border-black bg-[var(--color-card)] p-5 shadow-[4px_4px_0_#141310]">
              <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-accent-deep)] uppercase">The verdict</div>
              <p className="font-display mt-1 text-xl font-bold italic">{review.verdict}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => vote(review.id, 'up')} className={`flex items-center gap-1 border-2 border-black px-2.5 py-1 font-mono2 text-[11px] font-bold uppercase ${(votes[review.id] === 'up') ? 'bg-[var(--color-moss)] text-white' : 'bg-white'}`}><ThumbsUp size={12} /> Agree</button>
                <button onClick={() => vote(review.id, 'down')} className={`flex items-center gap-1 border-2 border-black px-2.5 py-1 font-mono2 text-[11px] font-bold uppercase ${(votes[review.id] === 'down') ? 'bg-[var(--color-wine)] text-white' : 'bg-white'}`}><ThumbsDown size={12} /> Disagree</button>
                <span className="font-mono2 text-[11px] text-[var(--color-smoke)]">{(124 + (review.hue % 300)).toLocaleString()} readers voted</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-y-2 border-black py-3">
            {prev ? (
              <Link to={`/reviews/${prev.slug}`} className="group flex max-w-[45%] items-center gap-2 text-left">
                <ChevronLeft size={18} className="shrink-0" />
                <span><span className="font-mono2 block text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">Newer review</span><span className="block truncate text-sm font-bold group-hover:underline">{prev.artist} — {prev.album}</span></span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/reviews/${next.slug}`} className="group flex max-w-[45%] items-center gap-2 text-right">
                <span><span className="font-mono2 block text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">Older review</span><span className="block truncate text-sm font-bold group-hover:underline">{next.artist} — {next.album}</span></span>
                <ChevronRight size={18} className="shrink-0" />
              </Link>
            ) : <span />}
          </div>

          <section className="mt-10">
            <h2 className="font-display flex items-center gap-2 text-2xl font-black"><MessageSquare size={20} /> Comments ({comments.length})</h2>
            <div className="mt-4 space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="border-2 border-black/15 bg-[var(--color-card)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">@{c.name}</span>
                    <span className="font-mono2 text-[10px] tracking-widest text-[var(--color-smoke)] uppercase">{c.time} · ♥ {c.likes}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
          <div className="border-2 border-black bg-[var(--color-ink)] p-5 text-[var(--color-paper)] shadow-[4px_4px_0_rgba(0,0,0,.3)]">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">About the critic</div>
            <Link to={`/writers/${w.id}`} className="mt-2 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white" style={{ background: w.color }}>{w.initials}</span>
              <span><span className="font-display block text-xl font-black hover:underline">{w.name}</span><span className="font-mono2 block text-[10px] tracking-widest text-white/60 uppercase">{w.role} · {w.location}</span></span>
            </Link>
            <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/70">{w.bio}</p>
          </div>
          <div>
            <div className="font-mono2 mb-3 border-b-2 border-black pb-1 text-[11px] font-bold tracking-[0.25em] uppercase">If you like this, try</div>
            <div className="grid grid-cols-2 gap-4">
              {related.map((r) => <ReviewTile key={r.id} review={r} />)}
            </div>
          </div>
          <div className="border-2 border-black bg-[var(--color-card)] p-4 shadow-[4px_4px_0_#141310]">
            <div className="font-mono2 text-[11px] font-bold tracking-[0.25em] uppercase">More {review.genre}</div>
            {ALL_REVIEWS.filter((r) => r.genre === review.genre && r.id !== review.id).slice(0, 4).map((r) => (
              <Link key={r.id} to={`/reviews/${r.slug}`} className="group flex items-center justify-between gap-2 border-b border-black/10 py-2 last:border-0">
                <span className="truncate text-[13px] font-bold"><span className="headline-hover">{r.artist}</span> <span className="font-normal italic">— {r.album}</span></span>
                <span className="font-display shrink-0 text-sm font-black" style={{ color: scoreColor(r.score) }}>{r.score.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
