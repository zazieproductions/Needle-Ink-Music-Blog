import { hashStr, mulberry } from '../lib/format';
import { WRITERS } from './writers';
import { GENRES, LABELS, artistName, albumTitle, songTitle, genreNotes, pick, rint, slugify, gaussian } from './gen';

export { GENRES };

export interface Track { n: number; title: string; duration: string; standout?: boolean }
export interface Review {
  id: string; slug: string; artist: string; album: string;
  genre: string; subgenres: string[]; label: string;
  releaseDate: string; reviewDate: string; year: number;
  score: number; bnm: boolean; reissue?: boolean; live?: boolean;
  writerId: string; dek: string; pullQuote: string;
  body: string[]; verdict: string;
  tracks: Track[]; tags: string[];
  readTime: number; plays: number; comments: number;
  hue: number; pattern: number; featured: boolean;
}

const GENRE_WRITERS: Record<string, string[]> = {
  'Indie Rock': ['jules-fern', 'eli-navarro'], 'Dream Pop': ['jules-fern', 'hana-sato'],
  'Post-Punk': ['jules-fern', 'ruth-calloway'], 'Shoegaze': ['jules-fern', 'hana-sato'],
  'Hip-Hop': ['maya-okafor', 'marcus-webb'], 'R&B': ['marcus-webb', 'maya-okafor'],
  'Electronic': ['priya-raman', 'sofia-marsh'], 'Techno': ['priya-raman'],
  'Ambient': ['hana-sato', 'priya-raman'], 'Jazz': ['inge-halvorsen', 'adaeze-nwosu'],
  'Folk': ['tom-ellery'], 'Country': ['tom-ellery'], 'Alt-Country': ['tom-ellery', 'jules-fern'],
  'Soul': ['adaeze-nwosu', 'marcus-webb'], 'Afrobeats': ['deo-kamara'],
  'Latin': ['deo-kamara', 'eli-navarro'], 'Hyperpop': ['sofia-marsh', 'priya-raman'],
  'Metal': ['ruth-calloway'], 'Punk': ['ruth-calloway', 'jules-fern'],
  'Experimental': ['hana-sato', 'inge-halvorsen'], 'Pop': ['sofia-marsh', 'maya-okafor'],
  'Drill': ['maya-okafor', 'deo-kamara'],
};

type G = { instruments: string; texture: string; lineage: string; mood: string };

