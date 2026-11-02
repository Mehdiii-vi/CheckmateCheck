/**
 * CheckmateCheck - Interactive Chessboard & Evaluation Engine
 * Supports:
 * - Interactive piece placement, drag & drop, erase
 * - Calling Python Backend API (/api/evaluate)
 * - Standalone client-side fallback evaluation
 * - Highlights for check, attackers, and legal moves
 */

// Standard Chess Piece SVG Vectors
const PIECE_SVGS = {
  wK: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v--.5C19 16 9.5 13 5.5 19.5c-3 6 5 10 5 10l1 7.5" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
  wQ: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 17.5-1 21 0m-20.5 4c3.5-1 16.5-1 20 0"/></g></svg>`,
  wR: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5c0-4 1-5.5 2-8h13c1 2.5 2 4 2 8H14zM12 19h21v4.5H12V19zm-3-8.5h4v4h3v-4h6v4h3v-4h6v4h3v-4h4v8.5H9v-8.5z" stroke-linecap="butt"/><path d="M11 14h23M11 9h23M14 28h17"/></g></svg>`,
  wB: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter"/></g></svg>`,
  wN: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.42-1 1-2 .5-2 1-3 1s-1.5-1.5-.5-2c1.5-1 3.2-1.5 4-4.5 1-3 .5-6 .5-6-1.5 0-3.5 1-4.5 1.5-1.5 1-2.5 3-2.5 3-.5 0-.5-1-.5-1.5 1-1.5 2.5-3.5 4.5-4.5 2-1 5.5-1 7.5-1 1.5-.5 3-1.5 4-2.5 1-1 2-1.5 3-1.5 1 0 1.5.5 2 1.5.5 1 0 2-1 3.5-1 1.5-2.5 2-2.5 3.5z" fill="#fff"/><circle cx="15.5" cy="15.5" r="1.5" fill="#000"/></g></svg>`,
  wP: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  bK: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1e293b" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v--.5C19 16 9.5 13 5.5 19.5c-3 6 5 10 5 10l1 7.5" fill="#1e293b"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>`,
  bQ: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 3.5c3.5-1 17.5-1 21 0m-20.5 4c3.5-1 16.5-1 20 0" stroke="#fff"/></g></svg>`,
  bR: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5c0-4 1-5.5 2-8h13c1 2.5 2 4 2 8H14zM12 19h21v4.5H12V19zm-3-8.5h4v4h3v-4h6v4h3v-4h6v4h3v-4h4v8.5H9v-8.5z" stroke-linecap="butt"/><path d="M11 14h23M11 9h23M14 28h17" stroke="#fff"/></g></svg>`,
  bB: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e293b" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter"/></g></svg>`,
  bN: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1e293b"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.42-1 1-2 .5-2 1-3 1s-1.5-1.5-.5-2c1.5-1 3.2-1.5 4-4.5 1-3 .5-6 .5-6-1.5 0-3.5 1-4.5 1.5-1.5 1-2.5 3-2.5 3-.5 0-.5-1-.5-1.5 1-1.5 2.5-3.5 4.5-4.5 2-1 5.5-1 7.5-1 1.5-.5 3-1.5 4-2.5 1-1 2-1.5 3-1.5 1 0 1.5.5 2 1.5.5 1 0 2-1 3.5-1 1.5-2.5 2-2.5 3.5z" fill="#1e293b"/><circle cx="15.5" cy="15.5" r="1.5" fill="#fff"/></g></svg>`,
  bP: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1e293b" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

// Preset Positions
const PRESETS = {
  foolsMate: {
    name: "مات مبتدیان (Fool's Mate)",
    fen: "rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
    turn: "w"
  },
  scholarsMate: {
    name: "مات ناپلئونی (Scholar's Mate)",
    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
    turn: "b"
  },
  smotheredMate: {
    name: "مات خفه‌کننده با اسب (Smothered Mate)",
    fen: "6rk/5Npp/8/8/8/8/8/7K b - - 0 1",
    turn: "b"
  },
  backRankMate: {
    name: "مات عرض آخر (Back-Rank Mate)",
    fen: "3R2k1/5ppp/8/8/8/8/8/6K1 b - - 1 1",
    turn: "b"
  },
  queenStalemate: {
    name: "پات کلاسیک وزیر (Corner Queen Stalemate)",
    fen: "k7/2Q5/1K6/8/8/8/8/8 b - - 0 1",
    turn: "b"
  },
  pawnLockStalemate: {
    name: "پات شاه و پیاده (Pawn Lock Stalemate)",
    fen: "k7/P7/K7/8/8/8/8/8 b - - 0 1",
    turn: "b"
  },
  checkEscape: {
    name: "کیش با راه فرار (Check with Escape)",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/5P1q/8/PPPPP1PP/RNBQKBNR w KQkq - 1 3",
    turn: "w"
  },
  initial: {
    name: "چینش اولیه استاندارد",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    turn: "w"
  }
};

// State
let boardState = Array(8).fill(null).map(() => Array(8).fill(null));
let activeTurn = 'w';
let selectedPalettePiece = null;
let activeTool = 'pointer'; // 'pointer' or 'erase'
let isBoardFlipped = false;
let draggedPiece = null; // { fromR, fromC, pieceCode }
let selectedSquare = null; // { r, c }
let currentAnalysis = null;

// Coordinates helper
function coordsToSquare(r, c) {
  const file = String.fromCharCode('a'.charCodeAt(0) + c);
  const rank = 8 - r;
  return `${file}${rank}`;
}

function squareToCoords(sq) {
  const file = sq.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(sq[1], 10);
  return { r: rank, c: file };
}

// FEN Parsing & Generating
function loadFen(fen) {
  const cleanFen = fen.trim();
  const parts = cleanFen.split(/\s+/);
  if (!parts[0]) return;

  const newGrid = Array(8).fill(null).map(() => Array(8).fill(null));
  const rows = parts[0].split('/');

  for (let r = 0; r < 8 && r < rows.length; r++) {
    let c = 0;
    for (let char of rows[r]) {
      if (c >= 8) break;
      if (/\d/.test(char)) {
        c += parseInt(char, 10);
      } else {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toUpperCase();
        newGrid[r][c] = `${color}${type}`;
        c++;
      }
    }
  }

  boardState = newGrid;
  if (parts.length > 1 && (parts[1] === 'w' || parts[1] === 'b')) {
    activeTurn = parts[1];
  }
  updateTurnUI();
  renderBoard();
  triggerEvaluate();
}

function generateFen() {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    let emptyCount = 0;
    let rowStr = '';
    for (let c = 0; c < 8; c++) {
      const piece = boardState[r][c];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        const color = piece[0];
        const type = piece[1];
        rowStr += color === 'w' ? type.toUpperCase() : type.toLowerCase();
      }
    }
    if (emptyCount > 0) {
      rowStr += emptyCount;
    }
    rows.push(rowStr);
  }
  return `${rows.join('/')} ${activeTurn} - - 0 1`;
}

