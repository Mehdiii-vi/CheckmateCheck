/**
 * CheckmateCheck - Configuration, Tournament-Grade Staunton Chess Piece Vectors & Localization
 */

const CONFIG = {
  API_BASE_URL: (window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:'))
    ? window.location.origin
    : 'http://localhost:5000',
  ANALYZE_ENDPOINT: '/api/analyze',
  HEALTH_ENDPOINT: '/api/health'
};

/**
 * Tournament-Grade Staunton Chess Vectors
 * Styled with realistic gradients, depth shadows, and authentic tournament contours.
 */
const PIECE_SVGS = {
  // --- WHITE PIECES ---
  wK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wKGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
      <filter id="wShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.35" />
      </filter>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M25 84 C38 80, 62 80, 75 84 L76 88 L24 88 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Body & Collar -->
    <path d="M30 76 C32 80, 68 80, 70 76 L73 82 L27 82 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2" />
    <path d="M33 50 C28 65, 27 75, 30 76 C40 78, 60 78, 70 76 C73 75, 72 65, 67 50 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2.5" />
    <!-- Crown -->
    <path d="M33 50 C24 38, 28 26, 50 26 C72 26, 76 38, 67 50 C60 53, 40 53, 33 50 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M36 34 C42 42, 58 42, 64 34" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />
    <!-- Regal Arched Cross -->
    <path d="M47 10 L53 10 L53 16 L59 16 L59 22 L53 22 L53 26 L47 26 L47 22 L41 22 L41 16 L47 16 Z" fill="url(#wKGrad)" stroke="#1E293B" stroke-width="2.2" stroke-linejoin="round" />
    <circle cx="50" cy="18" r="1.8" fill="#F59E0B" />
  </svg>`,

  wQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wQGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="65%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M26 82 C38 78, 62 78, 74 82 L76 86 L24 86 Z" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Waist & Body -->
    <path d="M34 52 C28 66, 28 76, 31 78 C40 80, 60 80, 69 78 C72 76, 72 66, 66 52 Z" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M35 52 C42 55, 58 55, 65 52" fill="none" stroke="#64748B" stroke-width="2" />
    <!-- Flared Coronet -->
    <path d="M23 28 L32 50 C40 52, 60 52, 68 50 L77 28 L64 42 L50 20 L36 42 Z" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />
    <!-- Pearls on Points -->
    <circle cx="23" cy="27" r="3.2" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2" />
    <circle cx="36.5" cy="24" r="3.2" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2" />
    <circle cx="50" cy="19" r="3.5" fill="#F59E0B" stroke="#1E293B" stroke-width="2" />
    <circle cx="63.5" cy="24" r="3.2" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2" />
    <circle cx="77" cy="27" r="3.2" fill="url(#wQGrad)" stroke="#1E293B" stroke-width="2" />
  </svg>`,

  wR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wRGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="65%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#wRGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M26 80 C36 77, 64 77, 74 80 L76 86 L24 86 Z" fill="url(#wRGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Tower Walls -->
    <path d="M31 40 L69 40 L66 78 L34 78 Z" fill="url(#wRGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M31 40 C40 43, 60 43, 69 40 L73 34 L27 34 Z" fill="url(#wRGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Battlements / Crenellations -->
    <path d="M27 34 L27 20 L37 20 L37 26 L45 26 L45 20 L55 20 L55 26 L63 26 L63 20 L73 20 L73 34 Z" fill="url(#wRGrad)" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />
    <!-- Masonry slit -->
    <rect x="47" y="50" width="6" height="14" rx="2" fill="#64748B" />
  </svg>`,

  wB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wBGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="65%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M23 88 C35 84, 65 84, 77 88 L79 92 L21 92 Z" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M28 80 C37 77, 63 77, 72 80 L75 86 L25 86 Z" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Collar & Stem -->
    <path d="M35 56 C33 66, 32 74, 34 76 C42 78, 58 78, 66 76 C68 74, 67 66, 65 56 Z" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2.2" />
    <path d="M33 56 C40 59, 60 59, 67 56 L69 61 L31 61 Z" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Mitre Hat -->
    <path d="M33 56 C26 42, 33 26, 50 22 C67 26, 74 42, 67 56 C60 60, 40 60, 33 56 Z" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2.5" />
    <!-- Diagonal Cleft (Cut) -->
    <path d="M46 26 L62 42" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="50" cy="18" r="3.5" fill="url(#wBGrad)" stroke="#1E293B" stroke-width="2" />
  </svg>`,

  wN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wNGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#wNGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M25 80 C36 77, 64 77, 75 80 L77 86 L23 86 Z" fill="url(#wNGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Classic Tournament Staunton Horse Silhouette -->
    <path d="M32 80 C30 68, 23 57, 24 45 C25 38, 31 35, 36 38 C37 32, 42 22, 49 14 L53 10 L56 20 C62 17, 67 21, 64 28 C70 28, 74 34, 69 42 C74 44, 77 52, 72 60 C74 68, 75 74, 72 80 Z" fill="url(#wNGrad)" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round" />
    <!-- Muzzle / Mouth Slit -->
    <path d="M24 45 C27 49, 34 51, 41 46" fill="none" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round" />
    <!-- Nostril -->
    <ellipse cx="28" cy="41" rx="2" ry="1.5" fill="#1E293B" />
    <!-- Expressive Eye with Brow -->
    <path d="M41 27 C44 25, 48 26, 50 29" fill="none" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="45" cy="30" r="3" fill="#1E293B" />
    <circle cx="46" cy="29" r="1.1" fill="#FFFFFF" />
    <!-- Cheekbone & Jaw Contour -->
    <path d="M36 53 C44 57, 52 53, 56 44" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />
    <!-- Mane Notches -->
    <path d="M54 22 C58 26, 61 31, 63 36" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />
    <path d="M60 38 C64 43, 66 49, 67 55" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />
  </svg>`,

  wP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="wPGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="65%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M26 88 C36 84, 64 84, 74 88 L76 92 L24 92 Z" fill="url(#wPGrad)" stroke="#1E293B" stroke-width="2.5" />
    <path d="M30 80 C38 77, 62 77, 70 80 L72 86 L28 86 Z" fill="url(#wPGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Body -->
    <path d="M38 56 C34 66, 33 74, 35 77 C42 79, 58 79, 65 77 C67 74, 66 66, 62 56 Z" fill="url(#wPGrad)" stroke="#1E293B" stroke-width="2.4" />
    <!-- Collar Ring -->
    <path d="M36 53 C42 56, 58 56, 64 53 L66 57 L34 57 Z" fill="url(#wPGrad)" stroke="#1E293B" stroke-width="2" />
    <!-- Spherical Head -->
    <circle cx="50" cy="34" r="16" fill="url(#wPGrad)" stroke="#1E293B" stroke-width="2.5" />
    <ellipse cx="45" cy="28" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />
  </svg>`,

  // --- BLACK PIECES (Tournament Ebony & Obsidian) ---
  bK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bKGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M25 84 C38 80, 62 80, 75 84 L76 88 L24 88 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Body & Collar -->
    <path d="M30 76 C32 80, 68 80, 70 76 L73 82 L27 82 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <path d="M33 50 C28 65, 27 75, 30 76 C40 78, 60 78, 70 76 C73 75, 72 65, 67 50 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <!-- Crown -->
    <path d="M33 50 C24 38, 28 26, 50 26 C72 26, 76 38, 67 50 C60 53, 40 53, 33 50 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M36 34 C42 42, 58 42, 64 34" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <!-- Cross -->
    <path d="M47 10 L53 10 L53 16 L59 16 L59 22 L53 22 L53 26 L47 26 L47 22 L41 22 L41 16 L47 16 Z" fill="url(#bKGrad)" stroke="#CBD5E1" stroke-width="2" stroke-linejoin="round" />
    <circle cx="50" cy="18" r="1.8" fill="#F59E0B" />
  </svg>`,

  bQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bQGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M26 82 C38 78, 62 78, 74 82 L76 86 L24 86 Z" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Body -->
    <path d="M34 52 C28 66, 28 76, 31 78 C40 80, 60 80, 69 78 C72 76, 72 66, 66 52 Z" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <!-- Flared Coronet -->
    <path d="M23 28 L32 50 C40 52, 60 52, 68 50 L77 28 L64 42 L50 20 L36 42 Z" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="2.2" stroke-linejoin="round" />
    <!-- Pearls on Points -->
    <circle cx="23" cy="27" r="3.2" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <circle cx="36.5" cy="24" r="3.2" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <circle cx="50" cy="19" r="3.5" fill="#F59E0B" stroke="#CBD5E1" stroke-width="1.8" />
    <circle cx="63.5" cy="24" r="3.2" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <circle cx="77" cy="27" r="3.2" fill="url(#bQGrad)" stroke="#CBD5E1" stroke-width="1.8" />
  </svg>`,

  bR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bRGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#bRGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M26 80 C36 77, 64 77, 74 80 L76 86 L24 86 Z" fill="url(#bRGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Tower Walls -->
    <path d="M31 40 L69 40 L66 78 L34 78 Z" fill="url(#bRGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M31 40 C40 43, 60 43, 69 40 L73 34 L27 34 Z" fill="url(#bRGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Battlements -->
    <path d="M27 34 L27 20 L37 20 L37 26 L45 26 L45 20 L55 20 L55 26 L63 26 L63 20 L73 20 L73 34 Z" fill="url(#bRGrad)" stroke="#CBD5E1" stroke-width="2.2" stroke-linejoin="round" />
    <rect x="47" y="50" width="6" height="14" rx="2" fill="#94A3B8" />
  </svg>`,

  bB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bBGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M23 88 C35 84, 65 84, 77 88 L79 92 L21 92 Z" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M28 80 C37 77, 63 77, 72 80 L75 86 L25 86 Z" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Body -->
    <path d="M35 56 C33 66, 32 74, 34 76 C42 78, 58 78, 66 76 C68 74, 67 66, 65 56 Z" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M33 56 C40 59, 60 59, 67 56 L69 61 L31 61 Z" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Mitre Hat -->
    <path d="M33 56 C26 42, 33 26, 50 22 C67 26, 74 42, 67 56 C60 60, 40 60, 33 56 Z" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <!-- Cleft -->
    <path d="M46 26 L62 42" stroke="#CBD5E1" stroke-width="2.2" stroke-linecap="round" />
    <circle cx="50" cy="18" r="3.5" fill="url(#bBGrad)" stroke="#CBD5E1" stroke-width="1.8" />
  </svg>`,

  bN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bNGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M22 88 C35 84, 65 84, 78 88 L80 92 L20 92 Z" fill="url(#bNGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M25 80 C36 77, 64 77, 75 80 L77 86 L23 86 Z" fill="url(#bNGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Classic Tournament Staunton Horse Silhouette -->
    <path d="M32 80 C30 68, 23 57, 24 45 C25 38, 31 35, 36 38 C37 32, 42 22, 49 14 L53 10 L56 20 C62 17, 67 21, 64 28 C70 28, 74 34, 69 42 C74 44, 77 52, 72 60 C74 68, 75 74, 72 80 Z" fill="url(#bNGrad)" stroke="#CBD5E1" stroke-width="2.2" stroke-linejoin="round" />
    <!-- Muzzle / Mouth Slit -->
    <path d="M24 45 C27 49, 34 51, 41 46" fill="none" stroke="#CBD5E1" stroke-width="1.8" stroke-linecap="round" />
    <!-- Nostril -->
    <ellipse cx="28" cy="41" rx="2" ry="1.5" fill="#CBD5E1" />
    <!-- Expressive Eye with Brow -->
    <path d="M41 27 C44 25, 48 26, 50 29" fill="none" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round" />
    <circle cx="45" cy="30" r="3" fill="#CBD5E1" />
    <circle cx="46" cy="29" r="1.1" fill="#0F172A" />
    <!-- Cheekbone & Jaw Contour -->
    <path d="M36 53 C44 57, 52 53, 56 44" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <!-- Mane Notches -->
    <path d="M54 22 C58 26, 61 31, 63 36" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
    <path d="M60 38 C64 43, 66 49, 67 55" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" />
  </svg>`,

  bP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="chess-piece">
    <defs>
      <linearGradient id="bPGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
    </defs>
    <!-- Base -->
    <path d="M26 88 C36 84, 64 84, 74 88 L76 92 L24 92 Z" fill="url(#bPGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M30 80 C38 77, 62 77, 70 80 L72 86 L28 86 Z" fill="url(#bPGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Body -->
    <path d="M38 56 C34 66, 33 74, 35 77 C42 79, 58 79, 65 77 C67 74, 66 66, 62 56 Z" fill="url(#bPGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <path d="M36 53 C42 56, 58 56, 64 53 L66 57 L34 57 Z" fill="url(#bPGrad)" stroke="#CBD5E1" stroke-width="1.8" />
    <!-- Head -->
    <circle cx="50" cy="34" r="16" fill="url(#bPGrad)" stroke="#CBD5E1" stroke-width="2.2" />
    <ellipse cx="45" cy="28" rx="4" ry="2" fill="#FFFFFF" opacity="0.25" />
  </svg>`
};

const I18N = {
  fa: {
    appTitle: "CheckmateCheck | موتور تشخیص کیش و مات",
    appSubtitle: "اعتبارسنجی صفحه و تشخیص هوشمند وضعیت شاه، کیش، مات و پات بدون نیاز به نوبت",
    analyzeBtn: "بررسی وضعیت صفحه (Analyze)",
    clearBoardBtn: "صفحه خالی (Clear)",
    trashBtn: "حذف مهره",
    boardStatusTitle: "وضعیت صفحه",
    whiteKingStatus: "وضعیت شاه سفید",
    blackKingStatus: "وضعیت شاه سیاه",
    threatVectorsTitle: "بردارهای حمله و تهدید",
    evasionTitle: "راه‌های دفع کیش و گریز",
    algorithmTitle: "مراحل اجرای الگوریتم",
    safe: "امن",
    check: "کیش",
    checkmate: "کیش و مات",
    stalemate: "پات",
    invalid: "نامعتبر",
    valid: "معتبر",
    dragHint: "صفحه در ابتدا خالی است. مهره‌ها را از پالت انتخاب کرده و روی صفحه قرار دهید، یا مهره‌های چیده شده را با درگ جابه‌جا کنید.",
    emptyBoardWarning: "صفحه در حال حاضر خالی است! لطفاً حداقل شاه سفید و شاه سیاه را روی صفحه قرار دهید."
  },
  en: {
    appTitle: "CheckmateCheck | Chess State Analyzer",
    appSubtitle: "Turn-Agnostic Chess Validation, Check, Checkmate & Stalemate Engine",
    analyzeBtn: "Analyze Board",
    clearBoardBtn: "Clear Board",
    trashBtn: "Trash Tool",
    boardStatusTitle: "Board Status",
    whiteKingStatus: "White King Status",
    blackKingStatus: "Black King Status",
    threatVectorsTitle: "Threat Vectors & Rays",
    evasionTitle: "Evasions & Defenses",
    algorithmTitle: "Algorithm Pipeline",
    safe: "Safe",
    check: "Check",
    checkmate: "Checkmate",
    stalemate: "Stalemate",
    invalid: "Invalid",
    valid: "Valid",
    dragHint: "The board is empty initially. Drag or click pieces to place or reposition them on the board.",
    emptyBoardWarning: "The board is currently empty! Please place at least the White King and Black King."
  }
};
