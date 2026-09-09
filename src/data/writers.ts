export interface Writer {
  id: string;
  name: string;
  role: string;
  beats: string[];
  bio: string;
  location: string;
  joined: number;
  color: string;
  initials: string;
  reviewsCount?: number;
}

export const WRITERS: Writer[] = [
  { id: 'maya-okafor', name: 'Maya Okafor', role: 'Editor-in-Chief', beats: ['Rap', 'R&B', 'Pop'], location: 'London', joined: 2014, color: '#ff3d00', initials: 'MO', bio: 'Maya founded the paper\u2019s rap desk and still writes the Monday column \u201CBar Exam\u201D. She has covered three UK elections, two Drake beefs and one unforgettable night at Finsbury Park. She believes the album is alive and the playlist is a rumour.' },
  { id: 'jules-fern', name: 'Jules Fern', role: 'Reviews Editor', beats: ['Indie', 'Rock', 'Shoegaze'], location: 'Manchester', joined: 2016, color: '#1e1c18', initials: 'JF', bio: 'Jules assigns roughly 400 records a year and listens to all of them twice, once on speakers and once on the night bus. Former touring bassist. Keeps a spreadsheet of every feedback pedal mentioned in copy since 2019.' },
  { id: 'priya-raman', name: 'Priya Raman', role: 'Senior Critic', beats: ['Electronic', 'Ambient', 'Club'], location: 'Berlin', joined: 2017, color: '#3d5a3a', initials: 'PR', bio: 'Priya writes about dance music as labour history. She DJs under no name, for no money, at parties with no photos. Her annual \u201CState of the Rave\u201D essay is the closest thing this paper has to a founding document.' },
  { id: 'tom-ellery', name: 'Tom Ellery', role: 'Senior Writer', beats: ['Folk', 'Country', 'Americana'], location: 'Nashville', joined: 2015, color: '#7c1d1d', initials: 'TE', bio: 'Tom drove 40,000 miles across the American South with a tape deck and a notebook. He writes about songcraft the way sportswriters write about pitching: obsessively, lovingly, statistically.' },
  { id: 'sofia-marsh', name: 'Sofia Marsh', role: 'Pop Columnist', beats: ['Pop', 'Hyperpop', 'Dance'], location: 'Los Angeles', joined: 2019, color: '#e9a800', initials: 'SM', bio: 'Sofia believes the three-minute single is the highest art form of the century and will defend that claim in any venue, including weddings. Author of the newsletter \u201CHooked\u201D.' },
  { id: 'deo-kamara', name: 'Deo Kamara', role: 'Global Music Editor', beats: ['Afrobeats', 'Latin', 'Highlife', 'Amapiano'], location: 'Lagos / London', joined: 2018, color: '#0f766e', initials: 'DK', bio: 'Deo covers the sounds moving between Lagos, Accra, Johannesburg, Bogotá and London. He speaks four languages and dances in all of them. His year-end \u201CShoreline\u201D mix is a staff holiday.' },
  { id: 'inge-halvorsen', name: 'Inge Halvorsen', role: 'Jazz & Classical Critic', beats: ['Jazz', 'Classical', 'Avant-garde'], location: 'Oslo', joined: 2013, color: '#4a3aff', initials: 'IH', bio: 'Inge trained as a violist, quit an orchestra, and never looked back except in print. She hears harmony the way sommeliers taste soil. Feared by press officers, beloved by pianists.' },
  { id: 'ruth-calloway', name: 'Ruth Calloway', role: 'Heavy Music Correspondent', beats: ['Punk', 'Metal', 'Hardcore'], location: 'Glasgow', joined: 2020, color: '#141310', initials: 'RC', bio: 'Ruth has been in the pit at 600 shows and remembers every setlist. She writes about heavy music as community infrastructure: who books the hall, who drives the van, who stays to sweep up.' },
  { id: 'eli-navarro', name: 'Eli Navarro', role: 'Staff Writer', beats: ['Indie', 'Latin', 'Bedroom Pop'], location: 'Mexico City', joined: 2021, color: '#c22e00', initials: 'EN', bio: 'Eli covers bedroom scenes across the Spanish-speaking world. He files long, tender reviews and short, devastating news posts. Plays drums badly in a band you will like.' },
  { id: 'hana-sato', name: 'Hana Sato', role: 'Experimental Critic', beats: ['Ambient', 'Noise', 'Sound Art'], location: 'Kyoto', joined: 2019, color: '#6d5bd0', initials: 'HS', bio: 'Hana writes about quiet music at high volume. Her column \u201CLow Frequencies\u201D covers drone, field recording and installation sound. Owns 11 radios and likes all of them.' },
  { id: 'marcus-webb', name: 'Marcus Webb', role: 'Chief Pop Critic', beats: ['R&B', 'Hip-Hop', 'Soul'], location: 'Atlanta', joined: 2012, color: '#8a5a00', initials: 'MW', bio: 'Marcus has reviewed every major R&B record of the last decade and most of the minor ones twice. His rule: never punish a slow jam for being slow, never forgive a ballad for being boring.' },
  { id: 'adaeze-nwosu', name: 'Adaeze Nwosu', role: 'Features Editor', beats: ['Soul', 'Gospel', 'Jazz'], location: 'Chicago', joined: 2016, color: '#7c1d1d', initials: 'AN', bio: 'Adaeze edits the longform desk and writes the profile nobody else could get. She once spent six days on a tour bus for a 4,000-word piece and calls it \u201Cthe short one\u201D.' },
];

export function writerById(id: string): Writer {
  return WRITERS.find((w) => w.id === id) ?? WRITERS[0];
}
