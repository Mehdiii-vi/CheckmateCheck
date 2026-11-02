"""
High-level chess board evaluator for Checkmate, Stalemate, Check, Normal, and Invalid states.
"""
from typing import Dict, Any, List, Optional
from .board import Board, coords_to_square
from .move_gen import is_in_check, get_attackers_of_square, generate_legal_moves


def validate_board(board: Board, active_turn: str) -> Tuple[bool, str, str]:
    """
    Validate basic physical chess rules for a static board state:
    1. Exactly one White King and one Black King.
    2. Kings cannot occupy adjacent squares.
    3. Pawns cannot be on Rank 1 (row 7) or Rank 8 (row 0).
    4. The opposing player cannot already be in check.

    Returns: (is_valid, error_fa, error_en)
    """
    from typing import Tuple
    active_turn = active_turn.lower()
    opponent = 'b' if active_turn == 'w' else 'w'

    # 1. King counts
    white_kings = board.count_kings('w')
    black_kings = board.count_kings('b')

    if white_kings != 1:
        return False, f"تعداد شاه سفید باید دقیقاً ۱ باشد (اکنون: {white_kings}).", f"White must have exactly 1 king (found: {white_kings})."
    if black_kings != 1:
        return False, f"تعداد شاه سیاه باید دقیقاً ۱ باشد (اکنون: {black_kings}).", f"Black must have exactly 1 king (found: {black_kings})."

    # 2. Adjacent kings check
    wk_pos = board.find_king('w')
    bk_pos = board.find_king('b')
    if wk_pos and bk_pos:
        if abs(wk_pos[0] - bk_pos[0]) <= 1 and abs(wk_pos[1] - bk_pos[1]) <= 1:
            return False, "دو شاه نمی‌توانند در خانه‌های مجاور یکدیگر قرار گیرند.", "Kings cannot occupy adjacent squares."

    # 3. Pawns on rank 1 or 8
    for c in range(8):
        # Row 0 is Rank 8
        p0 = board.get_piece(0, c)
        if p0 is not None and p0.piece_type == 'P':
            return False, f"پیاده نمی‌تواند در ردیف آخر ({coords_to_square(0, c)}) قرار گیرد.", f"Pawn cannot be on the 8th rank ({coords_to_square(0, c)})."
        # Row 7 is Rank 1
        p7 = board.get_piece(7, c)
        if p7 is not None and p7.piece_type == 'P':
            return False, f"پیاده نمی‌تواند در ردیف اول ({coords_to_square(7, c)}) قرار گیرد.", f"Pawn cannot be on the 1st rank ({coords_to_square(7, c)})."

    # 4. Opponent king cannot already be in check
    if is_in_check(board, opponent):
        opp_name_fa = "سیاه" if opponent == 'b' else "سفید"
        opp_name_en = "Black" if opponent == 'b' else "White"
        return False, f"شاه بازیکن غیرنوبت ({opp_name_fa}) در کیش است؛ این وضعیت در شطرنج غیرممکن است زیرا حرکت قبلی غیرقانونی بوده است.", f"The inactive player's king ({opp_name_en}) is in check, which is an illegal board state."

    return True, "", ""


