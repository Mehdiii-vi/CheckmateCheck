/**
 * CheckmateCheck - Streamlined Frontend
 * - Strictly powered by the Python engine via POST /api/evaluate
 * - Top-level turn switcher (White/Black)
 * - Click on ANY piece (White or Black) highlights its standard legal moves
 * - Simplified outcome display (Checkmate, Stalemate, Check, Normal, Invalid)
 */

// Chess Piece SVG Vectors
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

// Initial standard chess placement
const INITIAL_GRID = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

// State
let boardState = INITIAL_GRID.map(row => [...row]);
let activeTurn = 'w';
let selectedPalettePiece = null;
let activeTool = 'pointer'; // 'pointer' or 'erase'
let isBoardFlipped = false;
let draggedPiece = null; // { fromR, fromC, pieceCode }
let selectedSquare = null; // { r, c }
let currentAnalysis = null;

// Helpers for coordinates
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

// Request evaluation strictly from Python server
let evaluateDebounceTimer = null;
async function triggerEvaluate() {
  clearTimeout(evaluateDebounceTimer);
  evaluateDebounceTimer = setTimeout(async () => {
    const payload = {
      grid: boardState,
      active_turn: activeTurn
    };

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      currentAnalysis = data;
      updateAnalysisUI(data);
    } catch (err) {
      console.error('Failed to communicate with Python engine:', err);
      const errData = {
        status: "ERROR",
        status_fa: "عدم ارتباط با سرور",
        status_color: "warning",
        message_fa: "اتصال به وب‌سرور پایتون برقرار نشد. لطفاً دستور python server.py را اجرا نمایید.",
        moves_by_square: {}
      };
      currentAnalysis = errData;
      updateAnalysisUI(errData);
    }
  }, 40);
}

// Update UI with the simplified verdict
function updateAnalysisUI(data) {
  const resultCard = document.getElementById('resultCard');
  const badge = document.getElementById('statusBadge');
  const messageBox = document.getElementById('statusMessage');

  // Status Badge
  badge.textContent = data.status_fa || data.status;
  badge.className = `status-badge badge-${data.status_color || 'info'}`;
  resultCard.className = `card result-card status-${data.status_color || 'info'}`;

  // Message
  messageBox.textContent = data.message_fa || data.explanation_fa || '';

  // Apply square highlights
  applyBoardHighlights();
}

// Apply Board Highlights (King check + Legal target moves)
function applyBoardHighlights() {
  // Clear highlights
  document.querySelectorAll('.square').forEach(sq => {
    sq.classList.remove('in-check', 'legal-target');
  });

  if (!currentAnalysis) return;

  // 1. King in check highlight
  if (currentAnalysis.in_check && currentAnalysis.king_coords) {
    const [kr, kc] = currentAnalysis.king_coords;
    const kingSq = document.querySelector(`.square[data-r="${kr}"][data-c="${kc}"]`);
    if (kingSq) kingSq.classList.add('in-check');
  }

  // 2. Clicked piece's legal moves (for BOTH White and Black)
  if (selectedSquare && currentAnalysis.moves_by_square) {
    const fromSq = coordsToSquare(selectedSquare.r, selectedSquare.c);
    const targets = currentAnalysis.moves_by_square[fromSq] || [];
    targets.forEach(toSq => {
      const { r, c } = squareToCoords(toSq);
      const targetEl = document.querySelector(`.square[data-r="${r}"][data-c="${c}"]`);
      if (targetEl) targetEl.classList.add('legal-target');
    });
  }
}

