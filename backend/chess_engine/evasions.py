"""
Check Evasions and Legal Move Generator
CheckmateCheck - Academic Chess Analyzer
"""

from typing import List, Dict, Any, Tuple
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    PIECE_NAMES_FA, PIECE_NAMES_EN
)
from .board import ChessBoard, Piece, to_notation
from .attacks import get_attackers_on_square, get_pseudo_legal_moves
from .pin_detector import is_move_legal

def get_all_legal_moves_for_color(board: ChessBoard, color: str) -> List[Dict[str, Any]]:
    """
    Generates all legal moves for `color` on the current board.
    Returns list of dicts:
    [{'from': [r, c], 'from_notation': 'e2', 'to': [r2, c2], 'to_notation': 'e4', 'piece': piece.to_dict()}]
    """
    legal_moves = []
    pieces = board.find_pieces_by_color(color)

    for r, c, piece in pieces:
        pseudo_destinations = get_pseudo_legal_moves(board, r, c)
        for dest_r, dest_c in pseudo_destinations:
            if is_move_legal(board, r, c, dest_r, dest_c, color):
                legal_moves.append({
                    "piece": piece.to_dict(),
                    "piece_name_fa": PIECE_NAMES_FA[piece.type],
                    "piece_name_en": PIECE_NAMES_EN[piece.type],
                    "from": [r, c],
                    "from_notation": to_notation(r, c),
                    "to": [dest_r, dest_c],
                    "to_notation": to_notation(dest_r, dest_c),
                    "is_capture": board.get_piece(dest_r, dest_c) is not None
                })

    return legal_moves


def analyze_check_evasions(
    board: ChessBoard,
    king_r: int,
    king_c: int,
    king_color: str,
    attackers: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Analyzes all possible evasions when king at (king_r, king_c) is in check.
    Categorizes evasions into:
    1. king_moves: King steps to a safe square.
    2. captures: Friendly piece (or King) captures the checking attacker.
    3. blocks: Friendly piece interposes on the line of attack (only for single sliding check).
    """
    king_escapes = []
    capture_evasions = []
    block_evasions = []

    all_legal = get_all_legal_moves_for_color(board, king_color)

    attacker_positions = [tuple(att["from"]) for att in attackers]
    is_double_check = len(attackers) >= 2

    # Collect ray squares if single sliding attacker
    valid_block_squares = set()
    if len(attackers) == 1 and attackers[0]["ray_squares"]:
        for sq in attackers[0]["ray_squares"]:
            valid_block_squares.add((sq[0], sq[1]))

    for move in all_legal:
        from_pos = (move["from"][0], move["from"][1])
        to_pos = (move["to"][0], move["to"][1])
        piece_type = move["piece"]["type"]

        if piece_type == KING:
            king_escapes.append(move)
        else:
            # Non-king moves:
            # In double check, non-king moves CANNOT resolve both checks simultaneously!
            if not is_double_check:
                # Can capture the single attacker?
                if to_pos in attacker_positions:
                    capture_evasions.append(move)
                # Can block the single attacker ray?
                elif to_pos in valid_block_squares:
                    block_evasions.append(move)

    total_evasions = len(king_escapes) + len(capture_evasions) + len(block_evasions)

    return {
        "is_in_check": len(attackers) > 0,
        "is_double_check": is_double_check,
        "attackers_count": len(attackers),
        "total_evasions_count": total_evasions,
        "king_escapes": king_escapes,
        "captures": capture_evasions,
        "blocks": block_evasions,
        "all_evasion_moves": king_escapes + capture_evasions + block_evasions
    }
