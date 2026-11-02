"""
High-level chess board evaluator for Checkmate, Stalemate, Check, Normal, and Invalid states.
Computes comprehensive legal moves for both colors to support interactive move preview.
"""
from typing import Dict, Any, List, Optional, Tuple
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
        return False, f"شاه بازیکن غیرنوبت ({opp_name_fa}) در کیش است؛ این وضعیت در شطرنج نامعتبر است.", f"The inactive player's king ({opp_name_en}) is in check, which is an illegal board state."

    return True, "", ""


def evaluate_board(board: Board, active_turn: str = 'w') -> Dict[str, Any]:
    """
    Evaluate chess board position for active_turn ('w' or 'b').
    Determines if position is CHECKMATE, STALEMATE, CHECK, NORMAL, or INVALID.
    Also computes moves_by_square for all pieces (both colors) to allow move previews on click.
    """
    active_turn = active_turn.lower()
    if active_turn not in ('w', 'b'):
        active_turn = 'w'

    # Step 1: Validate board
    is_valid, error_fa, error_en = validate_board(board, active_turn)
    if not is_valid:
        return {
            "status": "INVALID",
            "status_fa": "صفحه نامعتبر",
            "status_color": "danger",
            "active_turn": active_turn,
            "in_check": False,
            "king_coords": None,
            "king_square": None,
            "checking_pieces": [],
            "legal_moves_count": 0,
            "legal_moves": [],
            "moves_by_square": {},
            "explanation_fa": error_fa,
            "explanation_en": error_en,
            "message_fa": error_fa
        }

    king_pos = board.find_king(active_turn)
    king_square = coords_to_square(king_pos[0], king_pos[1]) if king_pos else None

    # Step 2: Check status for active player
    in_check = is_in_check(board, active_turn)
    opponent_turn = 'b' if active_turn == 'w' else 'w'
    checking_pieces_coords = get_attackers_of_square(board, king_pos[0], king_pos[1], opponent_turn) if king_pos else []
    checking_pieces = [
        {
            "coords": [r, c],
            "square": coords_to_square(r, c),
            "piece": board.get_piece(r, c).code if board.get_piece(r, c) else None
        }
        for r, c in checking_pieces_coords
    ]

    # Step 3: Compute legal moves for active player
    active_legal_moves = generate_legal_moves(board, active_turn)
    legal_moves_count = len(active_legal_moves)
    legal_moves_dicts = [m.to_dict() for m in active_legal_moves]

    # Step 4: Compute legal moves for both sides for interactive click preview
    opp_legal_moves = generate_legal_moves(board, opponent_turn)
    moves_by_square: Dict[str, List[str]] = {}

    for m in active_legal_moves + opp_legal_moves:
        if m.from_sq not in moves_by_square:
            moves_by_square[m.from_sq] = []
        if m.to_sq not in moves_by_square[m.from_sq]:
            moves_by_square[m.from_sq].append(m.to_sq)

    # Step 5: Outcome resolution
    if legal_moves_count == 0:
        if in_check:
            status = "CHECKMATE"
            status_fa = "کیش و مات"
            status_color = "danger"
            message_fa = "کیش و مات! شاه هیچ حرکت قانونی برای رفع کیش ندارد."
        else:
            status = "STALEMATE"
            status_fa = "پات (مساوی)"
            status_color = "warning"
            message_fa = "پات! شاه در کیش نیست اما هیچ حرکت قانونی وجود ندارد."
    else:
        if in_check:
            status = "CHECK"
            status_fa = "کیش"
            status_color = "warning"
            message_fa = "کیش! شاه در معرض خطر است اما راه‌های خروج وجود دارد."
        else:
            status = "NORMAL"
            status_fa = "وضعیت عادی"
            status_color = "success"
            message_fa = "وضعیت عادی (بدون کیش)"

    return {
        "status": status,
        "status_fa": status_fa,
        "status_color": status_color,
        "active_turn": active_turn,
        "in_check": in_check,
        "king_coords": king_pos,
        "king_square": king_square,
        "checking_pieces": checking_pieces,
        "legal_moves_count": legal_moves_count,
        "legal_moves": legal_moves_dicts,
        "moves_by_square": moves_by_square,
        "message_fa": message_fa,
        "fen": board.to_fen(active_turn)
    }
