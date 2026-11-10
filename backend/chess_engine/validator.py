"""
Board Configuration Validator
CheckmateCheck - Academic Chess Analyzer
"""

from typing import Dict, Any, List, Tuple
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    PIECE_NAMES_FA, PIECE_NAMES_EN
)
from .board import ChessBoard, to_notation
from .attacks import get_attackers_on_square

def validate_board(board: ChessBoard) -> Dict[str, Any]:
    """
    Validates whether the board represents a legally reachable chess position.
    Checks:
    1. Exactly one White King and one Black King.
    2. Kings cannot touch (adjacent squares).
    3. Pawns cannot be placed on Rank 1 (row 7) or Rank 8 (row 0).
    4. Piece counts do not exceed physical chess limits (e.g., max 16 pieces, max 8 pawns).
    5. Both kings cannot be simultaneously in check (impossible state).
    """
    errors_fa: List[str] = []
    errors_en: List[str] = []
    warnings_fa: List[str] = []
    warnings_en: List[str] = []

    kings = board.find_kings()
    white_kings = kings[WHITE]
    black_kings = kings[BLACK]

    # 1. King Count Check
    if len(white_kings) == 0:
        errors_fa.append("شاه سفید در صفحه وجود ندارد.")
        errors_en.append("White King is missing from the board.")
    elif len(white_kings) > 1:
        errors_fa.append(f"تعداد شاه‌های سفید بیش از حد مجاز است ({len(white_kings)} شاه سفید).")
        errors_en.append(f"Multiple White Kings found ({len(white_kings)}).")

    if len(black_kings) == 0:
        errors_fa.append("شاه سیاه در صفحه وجود ندارد.")
        errors_en.append("Black King is missing from the board.")
    elif len(black_kings) > 1:
        errors_fa.append(f"تعداد شاه‌های سیاه بیش از حد مجاز است ({len(black_kings)} شاه سیاه).")
        errors_en.append(f"Multiple Black Kings found ({len(black_kings)}).")

    # If kings are missing, return early because adjacency and check cannot be checked
    if len(white_kings) != 1 or len(black_kings) != 1:
        return {
            "is_valid": False,
            "errors_fa": errors_fa,
            "errors_en": errors_en,
            "warnings_fa": warnings_fa,
            "warnings_en": warnings_en,
            "white_king_pos": white_kings[0] if len(white_kings) == 1 else None,
            "black_king_pos": black_kings[0] if len(black_kings) == 1 else None
        }

    wk_r, wk_c = white_kings[0]
    bk_r, bk_c = black_kings[0]

    # 2. Adjacent Kings Check (Kings cannot touch)
    if max(abs(wk_r - bk_r), abs(wk_c - bk_c)) <= 1:
        errors_fa.append(
            f"شاه سفید در {to_notation(wk_r, wk_c)} و شاه سیاه در {to_notation(bk_r, bk_c)} در خانه‌های مجاور هستند (خطای تقابل شاه‌ها)."
        )
        errors_en.append(
            f"Kings cannot be adjacent to each other ({to_notation(wk_r, wk_c)} and {to_notation(bk_r, bk_c)})."
        )

    # 3. Pawns on First or Last Rank Check
    for c in range(8):
        # Rank 8 (row 0)
        p8 = board.get_piece(0, c)
        if p8 and p8.type == PAWN:
            sq = to_notation(0, c)
            errors_fa.append(f"پیاده نمی‌تواند در سطر آخر (سطر ۸ - خانه {sq}) قرار داشته باشد (باید ارتقا می‌یافت).")
            errors_en.append(f"Pawn cannot exist on rank 8 ({sq}) - must be promoted.")

        # Rank 1 (row 7)
        p1 = board.get_piece(7, c)
        if p1 and p1.type == PAWN:
            sq = to_notation(7, c)
            errors_fa.append(f"پیاده نمی‌تواند در سطر اول (سطر ۱ - خانه {sq}) قرار داشته باشد.")
            errors_en.append(f"Pawn cannot exist on rank 1 ({sq}).")

    # 4. Piece Count Validation
    white_pieces = board.find_pieces_by_color(WHITE)
    black_pieces = board.find_pieces_by_color(BLACK)

    if len(white_pieces) > 16:
        errors_fa.append(f"تعداد مهره‌های سفید ({len(white_pieces)}) بیش از سقف استاندارد (۱۶ مهره) است.")
        errors_en.append(f"White has too many pieces ({len(white_pieces)} > 16).")

    if len(black_pieces) > 16:
        errors_fa.append(f"تعداد مهره‌های سیاه ({len(black_pieces)}) بیش از سقف استاندارد (۱۶ مهره) است.")
        errors_en.append(f"Black has too many pieces ({len(black_pieces)} > 16).")

    white_pawns = sum(1 for _, _, p in white_pieces if p.type == PAWN)
    black_pawns = sum(1 for _, _, p in black_pieces if p.type == PAWN)

    if white_pawns > 8:
        errors_fa.append(f"تعداد پیاده‌های سفید ({white_pawns}) بیش از حد مجاز (۸ عدد) است.")
        errors_en.append(f"White has too many pawns ({white_pawns} > 8).")

    if black_pawns > 8:
        errors_fa.append(f"تعداد پیاده‌های سیاه ({black_pawns}) بیش از حد مجاز (۸ عدد) است.")
        errors_en.append(f"Black has too many pawns ({black_pawns} > 8).")

    # 5. Mutual Check Validation (Both Kings in Check)
    white_attackers = get_attackers_on_square(board, wk_r, wk_c, BLACK)
    black_attackers = get_attackers_on_square(board, bk_r, bk_c, WHITE)

    if len(white_attackers) > 0 and len(black_attackers) > 0:
        errors_fa.append(
            "هر دو شاه به طور همزمان در موقعیت کیش قرار دارند؛ این وضعیت در شطرنج استاندارد غیرممکن است."
        )
        errors_en.append(
            "Both White and Black kings are in check simultaneously, which is an impossible legal position."
        )

    is_valid = len(errors_fa) == 0

    return {
        "is_valid": is_valid,
        "errors_fa": errors_fa,
        "errors_en": errors_en,
        "warnings_fa": warnings_fa,
        "warnings_en": warnings_en,
        "white_king_pos": [wk_r, wk_c],
        "white_king_notation": to_notation(wk_r, wk_c),
        "black_king_pos": [bk_r, bk_c],
        "black_king_notation": to_notation(bk_r, bk_c),
        "white_attackers_count": len(white_attackers),
        "black_attackers_count": len(black_attackers)
    }
