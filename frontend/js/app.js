/**
 * CheckmateCheck - Main Application Controller
 */

class CheckmateApp {
  constructor() {
    this.board = null;
    this.currentLang = 'fa';
    this.init();
  }

  init() {
    // 1. Setup Palette HTML in DOM first
    this.setupPaletteHTML();

    // 2. Initialize interactive chessboard
    this.board = new InteractiveBoard('chessboard', 'threat-overlay');

    // 3. Connect palette event listeners to board
    this.board.setupPaletteInteractions();

    // 4. Setup Button and UI event listeners
    this.setupEventListeners();

    // 5. Initialize language and reset diagnostics
    this.updateLanguageUI();
    this.resetDiagnostics();
  }

  setupPaletteHTML() {
    const whiteContainer = document.getElementById('white-palette-col') || document.getElementById('white-palette-row');
    const blackContainer = document.getElementById('black-palette-col') || document.getElementById('black-palette-row');

    if (whiteContainer) {
      whiteContainer.innerHTML = '';
      ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'].forEach(code => {
        const item = document.createElement('div');
        item.id = `palette-${code}`;
        item.className = 'piece-palette-item w-12 h-12 sm:w-[52px] sm:h-[52px] p-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-xl flex items-center justify-center border border-slate-700 shadow-md';
        item.title = `White ${code[1]}`;
        item.innerHTML = PIECE_SVGS[code];
        whiteContainer.appendChild(item);
      });
    }

    if (blackContainer) {
      blackContainer.innerHTML = '';
      ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'].forEach(code => {
        const item = document.createElement('div');
        item.id = `palette-${code}`;
        item.className = 'piece-palette-item w-12 h-12 sm:w-[52px] sm:h-[52px] p-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-xl flex items-center justify-center border border-slate-700 shadow-md';
        item.title = `Black ${code[1]}`;
        item.innerHTML = PIECE_SVGS[code];
        blackContainer.appendChild(item);
      });
    }
  }

  setupEventListeners() {
    // Analyze Board Button
    const analyzeBtn = document.getElementById('btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    }

    // Clear Board Button
    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.board.clear();
        this.board.setBrush(null);
        this.resetDiagnostics();
        window.chessAudio.playMove();
      });
    }

    // Language Toggle
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.currentLang = this.currentLang === 'fa' ? 'en' : 'fa';
        this.updateLanguageUI();
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = window.chessAudio.toggleSound();
        soundBtn.innerHTML = enabled ? '🔊' : '🔇';
      });
    }
  }

  async handleAnalyze() {
    const isFa = this.currentLang === 'fa';
    const resultsContainer = document.getElementById('diagnostics-container');

    // Check if board is completely empty
    if (this.board.isBoardEmpty()) {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xl">⚠️</span>
              <h3 class="text-sm font-bold text-amber-300">
                ${isFa ? 'صفحه شطرنج در حال حاضر خالی است!' : 'The board is currently empty!'}
              </h3>
            </div>
            <p class="text-xs leading-relaxed text-amber-100">
              ${isFa ? 'لطفاً ابتدا مهره‌های دلخواه (حداقل یک شاه سفید و یک شاه سیاه) را از پالت مهره‌ها روی صفحه قرار دهید و سپس روی دکمه بررسی کلیک کنید.' : 'Please place pieces (at least one White King and one Black King) from the palette onto the board first.'}
            </p>
          </div>
        `;
      }
      window.chessAudio.playError();
      return;
    }

    const analyzeBtn = document.getElementById('btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.classList.add('opacity-75');
    }

    try {
      const matrix = this.board.getMatrix();
      const response = await ChessAPI.analyze(matrix);

      if (response && response.success) {
        this.renderDiagnostics(response.data);
        this.board.renderAnalysisResult(response.data);
      } else {
        alert(response.error || 'خطا در تحلیل صفحه');
      }
    } catch (err) {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">❌</span>
              <h3 class="text-sm font-bold text-rose-300">عدم برقراری ارتباط با سرور پایتون</h3>
            </div>
            <p class="text-xs leading-relaxed text-rose-100">
              لطفاً مطمئن شوید سرور پایتون با دستور <code>python run.py</code> در حال اجرا است.
            </p>
          </div>
        `;
      }
    } finally {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('opacity-75');
      }
    }
  }

  renderDiagnostics(data) {
    const resultsContainer = document.getElementById('diagnostics-container');
    if (!resultsContainer) return;

    const isFa = this.currentLang === 'fa';

    // 1. Invalid Board State
    if (!data.is_valid) {
      const errors = isFa ? data.validation.errors_fa : data.validation.errors_en;
      resultsContainer.innerHTML = `
        <div class="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <h3 class="text-base font-bold text-rose-300">
              ${isFa ? 'صفحه غیرمعتبر است (Invalid Position)' : 'Invalid Board Configuration'}
            </h3>
          </div>
          <ul class="space-y-2 text-xs leading-relaxed text-rose-100 list-disc list-inside">
            ${errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        </div>
      `;
      return;
    }

    // 2. Status Color and Badge
    let badgeColorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let iconChar = '🛡️';
    if (data.overall_status === 'CHECKMATE') {
      badgeColorClass = 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-900/40';
      iconChar = '⚔️';
    } else if (data.overall_status === 'CHECK') {
      badgeColorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-900/30';
      iconChar = '⚠️';
    } else if (data.overall_status === 'STALEMATE') {
      badgeColorClass = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      iconChar = '🤝';
    }

    const verdict = isFa ? data.verdict_fa : data.verdict_en;
    const summary = isFa ? data.summary_fa : data.summary_en;

    const whiteStatus = isFa ? data.white.status_label_fa : data.white.status_label_en;
    const blackStatus = isFa ? data.black.status_label_fa : data.black.status_label_en;

    // Defense options list
    let defenseHtml = '';
    const affected = data.affected_side === 'w' ? data.white : (data.affected_side === 'b' ? data.black : null);
    if (affected && affected.evasions && affected.evasions.all_evasion_moves.length > 0) {
      defenseHtml = `
        <div class="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-700/70">
          <h4 class="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <span>🛡️</span> ${isFa ? 'راه‌های قانونی برای رفع کیش:' : 'Legal Evasions:'}
          </h4>
          <div class="grid grid-cols-2 gap-2 text-xs text-slate-300 max-h-32 overflow-y-auto pr-1">
            ${affected.evasions.all_evasion_moves.map(m => `
              <div class="p-1.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px] flex justify-between">
                <span>${m.piece_name_fa || m.piece.type}</span>
                <span class="text-indigo-300 font-bold">${m.from_notation} &rarr; ${m.to_notation}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Step-by-step pipeline
    const stepsHtml = data.algorithm_steps.map(s => `
      <div class="flex items-start gap-3 text-xs">
        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
          ${s.step}
        </span>
        <div>
          <div class="font-bold text-slate-200">${isFa ? s.title_fa : s.title_en}</div>
          <div class="text-slate-400 text-[11px] leading-tight">${isFa ? s.description_fa : s.description_en}</div>
        </div>
      </div>
    `).join('');

    resultsContainer.innerHTML = `
      <!-- Verdict Banner -->
      <div class="p-4 rounded-2xl border ${badgeColorClass} mb-4 transition-all">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xl">${iconChar}</span>
          <h3 class="text-sm md:text-base font-black tracking-wide">${verdict}</h3>
        </div>
        <p class="text-xs leading-relaxed opacity-90">${summary}</p>
        ${defenseHtml}
      </div>

      <!-- Two Kings Status Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="glass-card p-3 rounded-xl border border-slate-700/60">
          <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>${isFa ? 'شاه سفید' : 'White King'}</span>
            <span class="font-mono text-indigo-300">${data.white.king_notation}</span>
          </div>
          <div class="text-xs font-bold ${
            data.white.status === 'CHECKMATE' ? 'text-rose-400' :
            data.white.status === 'CHECK' ? 'text-amber-400' :
            data.white.status === 'STALEMATE' ? 'text-sky-400' : 'text-emerald-400'
          }">
            ${whiteStatus}
          </div>
          <div class="text-[10px] text-slate-500 mt-1">
            ${isFa ? `حرکات مجاز: ${data.white.total_legal_moves}` : `Legal moves: ${data.white.total_legal_moves}`}
          </div>
        </div>

        <div class="glass-card p-3 rounded-xl border border-slate-700/60">
          <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>${isFa ? 'شاه سیاه' : 'Black King'}</span>
            <span class="font-mono text-indigo-300">${data.black.king_notation}</span>
          </div>
          <div class="text-xs font-bold ${
            data.black.status === 'CHECKMATE' ? 'text-rose-400' :
            data.black.status === 'CHECK' ? 'text-amber-400' :
            data.black.status === 'STALEMATE' ? 'text-sky-400' : 'text-emerald-400'
          }">
            ${blackStatus}
          </div>
          <div class="text-[10px] text-slate-500 mt-1">
            ${isFa ? `حرکات مجاز: ${data.black.total_legal_moves}` : `Legal moves: ${data.black.total_legal_moves}`}
          </div>
        </div>
      </div>

      <!-- Algorithm Pipeline Card -->
      <div class="glass-card p-4 rounded-xl border border-slate-700/50">
        <h4 class="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <span>⚡</span> ${isFa ? 'خط لوله تحلیل هوشمند الگوریتم (Pipeline):' : 'Algorithm Execution Pipeline:'}
        </h4>
        <div class="space-y-3">
          ${stepsHtml}
        </div>
      </div>
    `;
  }

  resetDiagnostics() {
    const resultsContainer = document.getElementById('diagnostics-container');
    if (!resultsContainer) return;
    const isFa = this.currentLang === 'fa';
    resultsContainer.innerHTML = `
      <div class="p-6 rounded-2xl glass-card border border-slate-700/50 text-center text-slate-400">
        <div class="text-3xl mb-3">♟️</div>
        <h3 class="text-sm font-bold text-slate-300 mb-1">صفحه آماده چیدمان است</h3>
        <p class="text-xs leading-relaxed text-slate-400">
          ${isFa ? I18N.fa.dragHint : I18N.en.dragHint}
        </p>
      </div>
    `;
  }

  updateLanguageUI() {
    const dict = I18N[this.currentLang];
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'fa' ? 'rtl' : 'ltr';

    const safeSetText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };

    safeSetText('header-title', dict.appTitle);
    safeSetText('header-subtitle', dict.appSubtitle);
    safeSetText('btn-analyze-text', dict.analyzeBtn);
    safeSetText('btn-clear-text', dict.clearBoardBtn);

    const langToggleBtn = document.getElementById('btn-lang-toggle');
    if (langToggleBtn) {
      langToggleBtn.innerText = this.currentLang === 'fa' ? 'English' : 'فارسی';
    }

    if (!this.board || !this.board.analysisData) {
      this.resetDiagnostics();
    } else {
      this.renderDiagnostics(this.board.analysisData);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new CheckmateApp();
});
