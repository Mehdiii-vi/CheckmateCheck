/**
 * CheckmateCheck - Interactive Academic Presentation Slides
 * Designed for University Presentation & Algorithm Defense
 */

const ACADEMIC_SLIDES = [
  {
    id: 1,
    title_fa: "تعریف مسئله و مدل‌سازی ریاضی صفحه شطرنج",
    title_en: "Problem Definition & Mathematical Board Modeling",
    subtitle_fa: "تحلیل بدون نوبت (Turn-Agnostic State Analysis) در فضای متناهی $8 \\times 8$",
    subtitle_en: "Turn-Agnostic State Analysis in Finite $8 \\times 8$ Grid",
    content_fa: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div class="glass-card p-4 rounded-xl border border-indigo-500/30">
          <h4 class="text-indigo-400 font-bold mb-2 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> بازنمایی ساختار داده
          </h4>
          <p class="text-slate-300 text-sm leading-relaxed mb-3">
            صفحه شطرنج به عنوان یک ماتریس دوبعدی $M \\in (\\mathcal{P} \\cup \\{\\emptyset\\})^{8 \\times 8}$ تعریف می‌شود که در آن هر خانه شامل نوع مهره $\\tau \\in \\{K, Q, R, B, N, P\\}$ و رنگ $c \\in \\{w, b\\}$ است.
          </p>
          <div class="bg-slate-900/80 p-3 rounded-lg font-mono text-xs text-indigo-300">
            Coordinates: (r, c) &harr; rank = 8 - r, file = chr(97 + c)
          </div>
        </div>

        <div class="glass-card p-4 rounded-xl border border-amber-500/30">
          <h4 class="text-amber-400 font-bold mb-2 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> چالش تحلیل بدون نوبت (Turn-Agnostic)
          </h4>
          <p class="text-slate-300 text-sm leading-relaxed">
            برخلاف موتورهای سنتی که به نوبت بازیکن وابسته هستند، این الگوریتم وضعیت تخته را به صورت <strong>عینی (Objective)</strong> پردازش می‌کند. سیستم موقعیت هر دو شاه را به شکل مستقل و توأم ارزیابی کرده و وضعیت نهایی را کشف می‌نماید.
          </p>
        </div>
      </div>
      <div class="bg-indigo-950/40 border border-indigo-500/20 p-4 rounded-xl text-xs text-slate-300">
        <strong>کاربرد علمی:</strong> ارزیابی مسائل پازل شطرنج (Chess Puzzles)، تشخیص خودکار پایان بازی در دوربین‌های هوشمند شطرنج، و اعتبارسنجی داده‌های یادگیری ماشین.
      </div>
    `,
    content_en: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div class="glass-card p-4 rounded-xl border border-indigo-500/30">
          <h4 class="text-indigo-400 font-bold mb-2">Data Structure Representation</h4>
          <p class="text-slate-300 text-sm leading-relaxed mb-3">
            The board is modeled as a 2D matrix $M \\in (\\mathcal{P} \\cup \\{\\emptyset\\})^{8 \\times 8}$, mapping squares to piece tuples (color, type).
          </p>
          <div class="bg-slate-900/80 p-3 rounded-lg font-mono text-xs text-indigo-300">
            Mapping: (r, c) &harr; rank = 8 - r, file = chr(97 + c)
          </div>
        </div>

        <div class="glass-card p-4 rounded-xl border border-amber-500/30">
          <h4 class="text-amber-400 font-bold mb-2">Turn-Agnostic Paradigm</h4>
          <p class="text-slate-300 text-sm leading-relaxed">
            Unlike game-playing engines, this analyzer evaluates the static state objectively without assuming whose turn it is, evaluating both sides simultaneously.
          </p>
        </div>
      </div>
    `
  },
  {
    id: 2,
    title_fa: "الگوریتم پرتوافکنی شعاعی (Ray-Casting Attack Detection)",
    title_en: "Ray-Casting & Discrete Vector Attack Detection",
    subtitle_fa: "ردیابی خطوط آتش مهره‌های لغزنده و جهش‌های گسسته اسب و پیاده",
    subtitle_en: "Sliding piece ray-tracing and discrete leap verifications",
    content_fa: `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div class="glass-card p-4 rounded-xl border border-rose-500/30">
          <h5 class="text-rose-400 font-bold text-sm mb-2">۱. پرتوهای مستقیم (رخ و وزیر)</h5>
          <p class="text-xs text-slate-300 mb-2">
            حرکت در ۴ بردار متعامد:
          </p>
          <code class="text-xs bg-slate-900 px-2 py-1 rounded block text-rose-300 font-mono">
            D_ortho = {(0,1), (0,-1), (1,0), (-1,0)}
          </code>
          <p class="text-xs text-slate-400 mt-2">
            پرتو تا مرز صفحه یا برخورد با اولین مهره ادامه می‌یابد.
          </p>
        </div>

        <div class="glass-card p-4 rounded-xl border border-purple-500/30">
          <h5 class="text-purple-400 font-bold text-sm mb-2">۲. پرتوهای مورب (فیل و وزیر)</h5>
          <p class="text-xs text-slate-300 mb-2">
            حرکت در ۴ بردار قطری:
          </p>
          <code class="text-xs bg-slate-900 px-2 py-1 rounded block text-purple-300 font-mono">
            D_diag = {(&plusmn;1, &plusmn;1)}
          </code>
          <p class="text-xs text-slate-400 mt-2">
            شناسایی حملات قطری با پیچیدگی حداکثر ۷ گام در هر پرتو.
          </p>
        </div>

        <div class="glass-card p-4 rounded-xl border border-cyan-500/30">
          <h5 class="text-cyan-400 font-bold text-sm mb-2">۳. جهش‌های گسسته (اسب و پیاده)</h5>
          <p class="text-xs text-slate-300 mb-2">
            بررسی ۸ آفست گسسته اسب:
          </p>
          <code class="text-xs bg-slate-900 px-2 py-1 rounded block text-cyan-300 font-mono">
            &Delta;_N = {(&plusmn;1, &plusmn;2), (&plusmn;2, &plusmn;1)}
          </code>
          <p class="text-xs text-slate-400 mt-2">
            اسب توانایی عبور از روی مهره‌ها را دارد و قابل سد کردن نیست.
          </p>
        </div>
      </div>
      <div class="bg-slate-900/70 p-4 rounded-xl border border-slate-700 text-xs text-slate-300">
        <strong>محاسبه بردار ضربه (Attack Ray):</strong> در صورت کشف حمله توسط مهره‌های لغزنده، مختصات تمام خانه‌های میانی در قالب یک آرایه ذخیره می‌شود تا در مرحله بعد برای سد کردن کیش بررسی گردد.
      </div>
    `,
    content_en: `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div class="glass-card p-4 rounded-xl border border-rose-500/30">
          <h5 class="text-rose-400 font-bold text-sm mb-2">1. Orthogonal Rays</h5>
          <p class="text-xs text-slate-300">Rook & Queen directional rays in 4 compass directions.</p>
        </div>
        <div class="glass-card p-4 rounded-xl border border-purple-500/30">
          <h5 class="text-purple-400 font-bold text-sm mb-2">2. Diagonal Rays</h5>
          <p class="text-xs text-slate-300">Bishop & Queen diagonal rays in 4 diagonal directions.</p>
        </div>
        <div class="glass-card p-4 rounded-xl border border-cyan-500/30">
          <h5 class="text-cyan-400 font-bold text-sm mb-2">3. Discrete Leaps</h5>
          <p class="text-xs text-slate-300">Knight leaps and pawn forward diagonal captures.</p>
        </div>
      </div>
    `
  },
  {
    id: 3,
    title_fa: "مثلث رفع کیش و تمایز کیش و مات از پات",
    title_en: "Evasion Triangle & Checkmate vs. Stalemate Calculus",
    subtitle_fa: "قضیه گریز سه‌گانه: فرار، حذف مهاجم، سد کردن خط حمله",
    subtitle_en: "The Threefold Evasion Theorem & Double Check Principle",
    content_fa: `
      <div class="my-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
            <div class="text-emerald-400 font-black text-2xl mb-1">۱. فرار شاه</div>
            <div class="text-xs text-slate-300">انتقال شاه به یکی از ۸ خانه مجاور که تحت کنترل دشمن نباشد.</div>
          </div>
          <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 text-center">
            <div class="text-blue-400 font-black text-2xl mb-1">۲. حذف مهاجم</div>
            <div class="text-xs text-slate-300">زدن مهره مهاجم توسط مهره‌های خودی (با رعایت عدم میخی بودن).</div>
          </div>
          <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-center">
            <div class="text-amber-400 font-black text-2xl mb-1">۳. سد کردن مسیر</div>
            <div class="text-xs text-slate-300">قرار دادن مهره خودی در یکی از خانه‌های پرتو حمله (فقط حملات دوربرد).</div>
          </div>
        </div>

        <div class="glass-card p-4 rounded-xl border border-red-500/30">
          <h5 class="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
            <span class="px-2 py-0.5 bg-red-500/20 rounded text-red-300 text-xs">قضیه کیش دوگانه (Double Check)</span>
          </h5>
          <p class="text-xs text-slate-300 leading-relaxed">
            اگر تعداد مهره‌های مهاجم به شاه $\\ge 2$ باشد، هیچ مهره‌ای قادر نیست هر دو خط حمله را همزمان مسدود کند یا دو مهره را همزمان بزند. بنابراین گزینه‌های ۲ و ۳ باطل شده و <strong>تنها راه نجات، حرکت فیزیکی خود شاه است</strong>.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-3 rounded-lg bg-red-950/40 border border-red-500/20">
            <strong class="text-red-400 block mb-1">کیش و مات (Checkmate):</strong>
            شاه در کیش است و مجموع راه‌های گریز برابر با صفر می‌باشد: $\\text{InCheck} = \\text{True} \\land |\\text{Evasions}| = 0$
          </div>
          <div class="p-3 rounded-lg bg-sky-950/40 border border-sky-500/20">
            <strong class="text-sky-400 block mb-1">پات (Stalemate):</strong>
            شاه در کیش نیست اما هیچ حرکت مجاز قانونی برای آن سمت وجود ندارد: $\\text{InCheck} = \\text{False} \\land |\\text{LegalMoves}| = 0$
          </div>
        </div>
      </div>
    `,
    content_en: `
      <div class="my-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
            <div class="text-emerald-400 font-bold text-lg mb-1">1. King Step</div>
            <div class="text-xs text-slate-300">King steps to safe adjacent square.</div>
          </div>
          <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 text-center">
            <div class="text-blue-400 font-bold text-lg mb-1">2. Capture Attacker</div>
            <div class="text-xs text-slate-300">Friendly piece captures the checking piece.</div>
          </div>
          <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-center">
            <div class="text-amber-400 font-bold text-lg mb-1">3. Interposition (Block)</div>
            <div class="text-xs text-slate-300">Friendly piece moves into the ray of attack.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 4,
    title_fa: "اعتبارسنجی چیدمان و حالت‌های ناممکن فیزیکی در شطرنج",
    title_en: "Board Validation & Physical Invariants in Chess",
    subtitle_fa: "فیلتر موقعیت‌های غیرقابل دسترس بر اساس قوانین FIDE",
    subtitle_en: "Filtering mathematically unreachable game positions",
    content_fa: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div class="glass-card p-4 rounded-xl border border-red-500/30">
          <h5 class="text-red-400 font-bold text-sm mb-2">۱. قضیه کیش متقابل (Mutual Check Impossibility)</h5>
          <p class="text-xs text-slate-300 leading-relaxed">
            در بازی شطرنج، غیرممکن است هر دو شاه سفید و سیاه به طور همزمان در وضعیت کیش قرار داشته باشند. زیرا بازیکنی که حرکت قبلی را انجام داده، در صورت وجود کیش روی شاه خود، حرکتی غیرقانونی مرتکب شده است. سیستم چنین حالاتی را <strong>غیرمعتبر (Invalid)</strong> رد می‌کند.
          </p>
        </div>

        <div class="glass-card p-4 rounded-xl border border-orange-500/30">
          <h5 class="text-orange-400 font-bold text-sm mb-2">۲. تقابل شاه‌ها (Adjacent Kings Invariant)</h5>
          <p class="text-xs text-slate-300 leading-relaxed">
            دو شاه هرگز نمی‌توانند در خانه‌های مجاور قرار گیرند:
          </p>
          <code class="text-xs bg-slate-900 px-2 py-1 rounded block text-amber-300 font-mono my-1">
            \\max(|r_1 - r_2|, |c_1 - c_2|) > 1
          </code>
          <p class="text-xs text-slate-400">
            زیرا هر شاه خانه کناری را مورد حمله قرار می‌دهد و حرکت به خانه مورد حمله حریف غیرمجاز است.
          </p>
        </div>

        <div class="glass-card p-4 rounded-xl border border-yellow-500/30">
          <h5 class="text-yellow-400 font-bold text-sm mb-2">۳. قید سطرهای انتهایی پیاده‌ها</h5>
          <p class="text-xs text-slate-300 leading-relaxed">
            پیاده‌ها نمی‌توانند در سطر ۱ یا ۸ قرار گیرند. پیاده در سطر ۸ باید بلافاصله ارتقا (Promote) یابد و در سطر ۱ نیز هیچ پیاده‌ای شروع نمی‌کند.
          </p>
        </div>

        <div class="glass-card p-4 rounded-xl border border-emerald-500/30">
          <h5 class="text-emerald-400 font-bold text-sm mb-2">۴. تعداد شاه‌های منفرد</h5>
          <p class="text-xs text-slate-300 leading-relaxed">
            صفحه باید دقیقاً دارای یک شاه سفید و یک شاه سیاه باشد. عدم وجود شاه یا وجود چند شاه منجر به رد فوری صفحه می‌شود.
          </p>
        </div>
      </div>
    `,
    content_en: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div class="glass-card p-4 rounded-xl border border-red-500/30">
          <h5 class="text-red-400 font-bold text-sm mb-2">1. Mutual Check Impossibility</h5>
          <p class="text-xs text-slate-300">Both kings cannot be in check simultaneously in legal chess play.</p>
        </div>
        <div class="glass-card p-4 rounded-xl border border-orange-500/30">
          <h5 class="text-orange-400 font-bold text-sm mb-2">2. Kings Distance</h5>
          <p class="text-xs text-slate-300">Kings must maintain a Chebyshev distance > 1.</p>
        </div>
      </div>
    `
  },
  {
    id: 5,
    title_fa: "تحلیل پیچیدگی محاسباتی و معماری سیستم",
    title_en: "Computational Complexity & Benchmark Analysis",
    subtitle_fa: "زمان اجرای قطعی $O(1)$ و پاسخ‌دهی بلادرنگ زیر ۱۰ میلی‌ثانیه",
    subtitle_en: "Deterministic $O(1)$ constant time complexity",
    content_fa: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div class="glass-card p-5 rounded-xl border border-emerald-500/30">
          <h4 class="text-emerald-400 font-bold text-base mb-3">پیچیدگی زمانی و حافظه</h4>
          <ul class="text-xs text-slate-300 space-y-2.5">
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">&check;</span>
              <div><strong>فضای حافظه $O(1)$:</strong> ماتریس ثابت ۸×۸، مستقل از تعداد مهره‌ها.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">&check;</span>
              <div><strong>زمان اجرا $O(1)$:</strong> حداکثر ۶۴ پرتو مستقیم و مورب، ۱۶ آفست اسب و پیاده. تعداد محاسبات به یک حد بالای ثابت محدود است.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">&check;</span>
              <div><strong>بنچ‌مارک واقعی پایتون:</strong> اجرای کامل ارزیابی و استخراج پرتوها در کمتر از <strong>۰.۰۰۱ ثانیه</strong> (۱ میلی‌ثانیه).</div>
            </li>
          </ul>
        </div>

        <div class="glass-card p-5 rounded-xl border border-indigo-500/30">
          <h4 class="text-indigo-400 font-bold text-base mb-3">معماری تفکیک‌شده (Decoupled Architecture)</h4>
          <div class="space-y-2 text-xs text-slate-300">
            <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
              <span class="text-indigo-400 font-bold">Backend (Python):</span>
              Flask REST API + موتور اختصاصی بدون کتابخانه‌های بیرونی
            </div>
            <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
              <span class="text-cyan-400 font-bold">Frontend (Modern Web):</span>
              Reactive ES6 + SVG Ray Overlay + Web Audio Synthesizer
            </div>
            <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
              <span class="text-amber-400 font-bold">Communication:</span>
              JSON API Payload با پشتیبانی کامل از FEN و ماتریس زنده
            </div>
          </div>
        </div>
      </div>
      <div class="p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-xl text-center text-xs text-indigo-300 font-medium">
        پروژه CheckmateCheck آماده ارائه در کنفرانس‌ها، پروژه‌های کارشناسی و کارشناسی ارشد مهندسی نرم‌افزار و هوش مصنوعی.
      </div>
    `,
    content_en: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div class="glass-card p-5 rounded-xl border border-emerald-500/30">
          <h4 class="text-emerald-400 font-bold text-base mb-3">Complexity Bounds</h4>
          <p class="text-xs text-slate-300">Spatial and temporal complexities are deterministic $O(1)$ due to the constant 64-square domain.</p>
        </div>
      </div>
    `
  }
];

class SlideDeck {
  constructor() {
    this.currentIndex = 0;
    this.slides = ACADEMIC_SLIDES;
    this.lang = 'fa';
  }

  setLang(lang) {
    this.lang = lang;
    this.render();
  }

  open() {
    const modal = document.getElementById('slides-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.render();
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    const modal = document.getElementById('slides-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.render();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }

  goTo(idx) {
    if (idx >= 0 && idx < this.slides.length) {
      this.currentIndex = idx;
      this.render();
    }
  }

  render() {
    const slide = this.slides[this.currentIndex];
    const container = document.getElementById('slide-content-container');
    const titleEl = document.getElementById('slide-title');
    const subtitleEl = document.getElementById('slide-subtitle');
    const counterEl = document.getElementById('slide-counter');
    const dotsContainer = document.getElementById('slide-dots');

    if (!container) return;

    if (titleEl) titleEl.innerHTML = this.lang === 'fa' ? slide.title_fa : slide.title_en;
    if (subtitleEl) subtitleEl.innerHTML = this.lang === 'fa' ? slide.subtitle_fa : slide.subtitle_en;
    if (counterEl) counterEl.innerText = `${this.currentIndex + 1} / ${this.slides.length}`;

    container.innerHTML = this.lang === 'fa' ? slide.content_fa : slide.content_en;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      this.slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-all ${
          idx === this.currentIndex ? 'bg-indigo-500 w-8' : 'bg-slate-700 hover:bg-slate-500'
        }`;
        dot.onclick = () => this.goTo(idx);
        dotsContainer.appendChild(dot);
      });
    }
  }
}

window.slideDeck = new SlideDeck();

// Keyboard arrows navigation for presentation mode
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('slides-modal');
  if (modal && !modal.classList.contains('hidden')) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      // In RTL (fa), right is previous, left is next, or vice versa
      window.slideDeck.next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      window.slideDeck.prev();
    } else if (e.key === 'Escape') {
      window.slideDeck.close();
    }
  }
});