def evaluate_board(board: Board, active_turn: str = 'w') -> Dict[str, Any]:
    """
    Evaluate chess board position for active_turn ('w' or 'b').
    Determines if position is CHECKMATE, STALEMATE, CHECK, NORMAL, or INVALID.
    """
    active_turn = active_turn.lower()
    if active_turn not in ('w', 'b'):
        active_turn = 'w'

    player_name_fa = "سفید" if active_turn == 'w' else "سیاه"
    player_name_en = "White" if active_turn == 'w' else "Black"
    opponent_turn = 'b' if active_turn == 'w' else 'w'

    # Step 1: Validate board
    is_valid, error_fa, error_en = validate_board(board, active_turn)
    if not is_valid:
        return {
            "status": "INVALID",
            "status_fa": "صفحه نامعتبر",
            "status_color": "danger",
            "active_turn": active_turn,
            "in_check": False,
            "checking_pieces": [],
            "king_square": None,
            "legal_moves_count": 0,
            "legal_moves": [],
            "explanation_fa": error_fa,
            "explanation_en": error_en
        }

    king_pos = board.find_king(active_turn)
    king_square = coords_to_square(king_pos[0], king_pos[1]) if king_pos else None

    # Step 2: Check status
    in_check = is_in_check(board, active_turn)
    checking_pieces_coords = get_attackers_of_square(board, king_pos[0], king_pos[1], opponent_turn) if king_pos else []
    checking_pieces = [
        {
            "coords": [r, c],
            "square": coords_to_square(r, c),
            "piece": board.get_piece(r, c).code if board.get_piece(r, c) else None
        }
        for r, c in checking_pieces_coords
    ]

    # Step 3: Legal moves calculation
    legal_moves = generate_legal_moves(board, active_turn)
    legal_moves_count = len(legal_moves)
    legal_moves_dicts = [m.to_dict() for m in legal_moves]

    # Step 4: Outcome resolution
    if legal_moves_count == 0:
        if in_check:
            # CHECKMATE
            status = "CHECKMATE"
            status_fa = "کیش و مات"
            status_color = "danger"
            check_sources = ", ".join([cp["square"] for cp in checking_pieces])
            exp_fa = (
                f"شاه {player_name_fa} در خانه‌ی {king_square} توسط مهره‌های خانه‌های ({check_sources}) "
                f"در کیش است و بازیکن هیچ حرکت قانونی برای رفع کیش ندارد. {player_name_fa} کیش و مات شده است!"
            )
            exp_en = (
                f"{player_name_en} King on {king_square} is in check by ({check_sources}) "
                f"and has no legal moves to escape. {player_name_en} is checkmated!"
            )
        else:
            # STALEMATE
            status = "STALEMATE"
            status_fa = "پات (مساوی)"
            status_color = "warning"
            exp_fa = (
                f"شاه {player_name_fa} در کیش نیست، اما هیچ حرکت قانونی برای بازیکن {player_name_fa} "
                f"روی کل صفحه وجود ندارد. بازی مساوی (پات) است."
            )
            exp_en = (
                f"{player_name_en} King is NOT in check, but {player_name_en} has no legal moves remaining. "
                f"The game is a draw by stalemate."
            )
    else:
        if in_check:
            # CHECK
            status = "CHECK"
            status_fa = "کیش"
            status_color = "warning"
            check_sources = ", ".join([cp["square"] for cp in checking_pieces])
            exp_fa = (
                f"شاه {player_name_fa} در خانه‌ی {king_square} از طرف خانه ({check_sources}) کیش شده است. "
                f"بازیکن {legal_moves_count} حرکت قانونی برای خروج از کیش در اختیار دارد."
            )
            exp_en = (
                f"{player_name_en} King on {king_square} is in check from ({check_sources}). "
                f"{player_name_en} has {legal_moves_count} legal move(s) to escape check."
            )
        else:
            # NORMAL
            status = "NORMAL"
            status_fa = "وضعیت عادی"
            status_color = "success"
            exp_fa = (
                f"شاه {player_name_fa} در امنیت است و کیش نیست. "
                f"بازیکن {player_name_fa} دارای {legal_moves_count} حرکت قانونی است."
            )
            exp_en = (
                f"{player_name_en} is not in check. {player_name_en} has {legal_moves_count} legal move(s) available."
            )

    return {
        "status": status,
        "status_fa": status_fa,
        "status_en": status,
        "status_color": status_color,
        "active_turn": active_turn,
        "in_check": in_check,
        "king_square": king_square,
        "king_coords": king_pos,
        "checking_pieces": checking_pieces,
        "legal_moves_count": legal_moves_count,
        "legal_moves": legal_moves_dicts,
        "explanation_fa": exp_fa,
        "explanation_en": exp_en,
        "fen": board.to_fen(active_turn)
    }
