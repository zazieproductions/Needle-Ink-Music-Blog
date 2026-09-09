import { Link } from 'react-router-dom';
import { Award, Clock, MessageSquare } from 'lucide-react';
import type { Review } from '../data/catalog';
import { writerById } from '../data/writers';
import { formatDate } from '../lib/format';
import CoverArt from './CoverArt';
import ScoreBadge from './ScoreBadge';

export function Byline({ writerId, date, light = false }: { writerId: string; date: string; light?: boolean }) {
  const w = writerById(writerId);
  return (
    <div className="flex items-center gap-2">
      <Link to={`/writers/${w.id}`} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: w.color }}>
          {w.initials}
        </span>
        <span className={`font-mono2 text-[11px] tracking-wide uppercase hover:underline ${light ? 'text-white/90' : ''}`}>
          {w.name}
        </span>
      </Link>
    </div>
  );
}

export function Meta({ review, light = false }: { review: Review; light?: boolean }) {
  return (
    <div className={`font-mono2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-wide uppercase ${light ? 'text-white/70' : 'text-[var(--color-smoke)]'}`}>
      <span>{formatDate(review.reviewDate)}</span>
      <span className="inline-flex items-center gap-1"><Clock size={11} /> {review.readTime} min</span>
      <span className="inline-flex items-center gap-1"><MessageSquare size={11} /> {review.comments}</span>
    </div>
  );
}

export function ReviewCard({ review, rank }: { review: Review; rank?: number }) {
  const w = writerById(review.writerId);
  return (
    <Link to={`/reviews/${review.slug}`} className="group flex gap-4 border-b border-black/15 py-5 last:border-0">
      {rank !== undefined && (
        <span className="font-display w-10 shrink-0 text-4xl font-black text-black/20 italic">{rank}</span>
      )}
      <CoverArt hue={review.hue} pattern={review.pattern} artist={review.artist} album={review.album} showText={false} className="aspect-square w-24 shrink-0 sm:w-28" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{review.genre}</span>
          {review.bnm && (
            <span className="inline-flex items-center gap-1 bg-[var(--color-ink)] px-1.5 py-0.5 font-mono2 text-[9px] font-bold tracking-widest text-[var(--color-gold)] uppercase">
              <Award size={10} /> BNM
            </span>
          )}
        </div>
        <h3 className="font-display text-lg leading-tight font-black">
          <span className="headline-hover">{review.artist}</span>
          <span className="font-light italic"> — {review.album}</span>
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[var(--color-smoke)]">{review.dek}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-mono2 truncate text-[11px] tracking-wide text-[var(--color-smoke)] uppercase">{w.name} · {formatDate(review.reviewDate)}</span>
          <ScoreBadge score={review.score} size="sm" />
        </div>
      </div>
    </Link>
  );
}

export function ReviewTile({ review }: { review: Review }) {
  return (
    <Link to={`/reviews/${review.slug}`} className="group block">
      <div className="relative">
        <CoverArt hue={review.hue} pattern={review.pattern} artist={review.artist} album={review.album} className="aspect-square w-full" />
        <div className="absolute top-2 left-2"><ScoreBadge score={review.score} size="md" /></div>
        {review.bnm && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[var(--color-gold)] px-1.5 py-0.5 font-mono2 text-[9px] font-bold tracking-widest text-black uppercase">
            <Award size={10} /> Best New Music
          </div>
        )}
      </div>
      <div className="pt-2">
        <div className="font-mono2 text-[10px] font-bold tracking-widest text-[var(--color-accent-deep)] uppercase">{review.genre}</div>
        <h3 className="font-display text-[15px] leading-tight font-black"><span className="headline-hover">{review.artist}</span> <span className="font-light italic">— {review.album}</span></h3>
      </div>
    </Link>
  );
}
