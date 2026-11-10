"""
CheckmateCheck Chess Engine Package
"""

from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    STATUS_SAFE, STATUS_CHECK, STATUS_CHECKMATE, STATUS_STALEMATE,
    PIECE_NAMES_FA, PIECE_NAMES_EN, COLOR_NAMES_FA, COLOR_NAMES_EN
)
from .board import ChessBoard, Piece, to_notation, from_notation, in_bounds
from .attacks import get_attackers_on_square, is_square_attacked, get_pseudo_legal_moves
from .pin_detector import find_pinned_pieces, is_move_legal
from .evasions import analyze_check_evasions, get_all_legal_moves_for_color
from .validator import validate_board
from .solver import analyze_board_state

__all__ = [
    "WHITE", "BLACK", "KING", "QUEEN", "ROOK", "BISHOP", "KNIGHT", "PAWN",
    "STATUS_SAFE", "STATUS_CHECK", "STATUS_CHECKMATE", "STATUS_STALEMATE",
    "PIECE_NAMES_FA", "PIECE_NAMES_EN", "COLOR_NAMES_FA", "COLOR_NAMES_EN",
    "ChessBoard", "Piece", "to_notation", "from_notation", "in_bounds",
    "get_attackers_on_square", "is_square_attacked", "get_pseudo_legal_moves",
    "find_pinned_pieces", "is_move_legal",
    "analyze_check_evasions", "get_all_legal_moves_for_color",
    "validate_board", "analyze_board_state"
]