// Render Chessboard
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

  // Ranks
  for (let r of rankIndices) {
    const label = (8 - r).toString();
    const lSpan = document.createElement('span');
    lSpan.textContent = label;
    leftRanks.appendChild(lSpan);

    const rSpan = document.createElement('span');
    rSpan.textContent = label;
    rightRanks.appendChild(rSpan);
  }

  // Files
  for (let c of fileIndices) {
    const fSpan = document.createElement('span');
    fSpan.textContent = String.fromCharCode('a'.charCodeAt(0) + c);
    bottomFiles.appendChild(fSpan);
  }

  // 64 Squares
  for (let r of rankIndices) {
    for (let c of fileIndices) {
      const isLight = (r + c) % 2 === 0;
      const square = document.createElement('div');
      square.className = `square ${isLight ? 'light' : 'dark'}`;
      square.dataset.r = r;
      square.dataset.c = c;
      square.dataset.square = coordsToSquare(r, c);

      // Selected piece square highlight
      if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
        square.classList.add('selected');
      }

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
          boardState[draggedPiece.fromR][draggedPiece.fromC] = null;
          boardState[r][c] = draggedPiece.pieceCode;
          selectedSquare = null;
          renderBoard();
          triggerEvaluate();
        }
      });

      // Click handler
      square.addEventListener('click', () => {
        handleSquareClick(r, c);
      });

      // Right-click to remove piece
      square.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (boardState[r][c]) {
          boardState[r][c] = null;
          selectedSquare = null;
          renderBoard();
          triggerEvaluate();
        }
      });

      boardEl.appendChild(square);
    }
  }

  applyBoardHighlights();
}

// Handle square click
function handleSquareClick(r, c) {
  // If Erase tool is active
  if (activeTool === 'erase') {
    if (boardState[r][c]) {
      boardState[r][c] = null;
      selectedSquare = null;
      renderBoard();
      triggerEvaluate();
    }
    return;
  }

  // If a piece is selected from palette, place it
  if (selectedPalettePiece) {
    boardState[r][c] = selectedPalettePiece;
    renderBoard();
    triggerEvaluate();
    return;
  }

  // Normal pointer mode:
  const clickedSquareStr = coordsToSquare(r, c);
  const pieceOnSquare = boardState[r][c];

  // If a piece was already selected on board:
  if (selectedSquare) {
    const fromSquareStr = coordsToSquare(selectedSquare.r, selectedSquare.c);
    const validTargets = (currentAnalysis && currentAnalysis.moves_by_square && currentAnalysis.moves_by_square[fromSquareStr]) || [];

    // Did user click on a legal destination square?
    if (validTargets.includes(clickedSquareStr)) {
      boardState[r][c] = boardState[selectedSquare.r][selectedSquare.c];
      boardState[selectedSquare.r][selectedSquare.c] = null;
      selectedSquare = null;
      renderBoard();
      triggerEvaluate();
      return;
    }

    // Did user click on the SAME selected piece? (Deselect)
    if (selectedSquare.r === r && selectedSquare.c === c) {
      selectedSquare = null;
      renderBoard();
      return;
    }

    // Did user click on ANOTHER piece? (Switch selection to that piece!)
    if (pieceOnSquare) {
      selectedSquare = { r, c };
      renderBoard();
      return;
    }

    // User clicked an empty invalid square: Deselect
    selectedSquare = null;
    renderBoard();
    return;
  }

  // No piece currently selected:
  if (pieceOnSquare) {
    // Select this piece (White OR Black) to display its legal moves!
    selectedSquare = { r, c };
    renderBoard();
  }
}

// Update Turn Indicator Buttons at the Top
function updateTurnUI() {
  const btnWhite = document.getElementById('btnTurnWhite');
  const btnBlack = document.getElementById('btnTurnBlack');

  if (activeTurn === 'w') {
    btnWhite.classList.add('active');
    btnBlack.classList.remove('active');
  } else {
    btnWhite.classList.remove('active');
    btnBlack.classList.add('active');
  }
}

// Initialize Application
function initApp() {
  // Turn selection buttons at the top
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

  // Board actions
  document.getElementById('btnFlipBoard').addEventListener('click', () => {
    isBoardFlipped = !isBoardFlipped;
    renderBoard();
  });

  document.getElementById('btnResetBoard').addEventListener('click', () => {
    boardState = INITIAL_GRID.map(row => [...row]);
    selectedSquare = null;
    activeTurn = 'w';
    updateTurnUI();
    renderBoard();
    triggerEvaluate();
  });

  document.getElementById('btnClearBoard').addEventListener('click', () => {
    boardState = Array(8).fill(null).map(() => Array(8).fill(null));
    selectedSquare = null;
    renderBoard();
    triggerEvaluate();
  });

  // Palette piece selection
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const piece = btn.dataset.piece;
      if (selectedPalettePiece === piece) {
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
    selectedSquare = null;
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('toolPointer').classList.add('active');
    renderBoard();
  });

  // Initial render & first evaluation call to Python
  updateTurnUI();
  renderBoard();
  triggerEvaluate();
}

document.addEventListener('DOMContentLoaded', initApp);