const OPENERS: ((a: string, al: string, g: G) => string)[] = [
  (a, al, g) => `${al} does not begin so much as arrive \u2014 a held breath, a struck match, and suddenly you are inside its weather. Across its runtime, ${a} makes the case that ${g.texture} music can still surprise you, and then keeps making it, louder each time.`,
  (a, al, g) => `There is a moment about ninety seconds into ${al} when everything clicks: the ${g.instruments} lock together, the room seems to tilt, and you understand exactly what ${a} has been driving at. It is the sound of an artist entirely sure of themselves.`,
  (a, al) => `Forget the rollout, the teasers, the discourse. ${al} \u2014 the new record from ${a} \u2014 is that rarest of things: a record that sounds like nobody else and, by the second listen, like it could only ever have been them.`,
  (a, al, g) => `${a} has always been good at tension. On ${al}, they are suddenly, thrillingly good at release \u2014 these are songs built from ${g.instruments}, played as if the studio might be repossessed by morning.`,
  (a, al) => `The first thing you notice about ${al} is its confidence. The second is its curiosity. ${a} spends this record pulling at threads \u2014 melody, rhythm, memory \u2014 until whole new garments come loose.`,
  (a, al, g) => `In lesser hands, ${g.texture} production would smother these songs. Here it does the opposite: every ${g.instruments.split(',')[0]} feels spotlit, every silence feels earned. ${al} is a masterclass in restraint that still hits like a flood.`,
  (a, al) => `Some records you admire. Some you live inside for a season. ${al} is firmly the second kind \u2014 ${a} has made a world here, damp and glowing, and left the door wide open.`,
  (a, al, g) => `${a} recorded ${al} mostly live, mostly late, and you can hear the hour in it: that ${g.mood} glow that only happens after midnight, when the takes get looser and the truths get blunter.`,
];
const MIDDLES: ((a: string, al: string, g: G, t1: string, t2: string) => string)[] = [
  (a, _al, g, t1, t2) => `The sequencing is ruthless in the best way. \u201C${t1}\u201D \u2014 all ${g.instruments} \u2014 gives way to \u201C${t2},\u201D which strips the palette back and lets the songwriting do the talking. It is the record\u2019s hinge, and it swings.`,
  (a, _al, _g, t1) => `Lyrically, ${a} is writing at a new altitude. Grief, rent, group chats, dying high streets, stubborn hope: it is all here, delivered in lines that scan like texts you wish you\u2019d sent. On \u201C${t1}\u201D the pen is simply on fire.`,
  (a, al, g) => `What elevates ${al} above its ${g.lineage} inheritance is touch. The ${g.instruments} never sit where you expect; the mixes breathe; even the loud parts leave fingerprints. This is headphone music with arena shoulders.`,
  (a, _al, _g, _t1, t2) => `Not everything lands \u2014 the middle sags for about eight minutes, as middle sections must \u2014 but then \u201C${t2}\u201D arrives and reframes the whole record. Context is everything: a good song becomes great when ${a} places it exactly here, exactly like this.`,
  (a, _al, g, t1) => `\u201C${t1}\u201D deserves its own paragraph, maybe its own public holiday. Built on ${g.instruments}, it swells, breaks, and rebuilds itself in under five minutes \u2014 the single most undeniable thing ${a} has ever released.`,
  (a, _al, g) => `The production \u2014 handled largely by the artist with a small circle of trusted collaborators \u2014 deserves special praise. ${g.texture.charAt(0).toUpperCase() + g.texture.slice(1)} textures, drums that sound like decisions, bass that rearranges furniture. Play it loud; your neighbours have opinions anyway.`,
  () => `There is craft here that only reveals itself on the fourth or fifth spin: a counter-melody tucked under the chorus, a sample that turns out to be rain on a bus shelter, a lyric that inverts its meaning once you know the ending.`,
  (a, _al, _g, t1) => `Vocally, this is a leap. ${a} sings like someone who has stopped asking permission \u2014 whispering where they once belted, testifying where they once mumbled. \u201C${t1}\u201D finds them at their most exposed and, not coincidentally, their best.`,
];
const CLOSERS: ((a: string, al: string, s: number) => string)[] = [
  (a, al, s) => s >= 8.5 ? `${al} is not just the best thing ${a} has made; it is the record the rest of the year will now have to answer to. Play it twice. Then call someone you love.` : `${al} will not convert the sceptics, and it does not need to. For everyone else, it is forty-odd minutes of proof that ${a} remains one of the most reliable thrills in music.`,
  (a, al, s) => s >= 9 ? `Masterpiece is an overused word, so let us be precise: this is a record with no wasted motion, no hedging, no skips. ${al} belongs in the permanent collection.` : `Flawed, alive, occasionally transcendent \u2014 ${al} is a human record in an airbrushed age, and all the more lovable for it.`,
  (a) => `When the final track dissolves into room noise and somebody laughing off-mic, you get the sense ${a} knows exactly what they have done. They have made the room bigger. Step inside.`,
  (a, al, s) => s < 6 ? `There are glimmers here \u2014 there always are with ${a} \u2014 but ${al} ultimately mistakes motion for momentum. Back to the drawing board, sharper pencil.` : `It ends too soon and lingers too long, which is another way of saying it works. ${al} is that good kind of unfinished: a conversation you want to keep having.`,
];
const DEKS: ((a: string, al: string, g: G) => string)[] = [
  (a, _al, g) => `On a ${g.mood} triumph, ${a} turns ${g.instruments} into something close to scripture.`,
  (a) => `${a} returns with a record that is bigger, stranger and more tender than anything in their catalogue.`,
  (a, al, g) => `${g.texture.charAt(0).toUpperCase() + g.texture.slice(1)} and high-stakes: ${al} is ${a} at their most dialled-in.`,
  (a, al) => `Grief, euphoria and everything between: ${al} finds ${a} writing the most complete songs of their life.`,
  (a, _al, g) => `A late-night, ${g.mood} stunner that reframes what ${a} can do \u2014 and what comes next.`,
  (a) => `Forty minutes, zero skips, one undeniable statement: ${a} has never sounded more alive.`,
];
const PULLS: ((al: string) => string)[] = [
  (al) => `\u201C${al} is the sound of an artist entirely sure of themselves.\u201D`,
  () => `\u201CA masterclass in restraint that still hits like a flood.\u201D`,
  () => `\u201CHeadphone music with arena shoulders.\u201D`,
  (al) => `\u201C${al} makes the room bigger. Step inside.\u201D`,
  () => `\u201CThe single most undeniable thing they have ever released.\u201D`,
  () => `\u201CA human record in an airbrushed age.\u201D`,
];