// Client-side Algorithm Fallback (Mirrors Python Engine)
function evaluateClientSide(grid, turn) {
  const opp = turn === 'w' ? 'b' : 'w';
  
  // 1. King check
  let wkCount = 0, bkCount = 0;
  let wkPos = null, bkPos = null;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = grid[r][c];
      if (p === 'wK') { wkCount++; wkPos = [r, c]; }
      if (p === 'bK') { bkCount++; bkPos = [r, c]; }
      if (p && p[1] === 'P' && (r === 0 || r === 7)) {
        return {
          status: "INVALID",
          status_fa: "صفحه نامعتبر",
          status_color: "danger",
          explanation_fa: `پیاده نمی‌تواند در ردیف اول یا آخر (${coordsToSquare(r, c)}) باشد.`,
          explanation_en: `Pawn cannot be on the 1st or 8th rank (${coordsToSquare(r, c)}).`,
          in_check: false,
          checking_pieces: [],
          legal_moves_count: 0,
          legal_moves: []
        };
      }
    }
  }

  if (wkCount !== 1) {
    return {
      status: "INVALID", status_fa: "صفحه نامعتبر", status_color: "danger",
      explanation_fa: `تعداد شاه سفید باید ۱ باشد (تعداد کنونی: ${wkCount}).`,
      in_check: false, checking_pieces: [], legal_moves_count: 0, legal_moves: []
    };
  }
  if (bkCount !== 1) {
    return {
      status: "INVALID", status_fa: "صفحه نامعتبر", status_color: "danger",
      explanation_fa: `تعداد شاه سیاه باید ۱ باشد (تعداد کنونی: ${bkCount}).`,
      in_check: false, checking_pieces: [], legal_moves_count: 0, legal_moves: []
    };
  }

  // Adjacent kings
  if (Math.abs(wkPos[0] - bkPos[0]) <= 1 && Math.abs(wkPos[1] - bkPos[1]) <= 1) {
    return {
      status: "INVALID", status_fa: "صفحه نامعتبر", status_color: "danger",
      explanation_fa: "دو شاه نمی‌توانند در خانه‌های مجاور یکدیگر باشند.",
      in_check: false, checking_pieces: [], legal_moves_count: 0, legal_moves: []
    };
  }

  // Attack checks
  function isAttacked(targetR, targetC, byColor) {
    const attackers = [];
    const pRow = byColor === 'w' ? targetR + 1 : targetR - 1;
    for (let dc of [-1, 1]) {
      const pCol = targetC + dc;
      if (pRow >= 0 && pRow < 8 && pCol >= 0 && pCol < 8) {
        if (grid[pRow][pCol] === `${byColor}P`) attackers.push([pRow, pCol]);
      }
    }
    const nOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (let [dr, dc] of nOffsets) {
      const nr = targetR + dr, nc = targetC + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (grid[nr][nc] === `${byColor}N`) attackers.push([nr, nc]);
      }
    }
    const kOffsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (let [dr, dc] of kOffsets) {
      const nr = targetR + dr, nc = targetC + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (grid[nr][nc] === `${byColor}K`) attackers.push([nr, nc]);
      }
    }
    const rDirs = [[-1,0],[1,0],[0,-1],[0,1]];
    for (let [dr, dc] of rDirs) {
      let cr = targetR + dr, cc = targetC + dc;
      while (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
        const p = grid[cr][cc];
        if (p) {
          if (p[0] === byColor && (p[1] === 'R' || p[1] === 'Q')) attackers.push([cr, cc]);
          break;
        }
        cr += dr; cc += dc;
      }
    }
    const bDirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (let [dr, dc] of bDirs) {
      let cr = targetR + dr, cc = targetC + dc;
      while (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
        const p = grid[cr][cc];
        if (p) {
          if (p[0] === byColor && (p[1] === 'B' || p[1] === 'Q')) attackers.push([cr, cc]);
          break;
        }
        cr += dr; cc += dc;
      }
    }
    return attackers;
  }

  // Opponent king cannot already be in check
  const oppKingPos = opp === 'w' ? wkPos : bkPos;
  if (isAttacked(oppKingPos[0], oppKingPos[1], turn).length > 0) {
    const oppName = opp === 'w' ? 'سفید' : 'سیاه';
    return {
      status: "INVALID", status_fa: "صفحه نامعتبر", status_color: "danger",
      explanation_fa: `شاه بازیکن غیرنوبت (${oppName}) در کیش است؛ این وضعیت در شطرنج غیرممکن است.`,
      in_check: false, checking_pieces: [], legal_moves_count: 0, legal_moves: []
    };
  }

  const curKingPos = turn === 'w' ? wkPos : bkPos;
  const checkingPiecesCoords = isAttacked(curKingPos[0], curKingPos[1], opp);
  const inCheck = checkingPiecesCoords.length > 0;
  const checkingPieces = checkingPiecesCoords.map(([r, c]) => ({
    coords: [r, c],
    square: coordsToSquare(r, c),
    piece: grid[r][c]
  }));

  // Generate legal moves
  const legalMoves = [];
  function cloneBoard(b) { return b.map(row => [...row]); }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = grid[r][c];
      if (!p || p[0] !== turn) continue;
      const type = p[1];
      const pseudo = [];

      if (type === 'P') {
        const fwd = turn === 'w' ? -1 : 1;
        const startR = turn === 'w' ? 6 : 1;
        const nr = r + fwd;
        if (nr >= 0 && nr < 8 && !grid[nr][c]) {
          pseudo.push([r, c, nr, c]);
          const nr2 = r + 2 * fwd;
          if (r === startR && !grid[nr2][c]) pseudo.push([r, c, nr2, c]);
        }
        for (let dc of [-1, 1]) {
          const capC = c + dc;
          if (nr >= 0 && nr < 8 && capC >= 0 && capC < 8) {
            const tp = grid[nr][capC];
            if (tp && tp[0] === opp) pseudo.push([r, c, nr, capC]);
          }
        }
      } else if (type === 'N') {
        const nOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        for (let [dr, dc] of nOffsets) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const tp = grid[nr][nc];
            if (!tp || tp[0] === opp) pseudo.push([r, c, nr, nc]);
          }
        }
      } else if (type === 'K') {
        const kOffsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        for (let [dr, dc] of kOffsets) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const tp = grid[nr][nc];
            if (!tp || tp[0] === opp) pseudo.push([r, c, nr, nc]);
          }
        }
      } else if (type === 'R' || type === 'B' || type === 'Q') {
        const dirs = [];
        if (type === 'R' || type === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
        if (type === 'B' || type === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
        for (let [dr, dc] of dirs) {
          let cr = r + dr, cc = c + dc;
          while (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
            const tp = grid[cr][cc];
            if (!tp) {
              pseudo.push([r, c, cr, cc]);
            } else {
              if (tp[0] === opp) pseudo.push([r, c, cr, cc]);
              break;
            }
            cr += dr; cc += dc;
          }
        }
      }

      // Filter legal: King must not be in check after move
      for (let [fr, fc, tr, tc] of pseudo) {
        const nb = cloneBoard(grid);
        nb[tr][tc] = nb[fr][fc];
        nb[fr][fc] = null;
        const kingCoord = nb[tr][tc] === `${turn}K` ? [tr, tc] : curKingPos;
        // Check if king is safe
        let kingSafe = true;
        // Simple attack check on new board
        const pRow = opp === 'w' ? kingCoord[0] + 1 : kingCoord[0] - 1;
        for (let dc of [-1, 1]) {
          const pCol = kingCoord[1] + dc;
          if (pRow >= 0 && pRow < 8 && pCol >= 0 && pCol < 8 && nb[pRow][pCol] === `${opp}P`) kingSafe = false;
        }
        if (kingSafe) {
          const nOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
          for (let [dr, dc] of nOffsets) {
            const nr = kingCoord[0] + dr, nc = kingCoord[1] + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && nb[nr][nc] === `${opp}N`) { kingSafe = false; break; }
          }
        }
        if (kingSafe) {
          const kOffsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
          for (let [dr, dc] of kOffsets) {
            const nr = kingCoord[0] + dr, nc = kingCoord[1] + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && nb[nr][nc] === `${opp}K`) { kingSafe = false; break; }
          }
        }
        if (kingSafe) {
          const rDirs = [[-1,0],[1,0],[0,-1],[0,1]];
          for (let [dr, dc] of rDirs) {
            let cr = kingCoord[0] + dr, cc = kingCoord[1] + dc;
            while (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
              const tp = nb[cr][cc];
              if (tp) {
                if (tp[0] === opp && (tp[1] === 'R' || tp[1] === 'Q')) kingSafe = false;
                break;
              }
              cr += dr; cc += dc;
            }
            if (!kingSafe) break;
          }
        }
        if (kingSafe) {
          const bDirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
          for (let [dr, dc] of bDirs) {
            let cr = kingCoord[0] + dr, cc = kingCoord[1] + dc;
            while (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
              const tp = nb[cr][cc];
              if (tp) {
                if (tp[0] === opp && (tp[1] === 'B' || tp[1] === 'Q')) kingSafe = false;
                break;
              }
              cr += dr; cc += dc;
            }
            if (!kingSafe) break;
          }
        }

        if (kingSafe) {
          legalMoves.push({
            from: coordsToSquare(fr, fc),
            to: coordsToSquare(tr, tc),
            from_coords: [fr, fc],
            to_coords: [tr, tc],
            uci: `${coordsToSquare(fr, fc)}${coordsToSquare(tr, tc)}`
          });
        }
      }
    }
  }

  const pNameFa = turn === 'w' ? 'سفید' : 'سیاه';
  const kSq = coordsToSquare(curKingPos[0], curKingPos[1]);
  let status, status_fa, status_color, exp_fa;

  if (legalMoves.length === 0) {
    if (inCheck) {
      status = "CHECKMATE";
      status_fa = "کیش و مات";
      status_color = "danger";
      const checkSrc = checkingPieces.map(c => c.square).join(', ');
      exp_fa = `شاه ${pNameFa} در خانه ${kSq} توسط مهره (${checkSrc}) در کیش است و هیچ حرکت قانونی برای رفع کیش ندارد. ${pNameFa} مات شده است!`;
    } else {
      status = "STALEMATE";
      status_fa = "پات (مساوی)";
      status_color = "warning";
      exp_fa = `شاه ${pNameFa} در کیش نیست، اما هیچ حرکت قانونی برای بازیکن ${pNameFa} روی صفحه باقی نمانده است. بازی پات (مساوی) است.`;
    }
  } else {
    if (inCheck) {
      status = "CHECK";
      status_fa = "کیش";
      status_color = "warning";
      const checkSrc = checkingPieces.map(c => c.square).join(', ');
      exp_fa = `شاه ${pNameFa} در خانه ${kSq} از طرف (${checkSrc}) کیش شده است. بازیکن ${legalMoves.length} حرکت قانونی برای خروج از کیش دارد.`;
    } else {
      status = "NORMAL";
      status_fa = "وضعیت عادی";
      status_color = "success";
      exp_fa = `شاه ${pNameFa} در امنیت است. بازیکن ${pNameFa} دارای ${legalMoves.length} حرکت قانونی در دسترس است.`;
    }
  }

  return {
    status,
    status_fa,
    status_color,
    active_turn: turn,
    in_check: inCheck,
    king_square: kSq,
    king_coords: curKingPos,
    checking_pieces: checkingPieces,
    legal_moves_count: legalMoves.length,
    legal_moves: legalMoves,
    explanation_fa: exp_fa
  };
}

