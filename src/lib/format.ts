import { useState, useEffect } from 'react';

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function mulberry(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function shortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(iso: string, now: Date = new Date('2026-09-09T12:00:00Z')): string {
  const then = new Date(iso.length === 10 ? iso + 'T12:00:00Z' : iso).getTime();
  const diff = Math.max(0, now.getTime() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* noop */ }
  }, [key, val]);
  const set = (v: T | ((p: T) => T)) => {
    setVal((prev: T) => (typeof v === 'function' ? (v as (p: T) => T)(prev) : v));
  };
  return [val, set];
}

export function scoreColor(score: number): string {
  if (score >= 9.0) return '#7c1d1d';
  if (score >= 8.5) return '#c22e00';
  if (score >= 8.0) return '#ff3d00';
  if (score >= 7.0) return '#3d5a3a';
  if (score >= 6.0) return '#6f6a5e';
  return '#1e1c18';
}

export function scoreLabel(score: number): string {
  if (score >= 9.0) return 'Instant classic';
  if (score >= 8.5) return 'Best New Music';
  if (score >= 8.0) return 'Excellent';
  if (score >= 7.0) return 'Great';
  if (score >= 6.0) return 'Good';
  if (score >= 5.0) return 'Mixed';
  return 'Poor';
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