function verdictFor(s: number): string {
  if (s >= 9) return 'Essential. Clear your evening, dim the lights, play it front to back.';
  if (s >= 8.5) return 'Superb. A year-end lock and a career high.';
  if (s >= 8) return 'Excellent. Among the year\u2019s most rewarding listens.';
  if (s >= 7) return 'Very good. Flawed in the ways that make records lovable.';
  if (s >= 6) return 'Good, not great \u2014 worth your time, if not your devotion.';
  return 'Uneven. Moments of brilliance inside a muddled whole.';
}

export const ALL_REVIEWS: Review[] = (() => {
  const out: Review[] = [];
  const used = new Set<string>();
  const N = 324;
  for (let i = 0; i < N; i++) {
    const rnd = mulberry(hashStr('needle-ink-' + i));
    let artist = artistName(rnd);
    let album = albumTitle(rnd);
    let key = artist + '|' + album;
    let guard = 0;
    while (used.has(key) && guard++ < 25) { artist = artistName(rnd); album = albumTitle(rnd); key = artist + '|' + album; }
    used.add(key);
    const genre = GENRES[Math.floor(mulberry(hashStr('g' + i))() * GENRES.length)];
    const notes = genreNotes(genre);
    const subRnd = mulberry(hashStr('sub' + i));
    const others = GENRES.filter((g) => g !== genre);
    const subgenres = [pick(subRnd, others)];
    if (subRnd() > 0.6) subgenres.push(pick(subRnd, others));
    const label = pick(rnd, LABELS);
    const start = new Date('2024-01-05T00:00:00Z').getTime();
    const end = new Date('2026-09-08T00:00:00Z').getTime();
    const t = Math.pow(rnd(), 0.7);
    const rel = new Date(start + t * (end - start));
    const relIso = rel.toISOString().slice(0, 10);
    const revDate = new Date(rel.getTime() + rint(rnd, 0, 6) * 86400000);
    const cap = new Date('2026-09-09T00:00:00Z').getTime();
    if (revDate.getTime() > cap) revDate.setTime(new Date('2026-09-08T00:00:00Z').getTime());
    const revIso = revDate.toISOString().slice(0, 10);
    const year = rel.getUTCFullYear();
    let score = 7.4 + gaussian(rnd) * 1.05;
    const boost = rnd();
    if (boost > 0.965) score = 9 + rnd() * 1.0;
    else if (boost > 0.93) score = 8.5 + rnd() * 0.6;
    score = Math.max(4.1, Math.min(10, Math.round(score * 10) / 10));
    const bnm = score >= 8.5;
    const writers = GENRE_WRITERS[genre] ?? WRITERS.map((w) => w.id);
    const writerId = writers[Math.floor(rnd() * writers.length)];
    const trackCount = rint(rnd, 8, 13);
    const tracks: Track[] = [];
    const tset = new Set<string>();
    for (let ti = 0; ti < trackCount; ti++) {
      let tt = songTitle(rnd);
      let gg = 0;
      while (tset.has(tt) && gg++ < 12) tt = songTitle(rnd);
      tset.add(tt);
      tracks.push({ n: ti + 1, title: tt, duration: `${rint(rnd, 2, 6)}:${String(rint(rnd, 0, 59)).padStart(2, '0')}` });
    }
    const sIdx = new Set<number>();
    while (sIdx.size < Math.min(3, trackCount)) sIdx.add(Math.floor(rnd() * trackCount));
    sIdx.forEach((idx) => { tracks[idx].standout = true; });
    const st = tracks.filter((x) => x.standout).map((x) => x.title);
    const t1 = st[0] ?? tracks[0].title;
    const t2 = st[1] ?? tracks[Math.min(2, tracks.length - 1)].title;
    const opener = pick(rnd, OPENERS)(artist, album, notes);
    const m1 = pick(rnd, MIDDLES)(artist, album, notes, t1, t2);
    let m2 = pick(rnd, MIDDLES)(artist, album, notes, t2, t1);
    if (m2 === m1) m2 = pick(rnd, MIDDLES)(artist, album, notes, t1, t2);
    const mid3 = `Across ${trackCount} tracks, the record moves like weather \u2014 front-loaded with singles, back-loaded with risks. The closing run, from \u201C${tracks[trackCount - 2].title}\u201D into \u201C${tracks[trackCount - 1].title},\u201D is the bravest stretch ${artist} has committed to tape: slower, stranger, and somehow the part you replay first.`;
    const closer = pick(rnd, CLOSERS)(artist, album, score);
    const body = [opener, m1, m2, mid3, closer];
    const dek = pick(rnd, DEKS)(artist, album, notes);
    const pullQuote = pick(rnd, PULLS)(album);
    const tags = [genre, ...subgenres, score >= 8 ? 'Year-end contender' : '', bnm ? 'Best New Music' : '', String(year)].filter(Boolean);
    const hue = hashStr(artist + album) % 360;
    const pattern = hashStr(album + 'pat') % 8;
    const slug = slugify(`${artist} ${album}`) + `-${i}`;
    out.push({
      id: `r-${i}`, slug, artist, album, genre, subgenres, label,
      releaseDate: relIso, reviewDate: revIso, year, score, bnm,
      writerId, dek, pullQuote, body, verdict: verdictFor(score),
      tracks, tags, readTime: rint(rnd, 4, 9),
      plays: rint(rnd, 800, 240000), comments: rint(rnd, 0, 240),
      hue, pattern, featured: i < 60 && score >= 7.8,
      reissue: rnd() > 0.965, live: rnd() > 0.975,
    });
  }
  out.sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1));
  const leadIdx = out.findIndex((r) => r.score >= 9 && r.reviewDate >= '2026-07-01');
  if (leadIdx > 0) { const [lead] = out.splice(leadIdx, 1); out.unshift(lead); }
  return out;
})();