// Trigger Evaluation (Server API first, fallback to Client-side)
let evaluateDebounceTimer = null;
async function triggerEvaluate() {
  clearTimeout(evaluateDebounceTimer);
  evaluateDebounceTimer = setTimeout(async () => {
    const payload = {
      grid: boardState,
      active_turn: activeTurn,
      fen: generateFen()
    };

    document.getElementById('fenInput').value = payload.fen;

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      currentAnalysis = data;
      document.getElementById('engineStatusText').textContent = 'موتور پایتون فعال';
      updateAnalysisUI(data);
    } catch (err) {
      // Fallback to client-side evaluation
      const clientData = evaluateClientSide(boardState, activeTurn);
      currentAnalysis = clientData;
      document.getElementById('engineStatusText').textContent = 'موتور مرورگر فعال';
      updateAnalysisUI(clientData);
    }
  }, 50);
}

// Update Analysis UI Display
function updateAnalysisUI(data) {
  const resultCard = document.getElementById('resultCard');
  const badge = document.getElementById('statusBadge');
  const expBox = document.getElementById('explanationFa');
  const statInCheck = document.getElementById('statInCheck');
  const statLegalMoves = document.getElementById('statLegalMoves');
  const statKingSquare = document.getElementById('statKingSquare');
  const statCheckingPieces = document.getElementById('statCheckingPieces');
  const legalMovesDetails = document.getElementById('legalMovesDetails');
  const legalMovesTags = document.getElementById('legalMovesTags');
  const legalMovesCount = document.getElementById('legalMovesCount');

  // Badge & Card Colors
  badge.textContent = data.status_fa || data.status;
  badge.className = `status-badge badge-${data.status_color || 'info'}`;
  resultCard.className = `card result-card status-${data.status_color || 'info'}`;

  // Explanation
  expBox.textContent = data.explanation_fa || 'وضعیتی دریافت نشد.';

  // Stats
  statInCheck.textContent = data.in_check ? 'بله ⚠️ (در معرض خطر)' : 'خیر ✅ (امن)';
  statInCheck.style.color = data.in_check ? '#f87171' : '#4ade80';

  statLegalMoves.textContent = data.legal_moves_count;
  statKingSquare.textContent = data.king_square || '-';

  if (data.checking_pieces && data.checking_pieces.length > 0) {
    statCheckingPieces.textContent = data.checking_pieces.map(p => `${p.square} (${p.piece})`).join(', ');
  } else {
    statCheckingPieces.textContent = 'هیچ مهره‌ای';
  }

  // Legal moves list
  legalMovesCount.textContent = data.legal_moves_count;
  legalMovesTags.innerHTML = '';
  if (data.legal_moves && data.legal_moves.length > 0) {
    data.legal_moves.forEach(m => {
      const span = document.createElement('span');
      span.className = 'move-tag';
      span.textContent = m.uci || `${m.from} → ${m.to}`;
      legalMovesTags.appendChild(span);
    });
  } else {
    legalMovesTags.innerHTML = '<span style="color:var(--text-dim)">هیچ حرکت قانونی وجود ندارد.</span>';
  }

  // Update board highlighting for checked king and attackers
  applyBoardHighlights(data);
}

