<div align="center">

# ♔ CheckmateCheck

**موتور هوشمند اعتبارسنجی صفحه و تشخیص وضعیت کیش، مات و پات شطرنج**  
*Intelligent Turn-Agnostic Chess State, Validation, Check, Checkmate & Stalemate Engine*

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Unit_Tests-Passing-success?style=for-the-badge&logo=githubactions&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

[راهنمای فارسی](#-راهنمای-فارسی) • [English Documentation](#-english-documentation) • [ساختار ماژولار](#-ساختار-پروژه-architecture) • [الگوریتم و پیچیدگی](#-تشریح-الگوریتم-و-مبانی-علمی) • [راهنمای API](#-راهنمای-api-endpoints)

</div>

---

## 📖 معرفی پروژه (Project Overview)

**CheckmateCheck** یک سیستم نرم‌افزاری کاملاً **ماژولار و تفکیک‌شده (Decoupled)** است که برای حل مسئله اعتبارسنجی چیدمان دلخواه صفحه شطرنج و تشخیص وضعیت مهره‌های شاه طراحی شده است.

برخلاف موتورهای سنتی بازی شطرنج که وابسته به نوبت و تاریخچه حرکات گذشته هستند، این سیستم **فارغ از نوبت بازی (Turn-Agnostic)** عمل می‌کند. کاربر با یک صفحه خالی شطرنج شروع می‌کند، مهره‌ها را آزادانه روی صفحه می‌چیند، و با زدن دکمه **«بررسی وضعیت صفحه»**، موتور تحلیلی موارد زیر را به صورت بلادرنگ و دقیق گزارش می‌کند:
- آیا چیدمان تخته طبق قوانین رسمی فیده (FIDE) **معتبر است یا نامعتبر**؟
- وضعیت دقیق **شاه سفید** و **شاه سیاه** به تفکیک: **امن (Safe)**، **کیش (Check)**، **کیش و مات (Checkmate)**، یا **پات (Stalemate)**.
- نمایش تصویری خطوط حمله و پرتوهای تهدید (SVG Threat Rays) از مهره‌های مهاجم به شاه مورد نظر.
- استخراج تمامی گزینه‌های قانونی برای رفع کیش (فرار شاه، زدن مهره مهاجم، سد کردن خط حمله).

---

## ✨ ویژگی‌های برجسته (Key Features)

### 🧠 ۱. هسته محاسباتی پایتون (Pure Python Engine)
- **پیاده‌سازی مستقل الگوریتمی**: توسعه‌یافته بدون وابستگی به کتابخانه‌های سنگین شطرنج (مانند `python-chess` یا Stockfish)؛ کد کاملاً خوانا، ماژولار و مناسب برای ارائه و پروژه‌های دانشگاهی.
- **الگوریتم پرتوافکنی شعاعی (Ray-Casting)**: اسکن خطوط مستقیم (رخ و وزیر)، خطوط مورب (فیل و وزیر)، جهش‌های گسسته اسب ($8$ آفست) و ضربات پیاده.
- **تشخیص مهره‌های میخی (Absolute Pin Detection)**: اعتبارسنجی دقیق حرکات مهره‌های دفاعی با شبیه‌سازی حرکت و بررسی ایمنی شاه (Make/Unmake Verification).
- **قضیه کیش دوگانه (Double Check Theorem)**: در صورت حمله همزمان دو مهره به شاه، سیستم به طور خودکار گزینه‌های سد کردن و زدن مهاجم را غیرمجاز دانسته و تنها حرکت شاه را مجاز می‌شمارد.
- **اعتبارسنجی چندلایه صفحه (Board Invariants)**:
  - وجود دقیقاً یک شاه سفید و یک شاه سیاه.
  - عدم مجاورت فیزیکی دو شاه ($\max(|r_1 - r_2|, |c_1 - c_2|) > 1$).
  - ممنوعیت قرارگیری پیاده‌ها در سطر اول و هشتم.
  - بررسی قضیه عدم امکان کیش همزمان دو شاه (Mutual Check Impossibility).

### 🎨 ۲. فرانت‌اند مدرن و ارگونومیک (UI/UX Pro Max)
- **پالت مهره‌ها در بالا سمت چپ (Docked Side-Palette)**: قرارگیری پالت دو ستونه مهره‌ها در کنار تخته جهت به حداقل رساندن حرکت ماوس و افزایش ارگونومی چیدمان.
- **طراحی مسابقاتی مهره‌ها (Tournament Staunton Pro Vectors)**: مهره‌های برداری اختصاصی با گرادیان‌های نوری عاج و آبنوس، سایه‌روشن سه‌بعدی و سیلوئت کلاسیک مسابقات جهانی.
- **جابه‌جایی روان مهره‌های کاشته‌شده (Piece Repositioning)**: امکان جابه‌جا کردن مهره‌های روی صفحه با **Drag & Drop** یا با **کلیک روی مهره و کلیک روی خانه مقصد (Click-to-Move)**.
- **ابزار حذف مهره (Trash Tool)**: حذف مهره‌ها با ابزار سطل زباله یا کشیدن مهره به بیرون از صفحه.
- **لایه بصری پرتوهای تهدید (SVG Ray Tracing Overlay)**: رسم خودکار خطوط لیزری و نشانگرهای فلش قرمز و نارنجی از مهره مهاجم به شاه مورد نظر.
- **سنتز صوتی اختصاصی (Web Audio API Synthesizer)**: افکت‌های صوتی حرکتی شطرنج به صورت فرکانسی بدون نیاز به دانلود فایل‌های صوتی سنگین.
- **دو زبانه کامل (فارسی / English)**: قابلیت تغییر زبان با یک کلیک.

---

## 📁 ساختار پروژه (Architecture)

معماری پروژه به صورت تمیز و تفکیک‌شده به دو بخش Backend و Frontend تقسیم شده است:

```text
CheckmateCheck/
│
├── backend/                        # هسته پردازشی و سرور REST API پایتون
│   ├── app.py                      # سرور وب Flask و کنترلرهای اندپوینت‌ها
│   ├── requirements.txt            # پکیج‌های حداقلی پایتون (Flask >= 3.0.0)
│   ├── chess_engine/               # موتور محاسباتی شطرنج (Pure Python)
│   │   ├── __init__.py             # اکسپورت توابع و کلاس‌های اصلی
│   │   ├── constants.py            # ثابت‌های مهره‌ها، رنگ‌ها، وکتورهای جهتی
│   │   ├── board.py                # نمایش ماتریس ۸×۸، پارس FEN، تبدیل مختصات
│   │   ├── attacks.py              # الگوریتم Ray-Casting و اسکن حملات
│   │   ├── pin_detector.py         # شناسایی مهره‌های میخی و اعتبارسنجی حرکات
│   │   ├── evasions.py             # تولید حرکات گریز سه‌گانه و پات
│   │   ├── validator.py            # اعتبارسنجی هندسی و فیزیکی تخته
│   │   └── solver.py               # موتور تصمیم‌گیری عینی و استخراج گزارش
│   └── tests/
│       ├── __init__.py
│       └── test_solver.py          # ۱۰ تست خودکار سناریوهای کیش، مات، پات و خطا
│
├── frontend/                       # رابط کاربری وب مدرن (ES6 + Tailwind CSS)
│   ├── index.html                  # صفحه اصلی، کانتینر گرید و پالت
│   ├── css/
│   │   └── style.css               # استایل‌های تم چوبی مسابقاتی، انیمیشن‌های Glow
│   └── js/
│       ├── config.js               # تنظیمات API، وکتورهای Staunton Pro، دیکشنری I18N
│       ├── audio.js                # موتور سنتز کننده فرکانسی صداها
│       ├── board.js                # کنترلر تعاملی تخته، درگ و دراپ، رسم پرتوهای SVG
│       ├── api.js                  # کلاینت ارتباط با REST API پایتون
│       └── app.js                  # هماهنگ‌کننده منطق برنامه و تعاملات کاربر
│
├── run.py                          # اسکریپت ران تک‌دستوری کل پروژه
├── LICENSE                         # مجوز انتشار MIT
└── README.md                       # مستندات جامع پروژه
```

---

## 🚀 نحوه نصب و راه‌اندازی (Quickstart)

### پیش‌نیازها
- **Python 3.10** یا بالاتر
- مرورگر وب مدرن (Chrome, Firefox, Edge, Safari)

### ۱. کلون کردن مخزن
```bash
git clone https://github.com/your-username/CheckmateCheck.git
cd CheckmateCheck
```

### ۲. نصب وابستگی‌ها
پروژه از فریمورک سبک `Flask` استفاده می‌کند:
```bash
pip install -r backend/requirements.txt
```

### ۳. اجرای تک‌دستوری پروژه
فایل `run.py` سرور پایتون را استارت زده و مرورگر را به طور خودکار باز می‌کند:
```bash
python run.py
```
سپس در مرورگر خود به آدرس زیر مراجعه فرمایید:
```text
http://localhost:5000
```

---

## 🧪 اجرای تست‌های خودکار (Automated Tests)

موتور با ۱۰ تست جامع ماژولار تمامی حالات کیش، مات‌های معروف (ناپلئونی، احمقانه)، پات کلاسیک، کیش دوگانه، و انواع خطاهای چیدمان را اعتبارسنجی می‌کند:

```bash
python -m unittest backend/tests/test_solver.py
```

نمونه خروجی اجرای تست‌ها:
```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.009s

OK
```

---

## 📡 راهنمای API (Endpoints)

سرور Flask یک REST API استاندارد ارائه می‌دهد که می‌توان آن را به هر نوع فرانت‌اند دیگری نیز متصل کرد:

### ۱. بررسی سلامت سرویس
`GET /api/health`

**پاسخ:**
```json
{
  "service": "CheckmateCheck Engine API",
  "status": "healthy",
  "version": "1.0.0"
}
```

### ۲. تحلیل چیدمان تخته
`POST /api/analyze`

**نمونه بدنه درخواست (Request Body - ارسال با ماتریس یا FEN):**
```json
{
  "fen": "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR"
}
```
*یا با ماتریس زنده:*
```json
{
  "matrix": [
    [{"color": "b", "type": "R"}, null, null, null, {"color": "b", "type": "K"}, null, null, null],
    ...
  ]
}
```

**نمونه پاسخ موفقیت‌آمیز (Response Body):**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "overall_status": "CHECKMATE",
    "affected_side": "b",
    "verdict_fa": "کیش و مات! شاه سیاه مات شده است (سفید برنده است).",
    "verdict_en": "Checkmate! Black King is checkmated (White wins).",
    "summary_fa": "شاه سیاه در خانه e8 توسط وزیر در f7 کیش داده شده و هیچ حرکت قانونی ندارد.",
    "visual_threats": [
      {
        "from": [1, 5],
        "from_notation": "f7",
        "to": [0, 4],
        "to_notation": "e8",
        "threat_type": "CHECKMATE",
        "color": "#EF4444"
      }
    ],
    "white": { "status": "SAFE", "total_legal_moves": 30 },
    "black": { "status": "CHECKMATE", "total_legal_moves": 0 }
  }
}
```

---

## 🔬 تشریح الگوریتم و مبانی علمی (Mathematical Foundation)

### ۱. مدل‌سازی ریاضی تخته شطرنج
صفحه شطرنج به عنوان یک ماتریس دوبعدی متناهی مدلسازی می‌شود:
$$\mathcal{M} \in \left( \mathcal{P} \cup \{\emptyset\} \right)^{8 \times 8}$$
که در آن $\mathcal{P} = \{ (\text{color}, \text{type}) \mid \text{color} \in \{w, b\}, \text{type} \in \{K, Q, R, B, N, P\} \}$.

### ۲. الگوریتم ردیابی پرتو (Ray Tracing)
برای شناسایی تهدیدات روی هر شاه در مختصات $(r_k, c_k)$، پرتوها در ۸ جهت خطی و مورب گسیل می‌شوند:
$$p_{t+1} = p_t + \vec{d}, \quad \vec{d} \in D_{\text{ortho}} \cup D_{\text{diag}}$$
پرتو تا رسیدن به اولین مانع یا مرز صفحه ادامه می‌یابد. در صورت برخورد با مهره دشمن متناسب با آن جهت (مانند رخ/وزیر در جهات مستقیم یا فیل/وزیر در جهات مورب)، بردار پرتو حمله ذخیره می‌گردد.

### ۳. الگوریتم تصمیم‌گیری وضعیت شاه
برای هر شاه، فرآیند گریز سه‌گانه بررسی می‌شود:
$$\mathcal{E} = \mathcal{K}_{\text{moves}} \cup \mathcal{C}_{\text{attacker}} \cup \mathcal{B}_{\text{ray}}$$
- $\mathcal{K}_{\text{moves}}$: گام فیزیکی شاه به خانه‌های امن مجاور.
- $\mathcal{C}_{\text{attacker}}$: حذف مهره مهاجم توسط سایر مهره‌ها (با شرط عدم میخی بودن مهره خودی).
- $\mathcal{B}_{\text{ray}}$: مسدودسازی خط آتش با قرار گرفتن مهره خودی در مسیر پرتو حمله (فقط در حملات دوربرد منفرد).

اگر $|\mathcal{E}| = 0$ و شاه در کیش باشد $\implies$ **کیش و مات (Checkmate)**.  
اگر شاه در کیش نباشد و تعداد کل حرکات مجاز آن سمت برابر با صفر باشد $\implies$ **پات (Stalemate)**.

### ۴. تحلیل پیچیدگی محاسباتی (Computational Complexity)
- **پیچیدگی زمانی (Time Complexity):** صفحه شطرنج دارای اندازه ثابت ۶۴ خانه است. حداکثر ۶۴ گام پرتو، ۱۶ جهش اسب و پیاده و حداکثر ۱۶ مهره خودی برای اعتبارسنجی حرکات بررسی می‌شوند. بنابراین پیچیدگی زمانی الگوریتم قطعی و برابر با **$\mathcal{O}(1)$** است (زمان اجرای واقعی در پایتون کمتر از ۱ میلی‌ثانیه).
- **پیچیدگی فضایی (Space Complexity):** حافظه مصرفی برای نگهداری تخته و پشته پرتوها ثابت و **$\mathcal{O}(1)$** است.

---

## 🌐 English Documentation

### Overview
**CheckmateCheck** is a modular, decoupled full-stack application for arbitrary chess board validation, check, checkmate, and stalemate detection. It is designed to be completely **turn-agnostic**, evaluating the static physical board objectively to determine the state of both kings simultaneously without needing move history.

### Tech Stack
- **Backend:** Python 3.10+, Flask REST API, Custom Pure Python Chess Rules Engine.
- **Frontend:** Vanilla ES6 Javascript, HTML5 Drag & Drop, Tailwind CSS, SVG Ray Tracing Overlay, Web Audio Procedural Synthesizer.

### Key Capabilities
1. **Turn-Agnostic Solver:** Detects which King is in danger, checks legal evasions (King moves, capturing attackers, interposing attack rays), and classifies the state into `SAFE`, `CHECK`, `CHECKMATE`, or `STALEMATE`.
2. **Physical Board Invariants:** Enforces single King per side, Chebyshev distance between Kings $> 1$, pawn rank restrictions ($P \notin \text{Rank}_1 \cup \text{Rank}_8$), and mutual check impossibility.
3. **Ergonomic Side-Docked Palette:** Piece palette positioned at the top-left of the board to minimize mouse trajectory.
4. **Interactive Piece Repositioning:** Placed pieces can be dragged across squares or moved via click-to-move. Dragging off the board deletes the piece.
5. **Staunton Tournament Pro Vectors:** Realistic layered SVG pieces with porcelain/ebony gradients and sharp tournament silhouettes.

---

## 📄 مجوز انتشار (License)

این پروژه تحت مجوز **[MIT License](LICENSE)** منتشر شده است و استفاده از آن برای اهداف آموزشی، دانشگاهی و تجاری آزاد است.

---

<div align="center">
  <sub>طراحی و توسعه‌یافته با ❤️ برای علاقه‌مندان به شطرنج و مهندسی نرم‌افزار</sub>
</div>
