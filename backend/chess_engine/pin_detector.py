"""
Pin Detection and Move Legality Verifier
CheckmateCheck - Academic Chess Analyzer
"""

from typing import List, Tuple, Dict, Any, Optional
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP,
    ORTHOGONAL_DIRECTIONS, DIAGONAL_DIRECTIONS
)
from .board import ChessBoard, Piece, in_bounds, to_notation
from .attacks import is_square_attacked

def find_pinned_pieces(board: ChessBoard, king_r: int, king_c: int, king_color: str) -> List[Dict[str, Any]]:
    """
    Finds all pieces of `king_color` that are absolutely pinned against the King at (king_r, king_c).
    Returns list of dicts describing the pinned piece and the pinning enemy attacker.
    """
    pinned = []
    enemy_color = BLACK if king_color == WHITE else WHITE

    # Check Orthogonals (Rook / Queen pins)
    for dr, dc in ORTHOGONAL_DIRECTIONS:
        r, c = king_r + dr, king_c + dc
        friendly_found = None
        friendly_pos = None

        while in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece:
                if piece.color == king_color:
                    if friendly_found is None:
                        friendly_found = piece
                        friendly_pos = (r, c)
                    else:
                        # Second friendly piece blocks the ray; no pin
                        break
                else:
                    # Enemy piece encountered
                    if friendly_found is not None:
                        if piece.type in (ROOK, QUEEN):
                            pinned.append({
                                "pinned_piece": friendly_found.to_dict(),
                                "pinned_pos": list(friendly_pos),
                                "pinned_notation": to_notation(*friendly_pos),
                                "pinner_piece": piece.to_dict(),
                                "pinner_pos": [r, c],
                                "pinner_notation": to_notation(r, c),
                                "ray_direction": [dr, dc]
                            })
                    break
            r += dr
            c += dc

    # Check Diagonals (Bishop / Queen pins)
    for dr, dc in DIAGONAL_DIRECTIONS:
        r, c = king_r + dr, king_c + dc
        friendly_found = None
        friendly_pos = None

        while in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece:
                if piece.color == king_color:
                    if friendly_found is None:
                        friendly_found = piece
                        friendly_pos = (r, c)
                    else:
                        break
                else:
                    if friendly_found is not None:
                        if piece.type in (BISHOP, QUEEN):
                            pinned.append({
                                "pinned_piece": friendly_found.to_dict(),
                                "pinned_pos": list(friendly_pos),
                                "pinned_notation": to_notation(*friendly_pos),
                                "pinner_piece": piece.to_dict(),
                                "pinner_pos": [r, c],
                                "pinner_notation": to_notation(r, c),
                                "ray_direction": [dr, dc]
                            })
                    break
            r += dr
            c += dc

    return pinned


def is_move_legal(
    board: ChessBoard,
    from_r: int,
    from_c: int,
    to_r: int,
    to_c: int,
    color: str
) -> bool:
    """
    Tests if moving piece from (from_r, from_c) to (to_r, to_c) is legal
    (i.e., leaves the player's own king NOT in check).
    """
    moving_piece = board.get_piece(from_r, from_c)
    if not moving_piece or moving_piece.color != color:
        return False

    dest_piece = board.get_piece(to_r, to_c)
    enemy_color = BLACK if color == WHITE else WHITE

    # Make move temporarily
    board.set_piece(from_r, from_c, None)
    board.set_piece(to_r, to_c, moving_piece)

    # Find king's position after move
    if moving_piece.type == KING:
        k_r, k_c = to_r, to_c
    else:
        kings = board.find_kings()[color]
        if not kings:
            # King missing; undo and return False
            board.set_piece(from_r, from_c, moving_piece)
            board.set_piece(to_r, to_c, dest_piece)
            return False
        k_r, k_c = kings[0]

    # Verify king is not attacked
    king_safe = not is_square_attacked(board, k_r, k_c, enemy_color)

    # Undo move
    board.set_piece(from_r, from_c, moving_piece)
    board.set_piece(to_r, to_c, dest_piece)

    return king_safe
