import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../lib/format';

interface AppState {
  saved: string[];
  toggleSave: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  ratings: Record<string, number>;
  rate: (slug: string, v: number) => void;
  votes: Record<string, 'up' | 'down'>;
  vote: (id: string, v: 'up' | 'down') => void;
  newsletter: boolean;
  setNewsletter: (v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useLocalStorage<string[]>('ni-saved', []);
  const [ratings, setRatings] = useLocalStorage<Record<string, number>>('ni-ratings', {});
  const [votes, setVotes] = useLocalStorage<Record<string, 'up' | 'down'>>('ni-votes', {});
  const [newsletter, setN] = useLocalStorage<boolean>('ni-news', false);

  const value = useMemo<AppState>(() => ({
    saved,
    toggleSave: (slug) => setSaved((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug])),
    isSaved: (slug) => saved.includes(slug),
    ratings,
    rate: (slug, v) => setRatings((p) => ({ ...p, [slug]: v })),
    votes,
    vote: (id, v) => setVotes((p) => ({ ...p, [id]: p[id] === v ? undefined as unknown as 'up' : v } as Record<string, 'up' | 'down'>)),
    newsletter,
    setNewsletter: (v: boolean) => setN(v),
  }), [saved, ratings, votes, newsletter, setSaved, setRatings, setVotes, setN]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside provider');
  return v;
}
