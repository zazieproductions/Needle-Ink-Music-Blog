import { hashStr, mulberry } from '../lib/format';

export function pick<T>(rnd: () => number, arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}
export function rint(rnd: () => number, a: number, b: number): number {
  return a + Math.floor(rnd() * (b - a + 1));
}
export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}
export function gaussian(rnd: () => number): number {
  return (rnd() + rnd() + rnd() + rnd() - 2) / 1.2;
}

export const GENRES = [
  'Indie Rock','Dream Pop','Post-Punk','Shoegaze','Hip-Hop','R&B',
  'Electronic','Techno','Ambient','Jazz','Folk','Country',
  'Soul','Afrobeats','Latin','Hyperpop','Metal','Punk',
  'Experimental','Pop','Alt-Country','Drill',
];

export const LABELS = ['Harborlight','Dead Static','Night School','Copper Vein','Glasshouse Intl.','Palais Records','Soft Focus','Iron & Honey','Meridian','Ghost Frequency','Sundown Tapes','Colossal','Paper Moon','Vespertine','Low Country','Ultraviolet Co.','Ferrous','Honeycomb','Second City Sound','Alabaster','Moon Dial','Cartography'];

export const FIRST = ['Ada','June','Milo','Iris','Theo','Wren','Otis','Noor','Silas','Paloma','Reyes','Alba','Cassius','Ines','Jasper','Lena','Micah','Odette','Rafi','Sable','Tomas','Uma','Vesper','Yuki','Zola','Emmett','Farah','Gus','Hazel','Idris'];
export const LAST = ['Marlowe','Vance','Delacroix','Quill','Ferreira','Halloway','Blackwood','Cassidy','Thorne','Ashworth','Bellamy','Corvane','Driscoll','Fontaine','Grimaldi','Holloway','Iversen','Kessler','Lockhart','Mercer','Nightingale','Osborne','Pryce','Quarry','Renshaw','Sutter','Vale','Okonkwo','Adeyemi'];
export const ADJ = ['Hollow','Velvet','Glass','Electric','Midnight','Pale','Golden','Broken','Silent','Wild','Paper','Copper','Neon','Amber','Iron','Honey','Concrete','Ultraviolet','Satin','Crimson','Static','Mossy','Tidal','Feral','Luminous','Sombre','Feathered','Brazen','Willow','Obsidian','Salted','Vaporous','Woven','Secondhand'];
export const NOUN = ['Horses','Cathedral','Mirror','Season','Harbor','Antenna','Garden','Static','River','Cinema','Weather','Orchid','Engine','Choir','Foxes','Lantern','Meadow','Motorway','Nectar','Ocean','Parade','Quarry','Ritual','Sirens','Tide','Violet','Wolves','Yard','Zephyr','Bellwether','Comedown','Daydream','Ember','Field','Ghost'];
export const VERB = ['Swallow','Borrow','Chase','Drown','Follow','Gather','Haunt','Keep','Lose','Map','Name','Open','Praise','Ruin','Sing','Tend','Unlearn','Visit','Weather','Yield'];
export const ALBUM_ONE = ['Eulogy','Afterglow','Bloom','Cinder','Drift','Exile','Fable','Gloaming','Hymn','Interlude','Jubilee','Keepsake','Lullaby','Mirage','Nocturne','Offering','Psalm','Requiem','Sermon','Talisman','Undertow','Vigil','Wilderness','Yearning'];
export const SONG_FRAG = ['Silver','Nylon','Copper','Velvet','Glass','Honey','Static','Amber','Paper','Midnight','Pale','Wild','Tidal','Violet','Crimson','Neon','Hollow','Golden','Silent','Electric','Morning','Evening','Sunday','Low','High','Last','First','Half-Light','Blue'];
export const SONG_NOUN = ['Hour','Light','Road','Song','Fire','Water','Dress','Window','Telephone','Garden','Cinema','Harbor','Season','Mirror','Choir','Engine','River','Weather','Antenna','Lantern','Meadow','Parade','Ritual','Tide','Wolves','Ember','Field','Ghost','Orchid','Nectar'];

