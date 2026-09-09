import { hashStr, mulberry } from '../lib/format';
import { WRITERS } from './writers';
import { LABELS, artistName, albumTitle, pick, rint, slugify } from './gen';

export interface NewsItem {
  id: string; slug: string; headline: string; category: string;
  dek: string; body: string[]; writerId: string; publishedAt: string;
  readTime: number; hue: number; breaking?: boolean; pattern: number;
}

export interface Feature {
  id: string; slug: string; title: string; dek: string;
  writerId: string; date: string; readTime: number;
  body: string[]; pullQuote: string; tag: string; hue: number; pattern: number;
}

const NEWS_TEMPLATES: { cat: string; make: (rnd: () => number) => { h: string; dek: string } }[] = [
  { cat: 'Tour', make: (rnd) => { const a = artistName(rnd); const city = pick(rnd, ['London', 'New York', 'Berlin', 'Tokyo', 'Mexico City', 'Lagos', 'Paris', 'Chicago']); return { h: `${a} announce huge 2027 world tour with ${city} residency`, dek: `The run spans four continents, includes a five-night ${city} stand, and promises \u201Ca completely rebuilt live show.\u201D` }; } },
  { cat: 'Albums', make: (rnd) => { const a = artistName(rnd); const al = albumTitle(rnd); return { h: `${a} surprise-release new album ${al}`, dek: `Dropped with no warning at midnight, the ${rint(rnd, 9, 14)}-track record is already breaking first-day traffic records.` }; } },
  { cat: 'Festivals', make: (rnd) => { const f = pick(rnd, ['Glastonbury', 'Primavera', 'Roskilde', 'Pitchfork Paris', 'End of the Road', 'Sonar', 'Fuji Rock']); const a = artistName(rnd); return { h: `${f} reveals 2027 headliners as ${a} tops the bill`, dek: `Organisers promise the \u201Cmost ambitious edition yet\u201D with three new stages and a late-night electronic programme.` }; } },
  { cat: 'Industry', make: (rnd) => { const l = pick(rnd, LABELS); return { h: `Inside ${l}\u2019s unlikely rise to indie powerhouse`, dek: `Ten years, forty staff, zero outside investment: how a bedroom label became the most trusted A&R in the country.` }; } },
  { cat: 'Reissues', make: (rnd) => { const a = artistName(rnd); const y = pick(rnd, ['1978', '1984', '1991', '1997', '2003']); return { h: `${a}\u2019s lost ${y} sessions unearthed for deluxe box set`, dek: `The 4xLP edition includes 22 unreleased tracks, a 120-page oral history and a replica tour laminate.` }; } },
  { cat: 'Collabs', make: (rnd) => { const a = artistName(rnd); const b = artistName(rnd); return { h: `${a} and ${b} link up for joint EP`, dek: `The four-track collaboration was recorded in six days in Lisbon and sounds exactly like that sentence feels.` }; } },
  { cat: 'Awards', make: (rnd) => { const a = artistName(rnd); return { h: `${a} leads this year\u2019s Mercury shortlist as odds tighten`, dek: `Bookmakers have the record at 3/1, but our critics\u2019 panel is split three ways. Here is the case for each contender.` }; } },
  { cat: 'Tech', make: () => ({ h: 'Streaming royalties are up \u2014 so why are mid-size acts still broke?', dek: 'We asked 30 managers, three label heads and one very honest accountant where the money actually goes.' }) },
  { cat: 'Live', make: (rnd) => { const a = artistName(rnd); const v = pick(rnd, ['Alexandra Palace', 'Red Rocks', 'Hollywood Bowl', 'O2 Academy Brixton', 'Radio City']); return { h: `${a} play career-defining set at ${v}`, dek: `Two hours, 24 songs, one unforgettable cover. Our review from the front row \u2014 plus the full setlist.` }; } },
  { cat: 'Film & TV', make: (rnd) => { const a = artistName(rnd); return { h: `${a} to score forthcoming A24 drama`, dek: `The director calls the music \u201Cthe film\u2019s second script.\u201D Recording begins in Reykjavik next month.` }; } },
  { cat: 'Albums', make: (rnd) => { const a = artistName(rnd); return { h: `${a} tease double album with cryptic billboard campaign`, dek: `Posters appeared overnight in three cities. Fans have already decoded the tracklist \u2014 probably.` }; } },
  { cat: 'Industry', make: () => ({ h: 'Vinyl pressing plants are booked solid into 2027', dek: 'Demand is up 18% year on year. We went inside the factories racing to keep up.' }) },
];