// Highlight King in check & checking attackers on the chessboard
function applyBoardHighlights(data) {
  // Clear old highlights
  document.querySelectorAll('.square').forEach(sq => {
    sq.classList.remove('in-check', 'attacker', 'legal-target');
  });

  if (!data) return;

  // King in check
  if (data.in_check && data.king_coords) {
    const [kr, kc] = data.king_coords;
    const kingSq = document.querySelector(`.square[data-r="${kr}"][data-c="${kc}"]`);
    if (kingSq) kingSq.classList.add('in-check');
  }

  // Checking pieces
  if (data.checking_pieces) {
    data.checking_pieces.forEach(cp => {
      if (cp.coords) {
        const [cr, cc] = cp.coords;
        const atkSq = document.querySelector(`.square[data-r="${cr}"][data-c="${cc}"]`);
        if (atkSq) atkSq.classList.add('attacker');
      }
    });
  }

  // If a piece is selected by user, highlight its legal move destinations
  if (selectedSquare && data.legal_moves) {
    const fromSq = coordsToSquare(selectedSquare.r, selectedSquare.c);
    data.legal_moves.forEach(m => {
      if (m.from === fromSq && m.to_coords) {
        const [tr, tc] = m.to_coords;
        const targetSq = document.querySelector(`.square[data-r="${tr}"][data-c="${tc}"]`);
        if (targetSq) targetSq.classList.add('legal-target');
      }
    });
  }
}

