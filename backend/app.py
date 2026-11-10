"""
Flask API Server for CheckmateCheck
CheckmateCheck - Academic Chess Analyzer
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from backend.chess_engine import (
    ChessBoard, Piece, analyze_board_state,
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN
)

# Determine paths for static frontend serving
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR)

# CORS Header Middleware (no external package needed)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


EDUCATIONAL_PRESETS = [
    {
        "id": "scholars_mate",
        "title_fa": "مات ناپلئونی (Scholar's Mate)",
        "title_en": "Scholar's Mate",
        "description_fa": "کیش و مات معروف در ۴ حرکت؛ حمله هماهنگ وزیر سفید در f7 با حمایت فیل در c4 روی شاه سیاه.",
        "description_en": "Famous 4-move mate by Queen on f7 supported by Bishop on c4.",
        "fen": "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR"
    },
    {
        "id": "fools_mate",
        "title_fa": "مات احمقانه (Fool's Mate)",
        "title_en": "Fool's Mate",
        "description_fa": "سریع‌ترین مات ممکن در شطرنج (حرکت ۲)؛ وزیر سیاه از h4 به شاه سفید حمله کرده و پیاده‌های سفید قطر e1-h4 را باز گذاشته‌اند.",
        "description_en": "Fastest possible chess checkmate in 2 moves by Black Queen on h4.",
        "fen": "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR"
    },
    {
        "id": "back_rank_mate",
        "title_fa": "مات عرض آخر (Back-Rank Mate)",
        "title_en": "Back-Rank Mate",
        "description_fa": "رخ سفید در d8 به شاه سیاه در عرض ۸ کیش می‌دهد در حالی که شاه پشت پیاده‌های خودی محبوس است.",
        "description_en": "White Rook on d8 mates Black King trapped behind its own pawns.",
        "fen": "3R2k1/5ppp/8/8/8/8/5PPP/6K1"
    },
    {
        "id": "smothered_mate",
        "title_fa": "مات مختنق (Smothered Mate)",
        "title_en": "Smothered Mate",
        "description_fa": "شاه سیاه در گوشه صفحه در محاصره کامل مهره‌های خودی است و اسب سفید در f7 ضربه نهایی مات را وارد می‌کند.",
        "description_en": "Black King suffocated by its own pieces and checkmated by White Knight on f7.",
        "fen": "6rk/5Npp/8/8/8/8/8/4K3"
    },
    {
        "id": "classic_stalemate",
        "title_fa": "موقعیت پات کلاسیک (Classic Stalemate)",
        "title_en": "Classic Stalemate",
        "description_fa": "شاه سیاه در a8 در کیش نیست اما هیچ حرکت قانونی ندارد. نتیجه: مساوی قطعی (پات).",
        "description_en": "Black King at a8 is not in check, but has 0 legal moves. Result: Draw by Stalemate.",
        "fen": "k7/2K5/1Q6/8/8/8/8/8"
    },
    {
        "id": "double_check",
        "title_fa": "کیش دوگانه (Double Check)",
        "title_en": "Double Check Dilemma",
        "description_fa": "شاه سیاه همزمان از دو جهت توسط رخ سفید و اسب سفید کیش خورده است؛ سد کردن ممکن نیست و شاه مجبور به فرار است.",
        "description_en": "Black King checked simultaneously by Rook and Knight. Blocking is impossible; King must flee.",
        "fen": "4k3/8/3N4/7b/8/8/8/4R1K1"
    },
    {
        "id": "check_with_defenses",
        "title_fa": "کیش قابل دفاع (Check with Defenses)",
        "title_en": "Defensible Check",
        "description_fa": "وزیر سیاه به شاه سفید کیش داده اما سفید می‌تواند با زدن وزیر یا سد کردن مسیر دفاع کند.",
        "description_en": "Black Queen gives check, but White can capture or block.",
        "fen": "rnb1k1nr/pppp1ppp/8/4p3/1b1P4/2N5/PPP1PPPP/R1BQKBNR"
    },
    {
        "id": "invalid_mutual_check",
        "title_fa": "صفحه نامعتبر: کیش متقابل",
        "title_en": "Invalid: Mutual Check",
        "description_fa": "هر دو شاه به صورت همزمان در کیش هستند؛ چنین وضعیتی در شطرنج استاندارد غیرممکن است.",
        "description_en": "Both kings in check simultaneously (physically impossible in standard chess).",
        "fen": "r3k2r/8/8/8/8/8/8/R3K2R"  # modified in preset loader or custom
    },
    {
        "id": "standard_start",
        "title_fa": "چیدمان شروع استاندارد (Standard Start)",
        "title_en": "Standard Initial Position",
        "description_fa": "چیدمان اولیه مسابقات شطرنج با تمام ۳۲ مهره در جایگاه استاندارد.",
        "description_en": "Standard 32-piece tournament opening configuration.",
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    }
]


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "CheckmateCheck Engine API",
        "version": "1.0.0"
    })


@app.route("/api/presets", methods=["GET"])
def get_presets():
    return jsonify({
        "success": True,
        "presets": EDUCATIONAL_PRESETS
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}

    try:
        if "matrix" in data and data["matrix"] is not None:
            board = ChessBoard.from_matrix_dict(data["matrix"])
        elif "fen" in data and data["fen"]:
            board = ChessBoard.from_fen_board(data["fen"])
        else:
            return jsonify({
                "success": False,
                "error": "Missing 'matrix' or 'fen' payload in request body."
            }), 400

        result = analyze_board_state(board)
        return jsonify({
            "success": True,
            "data": result,
            "fen": board.to_fen_board()
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# Frontend Static Files Serving
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"CheckmateCheck Backend API running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