export const ALL_NEWS: NewsItem[] = (() => {
  const out: NewsItem[] = [];
  for (let i = 0; i < 64; i++) {
    const rnd = mulberry(hashStr('news-' + i));
    const t = pick(rnd, NEWS_TEMPLATES);
    const { h, dek } = t.make(rnd);
    const d = new Date(new Date('2026-09-09T12:00:00Z').getTime() - rint(rnd, 1, 240) * 3600000 - rint(rnd, 0, 50) * 60000);
    out.push({
      id: `n-${i}`, slug: slugify(h).slice(0, 60) + `-${i}`, headline: h, category: t.cat, dek,
      body: [
        `${dek} Full details emerged this morning, and the reaction \u2014 from fans, peers and at least one rival manager quoted below \u2014 has been immediate and loud.`,
        `Speaking exclusively to Needle & Ink, a source close to the project said the move had been \u201Cmonths in the making\u201D and described the mood in the camp as \u201Cquietly euphoric.\u201D More announcements are expected within days, with insiders pointing to a fuller statement before the weekend.`,
        `Context matters here. The last eighteen months have rewired how records are released, toured and talked about \u2014 and this story sits squarely at the centre of that shift. Our columnists weigh in below, and the comments are already doing numbers.`,
        `We will update this story as it develops. In the meantime, revisit our recent review archive for the back catalogue \u2014 it sounds different this morning.`,
      ],
      writerId: WRITERS[Math.floor(rnd() * WRITERS.length)].id,
      publishedAt: d.toISOString(),
      readTime: rint(rnd, 2, 6), hue: hashStr(h) % 360, breaking: i < 4, pattern: hashStr(h + 'n') % 8,
    });
  }
  out.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return out;
})();

export const NEWS_BY_SLUG = new Map(ALL_NEWS.map((n) => [n.slug, n]));