// Render Chessboard Squares and Coordinates
function renderBoard() {
  const boardEl = document.getElementById('chessboard');
  boardEl.innerHTML = '';

  const leftRanks = document.getElementById('leftRanks');
  const rightRanks = document.getElementById('rightRanks');
  const bottomFiles = document.getElementById('bottomFiles');

  leftRanks.innerHTML = '';
  rightRanks.innerHTML = '';
  bottomFiles.innerHTML = '';

  const rankIndices = isBoardFlipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
  const fileIndices = isBoardFlipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  // Ranks labels
  for (let r of rankIndices) {
    const rankLabel = (8 - r).toString();
    const lSpan = document.createElement('span');
    lSpan.textContent = rankLabel;
    leftRanks.appendChild(lSpan);

    const rSpan = document.createElement('span');
    rSpan.textContent = rankLabel;
    rightRanks.appendChild(rSpan);
  }

  // Files labels
  for (let c of fileIndices) {
    const fileLabel = String.fromCharCode('a'.charCodeAt(0) + c);
    const fSpan = document.createElement('span');
    fSpan.textContent = fileLabel;
    bottomFiles.appendChild(fSpan);
  }

  // 64 squares
  for (let r of rankIndices) {
    for (let c of fileIndices) {
      const isLight = (r + c) % 2 === 0;
      const square = document.createElement('div');
      square.className = `square ${isLight ? 'light' : 'dark'}`;
      square.dataset.r = r;
      square.dataset.c = c;
      square.dataset.square = coordsToSquare(r, c);

      const pieceCode = boardState[r][c];
      if (pieceCode && PIECE_SVGS[pieceCode]) {
        square.innerHTML = PIECE_SVGS[pieceCode];
        const svg = square.querySelector('.piece-svg');
        svg.draggable = true;

        svg.addEventListener('dragstart', (e) => {
          draggedPiece = { fromR: r, fromC: c, pieceCode: pieceCode };
          svg.classList.add('dragging');
          e.dataTransfer.setData('text/plain', pieceCode);
        });

        svg.addEventListener('dragend', () => {
          svg.classList.remove('dragging');
          draggedPiece = null;
        });
      }

      // Drag over / drop
      square.addEventListener('dragover', (e) => {
        e.preventDefault();
        square.classList.add('drag-over');
      });

      square.addEventListener('dragleave', () => {
        square.classList.remove('drag-over');
      });

      square.addEventListener('drop', (e) => {
        e.preventDefault();
        square.classList.remove('drag-over');
        if (draggedPiece) {
          // Move piece from origin to target
          boardState[draggedPiece.fromR][draggedPiece.fromC] = null;
          boardState[r][c] = draggedPiece.pieceCode;
          renderBoard();
          triggerEvaluate();
        }
      });

      // Click handling
      square.addEventListener('click', () => {
        handleSquareClick(r, c);
      });

      // Right-click to remove piece
      square.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (boardState[r][c]) {
          boardState[r][c] = null;
          renderBoard();
          triggerEvaluate();
        }
      });

      boardEl.appendChild(square);
    }
  }

  if (currentAnalysis) {
    applyBoardHighlights(currentAnalysis);
  }
}