export function artistName(rnd: () => number): string {
  const kind = rnd();
  if (kind < 0.34) return `${pick(rnd, FIRST)} ${pick(rnd, LAST)}`;
  if (kind < 0.62) {
    const c = rnd();
    if (c < 0.4) return `The ${pick(rnd, ADJ)} ${pick(rnd, NOUN)}`;
    if (c < 0.7) return `${pick(rnd, ADJ)} ${pick(rnd, NOUN)}`;
    return `${pick(rnd, NOUN)} & ${pick(rnd, NOUN)}`;
  }
  if (kind < 0.8) {
    const a = pick(rnd, FIRST);
    const opts = [`${a} Velvet`, `${a} Blooms`, `${a} in Winter`, `${a}Sounds`, `DJ ${pick(rnd, LAST)}`, `${pick(rnd, LAST)} Ensemble`];
    return pick(rnd, opts);
  }
  return `${pick(rnd, FIRST)} ${pick(rnd, FIRST).toLowerCase()}${pick(rnd, ['e', 'a', 'ø', 'ii'])}`;
}

export function albumTitle(rnd: () => number): string {
  const k = rnd();
  if (k < 0.22) return `${pick(rnd, ADJ)} ${pick(rnd, NOUN)}`;
  if (k < 0.34) return `${pick(rnd, VERB)} the ${pick(rnd, NOUN)}`;
  if (k < 0.46) return `${pick(rnd, NOUN)} of ${pick(rnd, NOUN)}`;
  if (k < 0.58) return `${pick(rnd, ALBUM_ONE)}`;
  if (k < 0.7) return `The ${pick(rnd, NOUN)} ${pick(rnd, ['Tapes', 'Sessions', 'Hours', 'Years', 'Diaries', 'Club', 'Orchestra', 'Method'])}`;
  if (k < 0.82) return `${pick(rnd, ['A', 'My', 'Your', 'Our'])} ${pick(rnd, ADJ)} ${pick(rnd, NOUN)}`;
  if (k < 0.92) return `${pick(rnd, SONG_FRAG)} ${pick(rnd, SONG_NOUN)}`;
  return `${pick(rnd, VERB)} ${pick(rnd, ['Me', 'Everything', 'Nothing', 'Slowly', 'Again', 'Alone', 'Forever'])}`;
}

export function songTitle(rnd: () => number): string {
  const k = rnd();
  if (k < 0.4) return `${pick(rnd, SONG_FRAG)} ${pick(rnd, SONG_NOUN)}`;
  if (k < 0.55) return `${pick(rnd, VERB)} ${pick(rnd, ['Me Slowly', 'It All', 'the Light', 'You Back', 'the River', 'in Tongues'])}`;
  if (k < 0.7) return `${pick(rnd, ['Interlude', 'Reprise', 'Prelude'])}: ${pick(rnd, SONG_FRAG)} ${pick(rnd, SONG_NOUN)}`;
  if (k < 0.85) return `${pick(rnd, FIRST)}\u2019s ${pick(rnd, SONG_NOUN)}`;
  return `${pick(rnd, ALBUM_ONE)} ${pick(rnd, ['II', 'Revisited', '(Reprise)', 'in Blue', 'at Dusk'])}`;
}

