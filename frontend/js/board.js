/**
 * CheckmateCheck - Interactive Chessboard Controller
 * Handles 64-square rendering, Repositioning / Moving pieces on board, Drag & Drop, Brush tool, SVG threat arrows.
 */

class InteractiveBoard {
  constructor(containerId, svgOverlayId) {
    this.container = document.getElementById(containerId);
    this.svgOverlay = document.getElementById(svgOverlayId);
    this.grid = Array(8).fill(null).map(() => Array(8).fill(null));

    this.activeBrush = null; // e.g. {color: 'w', type: 'K'} or 'TRASH'
    this.selectedSquare = null; // {r, c}
    this.draggedFrom = null; // {r, c} or null if from palette
    this.draggedPiece = null; // {color, type}

    this.analysisData = null;

    this.init();
  }

  init() {
    this.renderBoard();
    this.setupGlobalDropHandlers();
  }

  clear() {
    this.grid = Array(8).fill(null).map(() => Array(8).fill(null));
    this.clearHighlights();
    this.clearThreatOverlay();
    this.deselectSquare();
    this.renderPieces();
  }

  loadMatrix(matrix) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        this.grid[r][c] = matrix[r][c] ? { ...matrix[r][c] } : null;
      }
    }
    this.clearHighlights();
    this.clearThreatOverlay();
    this.renderPieces();
  }

  loadFen(fen) {
    this.clear();
    const fenClean = fen.trim().split(' ')[0];
    const rows = fenClean.split('/');
    if (rows.length !== 8) return;

    const symbolMap = {
      'K': { color: 'w', type: 'K' }, 'Q': { color: 'w', type: 'Q' },
      'R': { color: 'w', type: 'R' }, 'B': { color: 'w', type: 'B' },
      'N': { color: 'w', type: 'N' }, 'P': { color: 'w', type: 'P' },
      'k': { color: 'b', type: 'K' }, 'q': { color: 'b', type: 'Q' },
      'r': { color: 'b', type: 'R' }, 'b': { color: 'b', type: 'B' },
      'n': { color: 'b', type: 'N' }, 'p': { color: 'b', type: 'P' }
    };

    for (let r = 0; r < 8; r++) {
      let c = 0;
      for (const ch of rows[r]) {
        if (ch >= '1' && ch <= '8') {
          c += parseInt(ch, 10);
        } else if (symbolMap[ch]) {
          this.grid[r][c] = symbolMap[ch];
          c++;
        }
      }
    }
    this.renderPieces();
  }

  getMatrix() {
    return this.grid;
  }

  isBoardEmpty() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.grid[r][c] !== null) return false;
      }
    }
    return true;
  }

  renderBoard() {
    if (!this.container) return;
    this.container.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.className = `chess-square ${isLight ? 'light' : 'dark'}`;
        sq.dataset.row = r;
        sq.dataset.col = c;
        sq.id = `sq-${r}-${c}`;

        // File and Rank coordinate indicators on edges
        if (c === 0) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'square-coord-rank';
          rankLabel.innerText = 8 - r;
          sq.appendChild(rankLabel);
        }
        if (r === 7) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'square-coord-file';
          fileLabel.innerText = String.fromCharCode(97 + c);
          sq.appendChild(fileLabel);
        }

        // Drag & Drop event listeners on every square
        sq.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });

        sq.addEventListener('dragenter', (e) => {
          e.preventDefault();
          sq.classList.add('selected');
        });

        sq.addEventListener('dragleave', () => {
          if (!this.selectedSquare || this.selectedSquare.r !== r || this.selectedSquare.c !== c) {
            sq.classList.remove('selected');
          }
        });

        sq.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          sq.classList.remove('selected');

          // Retrieve drag payload from global state or dataTransfer
          let payload = window._chessDragPayload;
          if (!payload) {
            try {
              const raw = e.dataTransfer.getData('application/json');
              if (raw) payload = JSON.parse(raw);
            } catch (_) {}
          }

          if (payload && payload.piece) {
            this.handleDropOnSquare(r, c, payload);
          }
        });

        // Click event listener
        sq.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleSquareClick(r, c);
        });

        this.container.appendChild(sq);
      }
    }
  }

  renderPieces() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.getElementById(`sq-${r}-${c}`);
        if (!sq) continue;

        // Remove old piece wrapper while preserving rank/file labels
        const oldWrapper = sq.querySelector('.piece-wrapper');
        if (oldWrapper) oldWrapper.remove();

        const piece = this.grid[r][c];
        if (piece) {
          const pieceCode = `${piece.color}${piece.type}`;
          const svgMarkup = PIECE_SVGS[pieceCode];
          if (svgMarkup) {
            const wrapper = document.createElement('div');
            wrapper.className = 'piece-wrapper';
            wrapper.draggable = true;
            wrapper.innerHTML = svgMarkup.trim();

            // When dragging an existing piece on the board:
            wrapper.addEventListener('dragstart', (e) => {
              window._chessDragPayload = {
                from: { r, c },
                piece: { color: piece.color, type: piece.type }
              };
              this.draggedFrom = { r, c };
              this.draggedPiece = piece;

              try {
                e.dataTransfer.setData('application/json', JSON.stringify(window._chessDragPayload));
                e.dataTransfer.setData('text/plain', pieceCode);
              } catch (_) {}
              e.dataTransfer.effectAllowed = 'move';

              // Visual feedback: dim piece while in air
              setTimeout(() => {
                wrapper.style.opacity = '0.35';
              }, 0);
            });

            wrapper.addEventListener('dragend', () => {
              wrapper.style.opacity = '1';
              // Delay clearing payload slightly to ensure drop handler receives it
              setTimeout(() => {
                window._chessDragPayload = null;
                this.draggedFrom = null;
                this.draggedPiece = null;
              }, 120);
            });

            sq.appendChild(wrapper);
          }
        }
      }
    }
  }

  handleDropOnSquare(destR, destC, payload) {
    const from = payload.from || this.draggedFrom;
    const piece = payload.piece || this.draggedPiece;
    if (!piece) return;

    if (from) {
      // Repositioning piece from an existing square on the board!
      if (from.r === destR && from.c === destC) {
        return; // Dropped on identical square
      }
      // Remove piece from original square
      this.grid[from.r][from.c] = null;
    }

    // Place piece on destination square
    this.grid[destR][destC] = { color: piece.color, type: piece.type };

    // Reset drag variables
    window._chessDragPayload = null;
    this.draggedFrom = null;
    this.draggedPiece = null;

    // Reset selection & highlights
    this.deselectSquare();
    this.clearThreatOverlay();
    this.clearHighlights();
    this.renderPieces();
    window.chessAudio.playMove();

    // Helper banner message
    const brushInfo = document.getElementById('active-brush-info');
    if (brushInfo && !this.activeBrush) {
      const typeNames = { K: 'شاه', Q: 'وزیر', R: 'رخ', B: 'فیل', N: 'اسب', P: 'پیاده' };
      const colorName = piece.color === 'w' ? 'سفید' : 'سیاه';
      if (from) {
        brushInfo.innerHTML = `<span class="text-emerald-400 font-bold">✓ مهره جابه‌جا شد:</span> ${typeNames[piece.type]} ${colorName} به خانه جدید منتقل شد.`;
      } else {
        brushInfo.innerHTML = `<span class="text-indigo-400 font-bold">✓ مهره اضافه شد:</span> ${typeNames[piece.type]} ${colorName} روی صفحه قرار گرفت.`;
      }
    }
  }

  handleSquareClick(r, c) {
    const currentPiece = this.grid[r][c];

    // 1. If Trash tool is active
    if (this.activeBrush === 'TRASH') {
      if (currentPiece) {
        this.grid[r][c] = null;
        this.deselectSquare();
        this.clearThreatOverlay();
        this.clearHighlights();
        this.renderPieces();
        window.chessAudio.playMove();
      }
      return;
    }

    // 2. If a piece on the board is already selected -> MOVE IT to (r, c)!
    if (this.selectedSquare) {
      const { r: prevR, c: prevC } = this.selectedSquare;
      if (prevR === r && prevC === c) {
        // Deselect
        this.deselectSquare();
        return;
      }

      // Move piece from selectedSquare to (r, c)
      const movingPiece = this.grid[prevR][prevC];
      this.grid[prevR][prevC] = null;
      this.grid[r][c] = movingPiece;
      this.deselectSquare();
      this.clearThreatOverlay();
      this.clearHighlights();
      this.renderPieces();
      window.chessAudio.playMove();

      const brushInfo = document.getElementById('active-brush-info');
      if (brushInfo && !this.activeBrush) {
        const typeNames = { K: 'شاه', Q: 'وزیر', R: 'رخ', B: 'فیل', N: 'اسب', P: 'پیاده' };
        const colorName = movingPiece.color === 'w' ? 'سفید' : 'سیاه';
        brushInfo.innerHTML = `<span class="text-emerald-400 font-bold">✓ مهره جابه‌جا شد:</span> ${typeNames[movingPiece.type]} ${colorName} به خانه جدید منتقل شد.`;
      }
      return;
    }

    // 3. If clicking an existing piece on the board -> SELECT IT TO MOVE IT!
    if (currentPiece) {
      this.setBrush(null); // Clear any palette brush
      this.selectSquare(r, c);

      const brushInfo = document.getElementById('active-brush-info');
      if (brushInfo) {
        const typeNames = { K: 'شاه', Q: 'وزیر', R: 'رخ', B: 'فیل', N: 'اسب', P: 'پیاده' };
        const colorName = currentPiece.color === 'w' ? 'سفید' : 'سیاه';
        brushInfo.innerHTML = `<span class="text-amber-400 font-bold">🎯 ${typeNames[currentPiece.type]} ${colorName} انتخاب شد:</span> روی خانه مقصد کلیک کنید یا مهره را با ماوس بکشید.`;
      }
      return;
    }

    // 4. If clicking an empty square and activeBrush is set -> PLACE PIECE!
    if (this.activeBrush) {
      this.grid[r][c] = { ...this.activeBrush };
      this.clearThreatOverlay();
      this.clearHighlights();
      this.renderPieces();
      window.chessAudio.playMove();
      return;
    }
  }

  selectSquare(r, c) {
    this.deselectSquare();
    this.selectedSquare = { r, c };
    const sq = document.getElementById(`sq-${r}-${c}`);
    if (sq) sq.classList.add('selected');
  }

  deselectSquare() {
    if (this.selectedSquare) {
      const sq = document.getElementById(`sq-${this.selectedSquare.r}-${this.selectedSquare.c}`);
      if (sq) sq.classList.remove('selected');
      this.selectedSquare = null;
    }
  }

  setBrush(brush) {
    this.activeBrush = brush;
    this.deselectSquare();

    // Update palette UI active indicator
    document.querySelectorAll('.piece-palette-item').forEach(el => {
      el.classList.remove('active-brush');
    });

    const brushInfoEl = document.getElementById('active-brush-info');

    if (brush) {
      let targetId = '';
      if (brush === 'TRASH') {
        targetId = 'palette-trash';
        if (brushInfoEl) {
          brushInfoEl.innerHTML = `<span class="text-rose-400 font-bold">🗑️ حالت حذف فعال است:</span> روی هر مهره در صفحه کلیک کنید تا حذف شود.`;
        }
      } else {
        targetId = `palette-${brush.color}${brush.type}`;
        const colorName = brush.color === 'w' ? 'سفید' : 'سیاه';
        const typeNames = { K: 'شاه', Q: 'وزیر', R: 'رخ', B: 'فیل', N: 'اسب', P: 'پیاده' };
        if (brushInfoEl) {
          brushInfoEl.innerHTML = `<span class="text-indigo-400 font-bold">📌 مهره انتخابی:</span> ${typeNames[brush.type]} ${colorName} - روی هر خانه کلیک کنید تا قرار گیرد (یا مهره را مستقیماً بکشید).`;
        }
      }
      const activeEl = document.getElementById(targetId);
      if (activeEl) activeEl.classList.add('active-brush');
    } else {
      if (brushInfoEl) {
        brushInfoEl.innerHTML = `<span class="text-slate-400">یک مهره از پالت انتخاب کنید، یا مهره‌های چیده شده روی صفحه را با درگ جابه‌جا کنید.</span>`;
      }
    }
  }

  setupPaletteInteractions() {
    // White pieces
    ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'].forEach(code => {
      const el = document.getElementById(`palette-${code}`);
      if (el) {
        el.draggable = true;
        const color = code[0];
        const type = code[1];

        el.addEventListener('dragstart', (e) => {
          window._chessDragPayload = {
            from: null,
            piece: { color, type }
          };
          this.draggedFrom = null;
          this.draggedPiece = { color, type };
          try {
            e.dataTransfer.setData('application/json', JSON.stringify(window._chessDragPayload));
            e.dataTransfer.setData('text/plain', code);
          } catch (_) {}
          e.dataTransfer.effectAllowed = 'copy';
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.activeBrush && this.activeBrush.color === color && this.activeBrush.type === type) {
            this.setBrush(null);
          } else {
            this.setBrush({ color, type });
          }
        });
      }
    });

    // Black pieces
    ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'].forEach(code => {
      const el = document.getElementById(`palette-${code}`);
      if (el) {
        el.draggable = true;
        const color = code[0];
        const type = code[1];

        el.addEventListener('dragstart', (e) => {
          window._chessDragPayload = {
            from: null,
            piece: { color, type }
          };
          this.draggedFrom = null;
          this.draggedPiece = { color, type };
          try {
            e.dataTransfer.setData('application/json', JSON.stringify(window._chessDragPayload));
            e.dataTransfer.setData('text/plain', code);
          } catch (_) {}
          e.dataTransfer.effectAllowed = 'copy';
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.activeBrush && this.activeBrush.color === color && this.activeBrush.type === type) {
            this.setBrush(null);
          } else {
            this.setBrush({ color, type });
          }
        });
      }
    });

    // Trash Tool
    const trashEl = document.getElementById('palette-trash');
    if (trashEl) {
      trashEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.activeBrush === 'TRASH') {
          this.setBrush(null);
        } else {
          this.setBrush('TRASH');
        }
      });
    }
  }

  setupGlobalDropHandlers() {
    // If a piece is dragged completely off the board, remove it
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => {
      const payload = window._chessDragPayload;
      if (payload && payload.from && !e.target.closest('.chessboard-container')) {
        this.grid[payload.from.r][payload.from.c] = null;
        this.renderPieces();
        this.clearThreatOverlay();
        this.clearHighlights();
        this.deselectSquare();
        window._chessDragPayload = null;
        this.draggedFrom = null;
        this.draggedPiece = null;
        window.chessAudio.playMove();

        const brushInfo = document.getElementById('active-brush-info');
        if (brushInfo) {
          brushInfo.innerHTML = `<span class="text-rose-400 font-bold">🗑️ مهره با کشیدن به بیرون حذف شد.</span>`;
        }
      }
    });
  }

  clearHighlights() {
    document.querySelectorAll('.chess-square').forEach(sq => {
      sq.classList.remove(
        'selected', 'check-highlight', 'checkmate-highlight',
        'stalemate-highlight', 'escape-hint', 'ray-hint'
      );
    });
  }

  clearThreatOverlay() {
    if (this.svgOverlay) {
      this.svgOverlay.innerHTML = '';
    }
  }

  renderAnalysisResult(data) {
    this.clearHighlights();
    this.clearThreatOverlay();
    this.analysisData = data;

    if (!data.is_valid) {
      window.chessAudio.playError();
      return;
    }

    const white = data.white;
    const black = data.black;

    // Highlight White King
    if (white && white.king_position) {
      const [r, c] = white.king_position;
      const sq = document.getElementById(`sq-${r}-${c}`);
      if (sq) {
        if (white.status === 'CHECKMATE') sq.classList.add('checkmate-highlight');
        else if (white.status === 'CHECK') sq.classList.add('check-highlight');
        else if (white.status === 'STALEMATE') sq.classList.add('stalemate-highlight');
      }
    }

    // Highlight Black King
    if (black && black.king_position) {
      const [r, c] = black.king_position;
      const sq = document.getElementById(`sq-${r}-${c}`);
      if (sq) {
        if (black.status === 'CHECKMATE') sq.classList.add('checkmate-highlight');
        else if (black.status === 'CHECK') sq.classList.add('check-highlight');
        else if (black.status === 'STALEMATE') sq.classList.add('stalemate-highlight');
      }
    }

    // Play appropriate sound
    if (data.overall_status === 'CHECKMATE') {
      window.chessAudio.playMate();
    } else if (data.overall_status === 'CHECK') {
      window.chessAudio.playCheck();
    } else {
      window.chessAudio.playMove();
    }

    // Draw SVG threat rays and arrows
    if (data.visual_threats && data.visual_threats.length > 0) {
      this.drawThreatArrows(data.visual_threats);
    }
  }

  drawThreatArrows(threats) {
    if (!this.svgOverlay) return;
    this.svgOverlay.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
      </marker>
      <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
      </marker>
    `;
    this.svgOverlay.appendChild(defs);

    threats.forEach(threat => {
      const [fromR, fromC] = threat.from;
      const [toR, toC] = threat.to;

      const x1 = ((fromC + 0.5) / 8) * 100;
      const y1 = ((fromR + 0.5) / 8) * 100;
      const x2 = ((toC + 0.5) / 8) * 100;
      const y2 = ((toR + 0.5) / 8) * 100;

      const isMate = threat.threat_type === 'CHECKMATE';
      const strokeColor = isMate ? '#EF4444' : '#F59E0B';
      const markerId = isMate ? 'arrow-red' : 'arrow-amber';

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${x1}%`);
      line.setAttribute('y1', `${y1}%`);
      line.setAttribute('x2', `${x2}%`);
      line.setAttribute('y2', `${y2}%`);
      line.setAttribute('stroke', strokeColor);
      line.setAttribute('stroke-width', '4');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-dasharray', '8 4');
      line.setAttribute('marker-end', `url(#${markerId})`);
      line.style.filter = `drop-shadow(0 0 8px ${strokeColor})`;

      this.svgOverlay.appendChild(line);

      // Highlight ray intermediate squares
      if (threat.ray_squares) {
        threat.ray_squares.forEach(sq => {
          const raySq = document.getElementById(`sq-${sq[0]}-${sq[1]}`);
          if (raySq) raySq.classList.add('ray-hint');
        });
      }
    });
  }
}