// Square Click Handler
function handleSquareClick(r, c) {
  if (activeTool === 'erase') {
    // Erase mode
    if (boardState[r][c]) {
      boardState[r][c] = null;
      renderBoard();
      triggerEvaluate();
    }
    return;
  }

  if (selectedPalettePiece) {
    // Place piece from palette
    boardState[r][c] = selectedPalettePiece;
    renderBoard();
    triggerEvaluate();
    return;
  }

  // Pointer mode: Select piece or move selected piece
  if (selectedSquare) {
    if (selectedSquare.r === r && selectedSquare.c === c) {
      // Deselect
      selectedSquare = null;
      renderBoard();
      return;
    }

    // Try moving selected piece to target
    boardState[r][c] = boardState[selectedSquare.r][selectedSquare.c];
    boardState[selectedSquare.r][selectedSquare.c] = null;
    selectedSquare = null;
    renderBoard();
    triggerEvaluate();
  } else {
    if (boardState[r][c]) {
      selectedSquare = { r, c };
      renderBoard();
      const sqEl = document.querySelector(`.square[data-r="${r}"][data-c="${c}"]`);
      if (sqEl) sqEl.classList.add('selected');
    }
  }
}

// Update Turn Indicator and Buttons
function updateTurnUI() {
  const turnDot = document.querySelector('.turn-dot');
  const turnText = document.querySelector('.turn-text');
  const btnWhite = document.getElementById('btnTurnWhite');
  const btnBlack = document.getElementById('btnTurnBlack');

  if (activeTurn === 'w') {
    turnDot.className = 'turn-dot white-turn';
    turnText.innerHTML = 'نوبت حرکت: <strong>سفید</strong>';
    btnWhite.classList.add('active');
    btnBlack.classList.remove('active');
  } else {
    turnDot.className = 'turn-dot black-turn';
    turnText.innerHTML = 'نوبت حرکت: <strong>سیاه</strong>';
    btnWhite.classList.remove('active');
    btnBlack.classList.add('active');
  }
}

