"""
Master Chess State Analyzer & Solver
CheckmateCheck - Academic Chess Analyzer
"""

from typing import Dict, Any, List, Optional
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    STATUS_SAFE, STATUS_CHECK, STATUS_CHECKMATE, STATUS_STALEMATE,
    STATUS_LABELS_FA, STATUS_LABELS_EN,
    PIECE_NAMES_FA, PIECE_NAMES_EN, COLOR_NAMES_FA, COLOR_NAMES_EN
)
from .board import ChessBoard, to_notation
from .attacks import get_attackers_on_square
from .evasions import analyze_check_evasions, get_all_legal_moves_for_color
from .pin_detector import find_pinned_pieces
from .validator import validate_board

def analyze_board_state(board: ChessBoard) -> Dict[str, Any]:
    """
    Main analysis function.
    Evaluates the board objectively without requiring turn input:
    1. Validates board geometry and piece rules.
    2. Determines White King status (SAFE, CHECK, CHECKMATE, STALEMATE).
    3. Determines Black King status (SAFE, CHECK, CHECKMATE, STALEMATE).
    4. Formulates bilingual academic conclusions and visual rays for UI rendering.
    """
    # Step 1: Validation
    validation = validate_board(board)
    if not validation["is_valid"]:
        return {
            "is_valid": False,
            "validation": validation,
            "verdict_fa": "صفحه شطرنج نامعتبر است.",
            "verdict_en": "Board configuration is invalid.",
            "summary_fa": " | ".join(validation["errors_fa"]),
            "summary_en": " | ".join(validation["errors_en"]),
            "affected_side": None,
            "overall_status": "INVALID",
            "white": None,
            "black": None,
            "visual_threats": [],
            "algorithm_steps": [
                {
                    "step": 1,
                    "title_fa": "اعتبارسنجی چیدمان تخته",
                    "title_en": "Board Validation",
                    "status": "FAILED",
                    "description_fa": "چیدمان با قوانین پایه شطرنج مطابقت ندارد: " + " - ".join(validation["errors_fa"]),
                    "description_en": "Configuration violates standard chess laws."
                }
            ]
        }

    wk_r, wk_c = validation["white_king_pos"]
    bk_r, bk_c = validation["black_king_pos"]
    wk_not = validation["white_king_notation"]
    bk_not = validation["black_king_notation"]

    # Step 2: Analyze White King
    white_attackers = get_attackers_on_square(board, wk_r, wk_c, BLACK)
    white_evasions = analyze_check_evasions(board, wk_r, wk_c, WHITE, white_attackers)
    white_all_legal = get_all_legal_moves_for_color(board, WHITE)
    white_pinned = find_pinned_pieces(board, wk_r, wk_c, WHITE)

    if len(white_attackers) > 0:
        if white_evasions["total_evasions_count"] == 0:
            white_status = STATUS_CHECKMATE
        else:
            white_status = STATUS_CHECK
    else:
        if len(white_all_legal) == 0:
            white_status = STATUS_STALEMATE
        else:
            white_status = STATUS_SAFE

    # Step 3: Analyze Black King
    black_attackers = get_attackers_on_square(board, bk_r, bk_c, WHITE)
    black_evasions = analyze_check_evasions(board, bk_r, bk_c, BLACK, black_attackers)
    black_all_legal = get_all_legal_moves_for_color(board, BLACK)
    black_pinned = find_pinned_pieces(board, bk_r, bk_c, BLACK)

    if len(black_attackers) > 0:
        if black_evasions["total_evasions_count"] == 0:
            black_status = STATUS_CHECKMATE
        else:
            black_status = STATUS_CHECK
    else:
        if len(black_all_legal) == 0:
            black_status = STATUS_STALEMATE
        else:
            black_status = STATUS_SAFE

    # Step 4: Visual Threats Collection for Frontend SVG Rendering
    visual_threats = []
    # Add White attackers targeting White King
    for att in white_attackers:
        visual_threats.append({
            "from": att["from"],
            "from_notation": att["from_notation"],
            "to": [wk_r, wk_c],
            "to_notation": wk_not,
            "ray_squares": att["ray_squares"],
            "attacker_piece": att["piece"],
            "threat_type": "CHECKMATE" if white_status == STATUS_CHECKMATE else "CHECK",
            "color": "#EF4444" if white_status == STATUS_CHECKMATE else "#F59E0B"
        })

    # Add Black attackers targeting Black King
    for att in black_attackers:
        visual_threats.append({
            "from": att["from"],
            "from_notation": att["from_notation"],
            "to": [bk_r, bk_c],
            "to_notation": bk_not,
            "ray_squares": att["ray_squares"],
            "attacker_piece": att["piece"],
            "threat_type": "CHECKMATE" if black_status == STATUS_CHECKMATE else "CHECK",
            "color": "#EF4444" if black_status == STATUS_CHECKMATE else "#F59E0B"
        })

    # Step 5: Overall Verdict & Academic Summary
    affected_side = None
    overall_status = STATUS_SAFE
    verdict_fa = ""
    verdict_en = ""
    summary_fa = ""
    summary_en = ""

    if white_status == STATUS_CHECKMATE:
        overall_status = STATUS_CHECKMATE
        affected_side = WHITE
        verdict_fa = "کیش و مات! شاه سفید مات شده است (سیاه برنده است)."
        verdict_en = "Checkmate! White King is checkmated (Black wins)."
        att_names = ", ".join([f"{PIECE_NAMES_FA[a['piece']['type']]} در {a['from_notation']}" for a in white_attackers])
        summary_fa = f"شاه سفید در خانه {wk_not} توسط {att_names} کیش داده شده و هیچ حرکت قانونی برای فرار، زدن مهره یا سد کردن مسیر وجود ندارد."
        summary_en = f"White King on {wk_not} is checkmated by {len(white_attackers)} attacker(s). No legal evasions exist."

    elif black_status == STATUS_CHECKMATE:
        overall_status = STATUS_CHECKMATE
        affected_side = BLACK
        verdict_fa = "کیش و مات! شاه سیاه مات شده است (سفید برنده است)."
        verdict_en = "Checkmate! Black King is checkmated (White wins)."
        att_names = ", ".join([f"{PIECE_NAMES_FA[a['piece']['type']]} در {a['from_notation']}" for a in black_attackers])
        summary_fa = f"شاه سیاه در خانه {bk_not} توسط {att_names} کیش داده شده و هیچ حرکت قانونی برای فرار، زدن مهره یا سد کردن مسیر وجود ندارد."
        summary_en = f"Black King on {bk_not} is checkmated by {len(black_attackers)} attacker(s). No legal evasions exist."

    elif white_status == STATUS_CHECK:
        overall_status = STATUS_CHECK
        affected_side = WHITE
        verdict_fa = "شاه سفید در وضعیت کیش قرار دارد."
        verdict_en = "White King is in check."
        att_names = ", ".join([f"{PIECE_NAMES_FA[a['piece']['type']]} در {a['from_notation']}" for a in white_attackers])
        summary_fa = f"شاه سفید در خانه {wk_not} توسط {att_names} تحت حمله است. تعداد {white_evasions['total_evasions_count']} حرکت قانونی برای رفع کیش وجود دارد."
        summary_en = f"White King on {wk_not} is attacked by {att_names}. {white_evasions['total_evasions_count']} legal evasions available."

    elif black_status == STATUS_CHECK:
        overall_status = STATUS_CHECK
        affected_side = BLACK
        verdict_fa = "شاه سیاه در وضعیت کیش قرار دارد."
        verdict_en = "Black King is in check."
        att_names = ", ".join([f"{PIECE_NAMES_FA[a['piece']['type']]} در {a['from_notation']}" for a in black_attackers])
        summary_fa = f"شاه سیاه در خانه {bk_not} توسط {att_names} تحت حمله است. تعداد {black_evasions['total_evasions_count']} حرکت قانونی برای رفع کیش وجود دارد."
        summary_en = f"Black King on {bk_not} is attacked by {att_names}. {black_evasions['total_evasions_count']} legal evasions available."

    elif white_status == STATUS_STALEMATE:
        overall_status = STATUS_STALEMATE
        affected_side = WHITE
        verdict_fa = "موقعیت پات (Stalemate) برای سفید!"
        verdict_en = "Stalemate for White!"
        summary_fa = f"شاه سفید در کیش نیست، اما سفید هیچ حرکت قانونی در صفحه ندارد. اگر نوبت سفید باشد، بازی مساوی است."
        summary_en = "White is not in check, but has 0 legal moves. If it's White's turn, it's a draw."

    elif black_status == STATUS_STALEMATE:
        overall_status = STATUS_STALEMATE
        affected_side = BLACK
        verdict_fa = "موقعیت پات (Stalemate) برای سیاه!"
        verdict_en = "Stalemate for Black!"
        summary_fa = f"شاه سیاه در کیش نیست، اما سیاه هیچ حرکت قانونی در صفحه ندارد. اگر نوبت سیاه باشد، بازی مساوی است."
        summary_en = "Black is not in check, but has 0 legal moves. If it's Black's turn, it's a draw."

    else:
        overall_status = STATUS_SAFE
        affected_side = None
        verdict_fa = "وضعیت عادی و امن؛ هیچ شاهی در کیش نیست."
        verdict_en = "Normal position; neither king is in check."
        summary_fa = f"شاه سفید در {wk_not} و شاه سیاه در {bk_not} در موقعیت امن قرار دارند و هر دو طرف دارای حرکات مجاز هستند."
        summary_en = f"Both kings ({wk_not}, {bk_not}) are safe with legal moves available."

    # Step 6: Step-by-Step Educational Explanation for University Defense
    algorithm_steps = [
        {
            "step": 1,
            "title_fa": "اسکن صفحه و یافتن موقعیت شاه‌ها",
            "title_en": "Board Scan & King Discovery",
            "status": "PASSED",
            "description_fa": f"شاه سفید در {wk_not} و شاه سیاه در {bk_not} شناسایی شدند. هیچ تقابل غیرمجازی یافت نشد.",
            "description_en": f"White King at {wk_not}, Black King at {bk_not} located."
        },
        {
            "step": 2,
            "title_fa": "پرتوافکنی شعاعی و شناسایی تهدیدات (Ray-Casting)",
            "title_en": "Radial Ray-Casting & Attack Vector Analysis",
            "status": "PASSED",
            "description_fa": f"شلیک پرتوها در ۸ جهت خطی و مورب و اسکن جهش‌های اسب و پیاده: {len(white_attackers)} تهدید روی سفید و {len(black_attackers)} تهدید روی سیاه یافت شد.",
            "description_en": f"Found {len(white_attackers)} attacks on White and {len(black_attackers)} attacks on Black."
        },
        {
            "step": 3,
            "title_fa": "تحلیل مهره‌های میخی و راه‌های گریز (Evasion Analysis)",
            "title_en": "Pin Detection & Evasion Search",
            "status": "PASSED",
            "description_fa": f"مهره‌های میخی سفید: {len(white_pinned)} | مهره‌های میخی سیاه: {len(black_pinned)} | حرکات گریز سفید: {white_evasions['total_evasions_count']} | حرکات گریز سیاه: {black_evasions['total_evasions_count']}.",
            "description_en": f"Evaluated King moves, captures of attackers, and line blocks."
        },
        {
            "step": 4,
            "title_fa": "دسته‌بندی نهایی وضعیت (Classification)",
            "title_en": "Final State Classification",
            "status": "PASSED",
            "description_fa": f"وضعیت نهایی: {STATUS_LABELS_FA[overall_status]}",
            "description_en": f"Final Verdict: {STATUS_LABELS_EN[overall_status]}"
        }
    ]

    return {
        "is_valid": True,
        "validation": validation,
        "overall_status": overall_status,
        "affected_side": affected_side,
        "verdict_fa": verdict_fa,
        "verdict_en": verdict_en,
        "summary_fa": summary_fa,
        "summary_en": summary_en,
        "visual_threats": visual_threats,
        "algorithm_steps": algorithm_steps,
        "white": {
            "king_position": [wk_r, wk_c],
            "king_notation": wk_not,
            "status": white_status,
            "status_label_fa": STATUS_LABELS_FA[white_status],
            "status_label_en": STATUS_LABELS_EN[white_status],
            "attackers": white_attackers,
            "evasions": white_evasions,
            "pinned_pieces": white_pinned,
            "total_legal_moves": len(white_all_legal)
        },
        "black": {
            "king_position": [bk_r, bk_c],
            "king_notation": bk_not,
            "status": black_status,
            "status_label_fa": STATUS_LABELS_FA[black_status],
            "status_label_en": STATUS_LABELS_EN[black_status],
            "attackers": black_attackers,
            "evasions": black_evasions,
            "pinned_pieces": black_pinned,
            "total_legal_moves": len(black_all_legal)
        }
    }
