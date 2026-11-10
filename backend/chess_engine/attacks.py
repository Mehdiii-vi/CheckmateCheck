"""
Attack Ray Casting and Attack Detection Algorithms
CheckmateCheck - Academic Chess Analyzer
"""

from typing import List, Tuple, Dict, Any, Optional
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    ORTHOGONAL_DIRECTIONS, DIAGONAL_DIRECTIONS, KING_DIRECTIONS,
    KNIGHT_OFFSETS, PAWN_ATTACK_OFFSETS
)
from .board import ChessBoard, Piece, in_bounds, to_notation

def get_attackers_on_square(
    board: ChessBoard,
    target_r: int,
    target_c: int,
    attacker_color: str
) -> List[Dict[str, Any]]:
    """
    Finds all pieces of `attacker_color` that attack `(target_r, target_c)`.
    Returns list of dicts with:
    - 'piece': piece dict
    - 'from': [r, c]
    - 'from_notation': e.g. 'e8'
    - 'to': [target_r, target_c]
    - 'to_notation': e.g. 'e1'
    - 'ray_squares': list of intermediate [r, c] along the ray between attacker and target
    """
    attackers = []

    # 1. Check Orthogonal Rays (Rook, Queen)
    for dr, dc in ORTHOGONAL_DIRECTIONS:
        r, c = target_r + dr, target_c + dc
        ray = []
        while in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece is not None:
                if piece.color == attacker_color and piece.type in (ROOK, QUEEN):
                    attackers.append({
                        "piece": piece.to_dict(),
                        "from": [r, c],
                        "from_notation": to_notation(r, c),
                        "to": [target_r, target_c],
                        "to_notation": to_notation(target_r, target_c),
                        "ray_squares": list(ray)
                    })
                break
            ray.append([r, c])
            r += dr
            c += dc

    # 2. Check Diagonal Rays (Bishop, Queen)
    for dr, dc in DIAGONAL_DIRECTIONS:
        r, c = target_r + dr, target_c + dc
        ray = []
        while in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece is not None:
                if piece.color == attacker_color and piece.type in (BISHOP, QUEEN):
                    attackers.append({
                        "piece": piece.to_dict(),
                        "from": [r, c],
                        "from_notation": to_notation(r, c),
                        "to": [target_r, target_c],
                        "to_notation": to_notation(target_r, target_c),
                        "ray_squares": list(ray)
                    })
                break
            ray.append([r, c])
            r += dr
            c += dc

    # 3. Check Knight Leaps
    for dr, dc in KNIGHT_OFFSETS:
        r, c = target_r + dr, target_c + dc
        if in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece and piece.color == attacker_color and piece.type == KNIGHT:
                attackers.append({
                    "piece": piece.to_dict(),
                    "from": [r, c],
                    "from_notation": to_notation(r, c),
                    "to": [target_r, target_c],
                    "to_notation": to_notation(target_r, target_c),
                    "ray_squares": []  # Knight cannot be blocked
                })

    # 4. Check Pawn Attacks
    # If attacker is WHITE, white pawns attack diagonally upwards (r decreases).
    # So an attacking white pawn is located at target_r + 1 (below target).
    # If attacker is BLACK, black pawns attack diagonally downwards (r increases).
    # So an attacking black pawn is located at target_r - 1 (above target).
    pawn_row_offset = 1 if attacker_color == WHITE else -1
    for dc in (-1, 1):
        r, c = target_r + pawn_row_offset, target_c + dc
        if in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece and piece.color == attacker_color and piece.type == PAWN:
                attackers.append({
                    "piece": piece.to_dict(),
                    "from": [r, c],
                    "from_notation": to_notation(r, c),
                    "to": [target_r, target_c],
                    "to_notation": to_notation(target_r, target_c),
                    "ray_squares": []  # Pawn attack cannot be blocked
                })

    # 5. Check Adjacent Enemy King
    for dr, dc in KING_DIRECTIONS:
        r, c = target_r + dr, target_c + dc
        if in_bounds(r, c):
            piece = board.get_piece(r, c)
            if piece and piece.color == attacker_color and piece.type == KING:
                attackers.append({
                    "piece": piece.to_dict(),
                    "from": [r, c],
                    "from_notation": to_notation(r, c),
                    "to": [target_r, target_c],
                    "to_notation": to_notation(target_r, target_c),
                    "ray_squares": []
                })

    return attackers


def is_square_attacked(
    board: ChessBoard,
    target_r: int,
    target_c: int,
    attacker_color: str,
    ignore_target_piece: bool = False
) -> bool:
    """
    Checks if a square is attacked by any piece of attacker_color.
    If `ignore_target_piece` is True, we temporarily pretend the square is empty
    (useful when testing if a square a King vacates is under attack).
    """
    if not ignore_target_piece:
        attackers = get_attackers_on_square(board, target_r, target_c, attacker_color)
        return len(attackers) > 0

    saved_piece = board.get_piece(target_r, target_c)
    board.set_piece(target_r, target_c, None)
    attackers = get_attackers_on_square(board, target_r, target_c, attacker_color)
    board.set_piece(target_r, target_c, saved_piece)
    return len(attackers) > 0


def get_pseudo_legal_moves(board: ChessBoard, r: int, c: int) -> List[Tuple[int, int]]:
    """
    Returns all pseudo-legal target squares (r_dest, c_dest) for the piece at (r, c).
    Pseudo-legal means move follows piece movement rules without checking if own king is in check.
    """
    piece = board.get_piece(r, c)
    if not piece:
        return []

    moves = []
    color = piece.color
    enemy_color = BLACK if color == WHITE else WHITE

    if piece.type == PAWN:
        # Move forward 1 step
        forward_dr = -1 if color == WHITE else 1
        f1_r, f1_c = r + forward_dr, c
        if in_bounds(f1_r, f1_c) and board.get_piece(f1_r, f1_c) is None:
            moves.append((f1_r, f1_c))
            # Move forward 2 steps from starting rank
            start_rank = 6 if color == WHITE else 1  # 0-indexed row (row 6 is rank 2, row 1 is rank 7)
            f2_r = r + 2 * forward_dr
            if r == start_rank and in_bounds(f2_r, c) and board.get_piece(f2_r, c) is None:
                moves.append((f2_r, c))

        # Diagonal captures
        for dc in (-1, 1):
            cap_r, cap_c = r + forward_dr, c + dc
            if in_bounds(cap_r, cap_c):
                target = board.get_piece(cap_r, cap_c)
                if target and target.color == enemy_color:
                    moves.append((cap_r, cap_c))

    elif piece.type == KNIGHT:
        for dr, dc in KNIGHT_OFFSETS:
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc):
                target = board.get_piece(nr, nc)
                if target is None or target.color == enemy_color:
                    moves.append((nr, nc))

    elif piece.type in (BISHOP, ROOK, QUEEN):
        directions = []
        if piece.type in (ROOK, QUEEN):
            directions.extend(ORTHOGONAL_DIRECTIONS)
        if piece.type in (BISHOP, QUEEN):
            directions.extend(DIAGONAL_DIRECTIONS)

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            while in_bounds(nr, nc):
                target = board.get_piece(nr, nc)
                if target is None:
                    moves.append((nr, nc))
                elif target.color == enemy_color:
                    moves.append((nr, nc))
                    break
                else:
                    break
                nr += dr
                nc += dc

    elif piece.type == KING:
        for dr, dc in KING_DIRECTIONS:
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc):
                target = board.get_piece(nr, nc)
                if target is None or target.color == enemy_color:
                    moves.append((nr, nc))

    return moves