// Initialize Application & Event Listeners
function initApp() {
  // Load standard initial position
  loadFen(PRESETS.initial.fen);

  // Turn buttons
  document.getElementById('btnTurnWhite').addEventListener('click', () => {
    activeTurn = 'w';
    updateTurnUI();
    triggerEvaluate();
  });

  document.getElementById('btnTurnBlack').addEventListener('click', () => {
    activeTurn = 'b';
    updateTurnUI();
    triggerEvaluate();
  });

  // Board tool buttons
  document.getElementById('btnFlipBoard').addEventListener('click', () => {
    isBoardFlipped = !isBoardFlipped;
    renderBoard();
  });

  document.getElementById('btnResetBoard').addEventListener('click', () => {
    loadFen(PRESETS.initial.fen);
  });

  document.getElementById('btnClearBoard').addEventListener('click', () => {
    boardState = Array(8).fill(null).map(() => Array(8).fill(null));
    renderBoard();
    triggerEvaluate();
  });

  // Palette buttons
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const piece = btn.dataset.piece;
      if (selectedPalettePiece === piece) {
        // Toggle off
        selectedPalettePiece = null;
        btn.classList.remove('active');
        activeTool = 'pointer';
        document.getElementById('toolPointer').classList.add('active');
      } else {
        selectedPalettePiece = piece;
        document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTool = 'place';
        document.querySelectorAll('.tool-btn').forEach(tb => tb.classList.remove('active'));
      }
    });
  });

  // Tool buttons
  document.getElementById('toolErase').addEventListener('click', () => {
    activeTool = 'erase';
    selectedPalettePiece = null;
    selectedSquare = null;
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('toolErase').classList.add('active');
    renderBoard();
  });

  document.getElementById('toolPointer').addEventListener('click', () => {
    activeTool = 'pointer';
    selectedPalettePiece = null;
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('toolPointer').classList.add('active');
    renderBoard();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      const preset = PRESETS[presetKey];
      if (preset) {
        loadFen(preset.fen);
        if (preset.turn) {
          activeTurn = preset.turn;
          updateTurnUI();
        }
        triggerEvaluate();
      }
    });
  });

  // FEN buttons
  document.getElementById('btnLoadFen').addEventListener('click', () => {
    const fenVal = document.getElementById('fenInput').value;
    if (fenVal) loadFen(fenVal);
  });

  document.getElementById('btnCopyFen').addEventListener('click', () => {
    const fenInput = document.getElementById('fenInput');
    fenInput.select();
    navigator.clipboard.writeText(fenInput.value);
    const copyBtn = document.getElementById('btnCopyFen');
    copyBtn.textContent = 'کپی شد!';
    setTimeout(() => { copyBtn.textContent = '📋 کپی'; }, 1500);
  });
}

document.addEventListener('DOMContentLoaded', initApp);