export const BNM_REVIEWS = ALL_REVIEWS.filter((r) => r.bnm);
export const REVIEW_BY_SLUG = new Map(ALL_REVIEWS.map((r) => [r.slug, r]));

export function relatedReviews(r: Review, n = 4): Review[] {
  return ALL_REVIEWS.filter((x) => x.id !== r.id)
    .map((x) => {
      let s = 0;
      if (x.genre === r.genre) s += 5;
      if (x.subgenres.some((g) => g === r.genre || r.subgenres.includes(g))) s += 2;
      if (x.writerId === r.writerId) s += 1.5;
      if (Math.abs(x.score - r.score) < 0.5) s += 1;
      s += (hashStr(x.id + r.id) % 100) / 100;
      return { x, s };
    })
    .sort((a, b) => b.s - a.s).slice(0, n).map((d) => d.x);
}

export function genreStats() {
  return GENRES.map((g) => {
    const rs = ALL_REVIEWS.filter((r) => r.genre === g);
    const avg = rs.length ? rs.reduce((a, b) => a + b.score, 0) / rs.length : 0;
    return { genre: g, count: rs.length, avg: Math.round(avg * 100) / 100, bnm: rs.filter((r) => r.bnm).length };
  }).sort((a, b) => b.count - a.count);
}

export function topOfYear(year: number, n = 50): Review[] {
  return ALL_REVIEWS.filter((r) => r.year === year)
    .sort((a, b) => b.score - a.score || (a.reviewDate < b.reviewDate ? 1 : -1)).slice(0, n);
}