export function genreNotes(g: string): { instruments: string; texture: string; lineage: string; mood: string } {
  const M: Record<string, { instruments: string; texture: string; lineage: string; mood: string }> = {
    'Indie Rock': { instruments: 'offset guitars, motorik drums and gang vocals', texture: 'chorus-pedalled and room-mic\u2019d', lineage: 'from the Cleaners to the current DIY archipelago', mood: 'wry, windblown, quietly euphoric' },
    'Dream Pop': { instruments: 'dissolving guitars, soft machines and stacked harmonies', texture: 'reverbed to the point of weather', lineage: 'from Cocteau haze to bedroom shoegaze', mood: 'gauzy, lovesick, half-asleep' },
    'Post-Punk': { instruments: 'wire-tight bass, scrape guitar and deadpan talk-sing', texture: 'dry, close-mic\u2019d and twitchy', lineage: 'from Leeds basements to the global gig circuit', mood: 'anxious, arch, wired' },
    'Shoegaze': { instruments: 'a wall of detuned guitars and buried melody', texture: 'pedal-boarded into white light', lineage: 'from Reading \u201991 to the new gaze underground', mood: 'overwhelming, tender, loud-quiet-loud' },
    'Hip-Hop': { instruments: 'chopped soul loops, 808s and left-field drums', texture: 'dusty then gleaming', lineage: 'from boom-bap classicism to the abstract fringe', mood: 'hungry, hilarious, heavy-hearted' },
    'R&B': { instruments: 'silk-stacked vocals, sub bass and late-night keys', texture: 'close, humid, immaculate', lineage: 'from quiet-storm radio to alternative rhythm', mood: 'confessional, sensual, self-possessed' },
    'Electronic': { instruments: 'modular arps, sampled choirs and sculpted low-end', texture: 'glossy, tactile, hyper-detailed', lineage: 'from IDM headphone music to main-stage euphoria', mood: 'restless, radiant, slightly feral' },
    'Techno': { instruments: 'relentless kick, dub chords and hi-hat science', texture: 'cavernous and precision-cut', lineage: 'from Detroit futurism to Berghain functionalism', mood: 'hypnotic, severe, transcendent' },
    'Ambient': { instruments: 'tape loops, piano felt and field recording', texture: 'slow, porous, dawn-lit', lineage: 'from Eno\u2019s airports to sleep streams', mood: 'weightless, mournful, patient' },
    'Jazz': { instruments: 'brushed drums, modal piano and conversational horns', texture: 'live-room warm and unhurried', lineage: 'from spiritual jazz to London\u2019s new wave', mood: 'questing, communal, alive' },
    'Folk': { instruments: 'fingerpicked guitar, fiddle and room tone', texture: 'oaken, plainspoken, close', lineage: 'from Greenwich Village to the modern song-catchers', mood: 'ruminative, wry, haunted' },
    'Country': { instruments: 'crying pedal steel, telecaster snap and three-part harmony', texture: 'honky-tonk crisp with gospel warmth', lineage: 'from Bakersfield to the Americana charts', mood: 'heartbroke, funny, defiant' },
    'Soul': { instruments: 'horn stabs, church organ and testifying vocals', texture: 'analog-warm with digital punch', lineage: 'from Stax/Volt to the new southern soul', mood: 'rapturous, wounded, resilient' },
    'Afrobeats': { instruments: 'log drums, shakers and highlife guitar licks', texture: 'percussive, sunlit, endlessly swaying', lineage: 'from Lagos street parties to global pop', mood: 'effervescent, flirtatious, unstoppable' },
    'Latin': { instruments: 'dembow riddims, nylon guitar and brass mambos', texture: 'humid, syncopated, neon-edged', lineage: 'from perreo basements to stadium reggaeton', mood: 'sweaty, romantic, towering' },
    'Hyperpop': { instruments: 'bitcrushed synths, pitched vocals and gabber kicks', texture: 'sugary then violent, often in one bar', lineage: 'from PC Music to the post-genre feed', mood: 'manic, tender, extremely online' },
    'Metal': { instruments: 'downtuned riffs, blast beats and choral doom', texture: 'granite-heavy with dynamic light', lineage: 'from Sabbath sludge to blackgaze', mood: 'apocalyptic, devotional, cathartic' },
    'Punk': { instruments: 'buzzsaw guitars, sprinting drums and shout-alongs', texture: 'recorded fast, mixed faster', lineage: 'from \u201977 singles to the all-ages present', mood: 'furious, funny, principled' },
    'Experimental': { instruments: 'prepared strings, feedback systems and found sound', texture: 'brittle, spatial, unpredictable', lineage: 'from downtown minimalism to laptop deconstruction', mood: 'curious, severe, strangely moving' },
    'Pop': { instruments: 'maximalist hooks, stacked ad-libs and stadium drums', texture: 'lacquered, enormous, engineered to stick', lineage: 'from Brill Building craft to the algorithm era', mood: 'dizzy, heartsore, undeniable' },
    'Alt-Country': { instruments: 'twang and drone, harmonium and heartbreak', texture: 'dusty, literate, late-night', lineage: 'from Uncle Tupelo to the indie crossover', mood: 'bookish, bruised, romantic' },
    'Drill': { instruments: 'sliding 808s, minor-key piano and dead-eyed hats', texture: 'cold, minimal, menacing', lineage: 'from Chicago to Brixton to the world', mood: 'tense, mournful, magnetic' },
  };
  return M[g] ?? M['Indie Rock'];
}

export { hashStr, mulberry };