const FEATURE_DEFS: { title: string; dek: string; tag: string; quote: string }[] = [
  { title: 'The Album Is Not Dead. It Just Moved House.', dek: 'Streaming was supposed to kill the LP. Instead, artists rebuilt it \u2014 stranger, longer, more personal. Twelve makers of the year\u2019s best records on why the long form still wins.', tag: 'The Big Read', quote: '\u201CThe playlist is a mood. The album is a person.\u201D' },
  { title: 'Bar Exam: How Rap Learned to Whisper', dek: 'The loudest genre in the world went quiet \u2014 and got harder, sadder and better. Maya Okafor traces the murmur from basements to stadiums.', tag: 'Column', quote: '\u201CPower no longer needs to shout.\u201D' },
  { title: 'State of the Rave 2026: Joy as Infrastructure', dek: 'Priya Raman visits six cities, four free parties and one 6am licensing hearing to ask who dance music is really for now.', tag: 'Reportage', quote: '\u201CThe best club in Europe has no name and no photos.\u201D' },
  { title: 'The Session Players Saving Country Music', dek: 'In Nashville, a quiet generation of pickers and pedal-steel mystics is rewriting the sound from the inside. Tom Ellery spends a week in the studios.', tag: 'Nashville Week', quote: '\u201CEvery hit you love has the same five people on it.\u201D' },
  { title: 'Lagos to London: The Shoreline Exchange', dek: 'Afrobeats, amapiano and alte are converging into something entirely new. Deo Kamara maps the routes, the remixes and the group chats.', tag: 'Global', quote: '\u201CThe ocean is the studio now.\u201D' },
  { title: 'In Defence of the 7.4: A Critic\u2019s Confession', dek: 'Not every record is a masterpiece and that is the point. Jules Fern on the noble, necessary art of the good-not-great album.', tag: 'Criticism', quote: '\u201CA 7.4 can save your October. A 9.4 can ruin your standards.\u201D' },
  { title: 'The Quiet Boom: How Ambient Conquered the Algorithm', dek: 'Sleep streams, study playlists, drone TikTok: Hana Sato on the strangest commercial success story in modern music.', tag: 'Investigation', quote: '\u201CSilence scales.\u201D' },
  { title: 'Sweeping Up: The People Who Keep Heavy Music Alive', dek: 'Promoters, van-drivers, door staff, zine kids. Ruth Calloway on the unglamorous labour beneath the loudest riffs.', tag: 'Heavy Music', quote: '\u201CSomeone has to stay to sweep up.\u201D' },
  { title: 'Hooked: The Three-Minute Miracle', dek: 'Sofia Marsh argues the pop single is the century\u2019s highest art form \u2014 and brings receipts from 60 years of hooks.', tag: 'Essay', quote: '\u201CBrevity is not the enemy of depth.\u201D' },
  { title: 'Blue Notes, New Voices: Jazz\u2019s Second Second Coming', dek: 'Inge Halvorsen on the pianists, poets and producers dragging jazz somewhere it has never been \u2014 while honouring everywhere it has.', tag: 'Jazz', quote: '\u201CTradition is a launchpad, not a leash.\u201D' },
  { title: 'The Van, the Hall, the Pit: Touring at the Margins', dek: 'Fuel costs doubled. Fees didn\u2019t. Five bands open their books and explain how they still make it to your town.', tag: 'Investigation', quote: '\u201CEvery show is a small miracle of spreadsheets.\u201D' },
  { title: 'Reissue Fever: Who Owns the Past?', dek: 'Deluxe boxes are booming \u2014 but who finds the tapes, who gets paid, and who decides what \u201Ccomplete\u201D means? Adaeze Nwosu digs through the vaults.', tag: 'Long Read', quote: '\u201CMemory has a licensing department.\u201D' },
];

export const ALL_FEATURES: Feature[] = FEATURE_DEFS.map((f, i) => {
  const rnd = mulberry(hashStr('feat-' + i));
  const d = new Date(new Date('2026-09-01T00:00:00Z').getTime() - i * 6 * 86400000);
  return {
    id: `f-${i}`, slug: slugify(f.title) + `-${i}`, title: f.title, dek: f.dek,
    writerId: WRITERS[Math.floor(rnd() * WRITERS.length)].id,
    date: d.toISOString().slice(0, 10), readTime: rint(rnd, 9, 18),
    body: [
      `${f.dek} What follows is the product of months of reporting: late nights in studios, early mornings in service stations, and dozens of conversations with the people actually making the music.`,
      `The first thing to understand is that nobody agrees. Ask three producers the same question and you get four answers, a voice note, and an invitation to a listening session you absolutely must not miss. That disagreement is the story: a scene arguing with itself, in public, at high volume \u2014 and producing its best work in years.`,
      `Spend any time where the music is made \u2014 the rehearsal rooms with the broken radiators, the kitchens doubling as vocal booths, the clubs that only exist on Fridays \u2014 and a different picture emerges from the one on the timelines. Here, success is measured in kept bands, paid collaborators and rooms that still smell of last night when you unlock them.`,
      `There are numbers, too, and they complicate the romance. Costs are up, attention is fractured, and the middle has never been thinner. Yet the work keeps coming: stranger, braver, more specific. Perhaps constraint is the collaborator nobody booked but everybody needed.`,
      `So where does it go from here? Nobody we spoke to would predict \u2014 superstition, mostly \u2014 but everyone agreed on one thing: the next twelve months will be louder, weirder and more human than the last. We will be there, notebook open, earplugs in.`,
    ],
    pullQuote: f.quote, tag: f.tag, hue: hashStr(f.title) % 360, pattern: i % 8,
  };
});

export const FEATURE_BY_SLUG = new Map(ALL_FEATURES.map((f) => [f.slug, f]));
