import { Link } from 'react-router-dom';
import { Disc3, Rss, Mail, ArrowUpRight } from 'lucide-react';
import { GENRES } from '../data/catalog';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-black bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-paper)]">
              <Disc3 size={28} className="text-[var(--color-ink)]" />
              <span className="absolute h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            <span className="font-display text-3xl font-black">Needle<span className="text-[var(--color-accent)]">&</span>Ink</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            An independent paper of record for the album era. 324 reviews and counting, written by humans who listen twice — once on speakers, once on the night bus.
          </p>
          <div className="font-mono2 mt-4 flex flex-wrap gap-2 text-[11px] tracking-widest uppercase">
            <span className="flex items-center gap-1 border border-white/30 px-2 py-1"><Rss size={12} /> RSS</span>
            <span className="flex items-center gap-1 border border-white/30 px-2 py-1"><Mail size={12} /> Newsletter</span>
            <span className="border border-white/30 px-2 py-1">Podcast</span>
            <span className="border border-white/30 px-2 py-1">Print</span>
          </div>
        </div>
        <div>
          <h4 className="font-mono2 mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Sections</h4>
          <ul className="space-y-2 text-sm">
            {[['Reviews', '/reviews'], ['Best New Music', '/best-new-music'], ['News', '/news'], ['Features', '/features'], ['Charts', '/charts'], ['The Lists Issue', '/lists'], ['Genres A–Z', '/genres'], ['Masthead', '/writers']].map(([l, to]) => (
              <li key={to}><Link to={to} className="inline-flex items-center gap-1 text-white/80 hover:text-white hover:underline">{l} <ArrowUpRight size={12} /></Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono2 mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">Top genres</h4>
          <ul className="space-y-2 text-sm">
            {GENRES.slice(0, 8).map((g) => (
              <li key={g}><Link to={`/genres/${encodeURIComponent(g)}`} className="text-white/80 hover:text-white hover:underline">{g}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono2 mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">The small print</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Scores are opinions with numbers on.</li>
            <li>We buy our own tickets.</li>
            <li>No AI writes our reviews. Yes, we checked.</li>
            <li className="pt-2 font-mono2 text-[11px] tracking-widest uppercase">© 2026 Needle & Ink Ltd.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="font-mono2 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10px] tracking-[0.25em] uppercase text-white/50">
          <span>Set in Fraunces & Archivo</span>
          <span>All artists on this page are fictional. All opinions are strongly held.</span>
        </div>
      </div>
    </footer>
  );
}
