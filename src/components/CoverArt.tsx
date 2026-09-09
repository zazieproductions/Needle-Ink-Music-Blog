import { memo } from 'react';

interface Props {
  hue: number;
  pattern: number;
  artist: string;
  album: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

function CoverArt({ hue, pattern, artist, album, className = '', showText = true }: Props) {
  const h = ((hue % 360) + 360) % 360;
  const h2 = (h + 45) % 360;
  const h3 = (h + 180) % 360;
  const ink = `hsl(${h}, 45%, 12%)`;
  const deep = `hsl(${h}, 55%, 22%)`;
  const vivid = `hsl(${h2}, 85%, 55%)`;
  const soft = `hsl(${h}, 60%, 82%)`;
  const paper = `hsl(${h}, 30%, 90%)`;
  const accent = `hsl(${h3}, 80%, 55%)`;
  const p = ((pattern % 8) + 8) % 8;
  const initials = artist.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: ink }}>
      {p === 0 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={deep} />
          {[88, 74, 60, 47, 35, 24, 14].map((r, i) => (
            <circle key={r} cx="100" cy="105" r={r} fill="none" stroke={i % 2 ? vivid : soft} strokeWidth={i % 2 ? 5 : 2.5} opacity={0.9} />
          ))}
          <circle cx="100" cy="105" r="9" fill={accent} />
          <rect y="0" width="200" height="34" fill={ink} />
          <text x="100" y="22" textAnchor="middle" fill={paper} fontSize="11" fontFamily="Space Mono, monospace" letterSpacing="3">{artist.slice(0, 22).toUpperCase()}</text>
        </svg>
      )}
      {p === 1 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={paper} />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={-40 + i * 20} y="-20" width={i % 3 === 0 ? 12 : 6} height="260" fill={i % 3 === 0 ? ink : i % 2 ? vivid : accent} transform="rotate(24 100 100)" opacity={0.92} />
          ))}
          <rect x="14" y="128" width="172" height="58" fill={ink} />
          <text x="22" y="151" fill={paper} fontSize="13" fontWeight="900" fontFamily="Archivo, sans-serif">{album.slice(0, 20)}</text>
          <text x="22" y="168" fill={vivid} fontSize="9" fontFamily="Space Mono, monospace" letterSpacing="2">{artist.slice(0, 26).toUpperCase()}</text>
        </svg>
      )}
      {p === 2 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={vivid} />
          {Array.from({ length: 11 }).map((_, r) =>
            Array.from({ length: 11 }).map((_, c) => {
              const rr = 1 + ((r * 7 + c * 5 + h) % 7);
              return <circle key={`${r}-${c}`} cx={12 + c * 17.5} cy={12 + r * 17.5} r={rr} fill={ink} opacity={0.85} />;
            })
          )}
          <circle cx="100" cy="96" r="46" fill={paper} />
          <circle cx="100" cy="96" r="46" fill="none" stroke={ink} strokeWidth="3" />
          <text x="100" y="90" textAnchor="middle" fill={ink} fontSize="26" fontWeight="900" fontFamily="Fraunces, serif">{initials}</text>
          <text x="100" y="108" textAnchor="middle" fill={ink} fontSize="8" fontFamily="Space Mono, monospace" letterSpacing="2">{album.slice(0, 18).toUpperCase()}</text>
        </svg>
      )}
      {p === 3 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={paper} />
          <rect x="0" y="0" width="120" height="120" fill={ink} />
          <circle cx="60" cy="60" r="34" fill={vivid} />
          <rect x="60" y="60" width="60" height="60" fill={accent} />
          <rect x="120" y="0" width="80" height="200" fill={deep} />
          <text x="132" y="80" fill={paper} fontSize="12" fontWeight="800" fontFamily="Archivo, sans-serif" transform="rotate(90 132 80)" letterSpacing="4">{artist.slice(0, 16).toUpperCase()}</text>
          <rect x="0" y="150" width="120" height="50" fill={vivid} />
          <text x="10" y="172" fill={ink} fontSize="12" fontWeight="900" fontFamily="Archivo, sans-serif">{album.slice(0, 16)}</text>
          <text x="10" y="187" fill={ink} fontSize="8" fontFamily="Space Mono, monospace">{`N&I-${String(h % 100).padStart(2, '0')}`}</text>
        </svg>
      )}
      {p === 4 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={ink} />
          {[150, 128, 106, 84, 62, 42].map((r, i) => (
            <path key={r} d={`M ${100 - r} 190 A ${r} ${r} 0 0 1 ${100 + r} 190`} fill="none" stroke={[vivid, accent, soft, vivid, accent, soft][i]} strokeWidth="9" opacity="0.95" />
          ))}
          <rect y="150" width="200" height="50" fill={ink} />
          <text x="100" y="172" textAnchor="middle" fill={paper} fontSize="13" fontWeight="900" fontFamily="Fraunces, serif" fontStyle="italic">{album.slice(0, 22)}</text>
          <text x="100" y="187" textAnchor="middle" fill={vivid} fontSize="8" fontFamily="Space Mono, monospace" letterSpacing="3">{artist.slice(0, 24).toUpperCase()}</text>
        </svg>
      )}
      {p === 5 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={deep} />
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d={`M -10 ${14 + i * 12} Q 50 ${6 + i * 12} 100 ${14 + i * 12} T 210 ${14 + i * 12}`} fill="none" stroke={i % 2 ? soft : vivid} strokeWidth={i % 4 === 0 ? 3.5 : 1.6} opacity={i % 4 === 0 ? 1 : 0.6} />
          ))}
          <rect x="14" y="14" width="120" height="52" fill={paper} />
          <text x="22" y="36" fill={ink} fontSize="12" fontWeight="900" fontFamily="Archivo, sans-serif">{artist.slice(0, 16)}</text>
          <text x="22" y="52" fill={ink} fontSize="10" fontStyle="italic" fontFamily="Fraunces, serif">{album.slice(0, 18)}</text>
        </svg>
      )}
      {p === 6 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`gg${h}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={vivid} />
              <stop offset="1" stopColor={accent} />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#gg${h})`} />
          <text x="100" y="148" textAnchor="middle" fill={ink} fontSize="150" fontWeight="900" fontFamily="Fraunces, serif" opacity="0.9">{album[0]?.toUpperCase()}</text>
          <rect y="0" width="200" height="30" fill={ink} />
          <text x="12" y="20" fill={paper} fontSize="10" fontFamily="Space Mono, monospace" letterSpacing="2">{artist.slice(0, 24).toUpperCase()}</text>
          <rect y="170" width="200" height="30" fill={ink} />
          <text x="12" y="190" fill={soft} fontSize="10" fontFamily="Space Mono, monospace" letterSpacing="2">{album.slice(0, 26).toUpperCase()}</text>
        </svg>
      )}
      {p === 7 && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill={paper} />
          <rect width="200" height="96" fill={ink} />
          <circle cx={30 + (h % 140)} cy="48" r="30" fill={vivid} />
          <rect x={30 + (h % 140) - 30} y="44" width="60" height="8" fill={ink} />
          <text x="12" y="140" fill={ink} fontSize="20" fontWeight="900" fontFamily="Fraunces, serif">{album.split(' ').slice(0, 2).join(' ')}</text>
          <text x="12" y="158" fill={ink} fontSize="11" fontFamily="Fraunces, serif" fontStyle="italic" opacity="0.8">{album.split(' ').slice(2, 5).join(' ')}</text>
          <text x="12" y="182" fill={accent} fontSize="9" fontWeight="700" fontFamily="Space Mono, monospace" letterSpacing="2">{artist.slice(0, 28).toUpperCase()}</text>
        </svg>
      )}
      <div className="vinyl-sheen pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/40 ring-inset" />
      {showText && (
        <div className="absolute right-1.5 bottom-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono2 text-[9px] tracking-widest text-white/90">
          {String(h % 89 + 10)} RPM
        </div>
      )}
    </div>
  );
}

export default memo(CoverArt);
