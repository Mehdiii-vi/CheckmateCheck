"""
Move generation, square attack detection, and legal move validation for chess.
"""
from typing import List, Tuple, Optional, Dict, Any
from .board import Board, Piece, is_valid_coord, coords_to_square


class Move:
    __slots__ = ('from_r', 'from_c', 'to_r', 'to_c', 'promotion', 'piece', 'captured')

    def __init__(self, from_r: int, from_c: int, to_r: int, to_c: int,
                 promotion: Optional[str] = None,
                 piece: Optional[Piece] = None,
                 captured: Optional[Piece] = None):
        self.from_r = from_r
        self.from_c = from_c
        self.to_r = to_r
        self.to_c = to_c
        self.promotion = promotion  # 'Q', 'R', 'B', 'N'
        self.piece = piece
        self.captured = captured

    @property
    def from_sq(self) -> str:
        return coords_to_square(self.from_r, self.from_c)

    @property
    def to_sq(self) -> str:
        return coords_to_square(self.to_r, self.to_c)

    @property
    def uci(self) -> str:
        prom = self.promotion.lower() if self.promotion else ""
        return f"{self.from_sq}{self.to_sq}{prom}"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "from": self.from_sq,
            "to": self.to_sq,
            "from_coords": [self.from_r, self.from_c],
            "to_coords": [self.to_r, self.to_c],
            "uci": self.uci,
            "piece": self.piece.code if self.piece else None,
            "captured": self.captured.code if self.captured else None,
            "promotion": self.promotion
        }

    def __repr__(self) -> str:
        return f"Move({self.uci})"

    def __eq__(self, other: Any) -> bool:
        if isinstance(other, Move):
            return (self.from_r == other.from_r and self.from_c == other.from_c and
                    self.to_r == other.to_r and self.to_c == other.to_c and
                    self.promotion == other.promotion)
        return False


# Offsets for knight moves
KNIGHT_OFFSETS = [
    (-2, -1), (-2, 1),
    (-1, -2), (-1, 2),
    (1, -2),  (1, 2),
    (2, -1),  (2, 1)
]

# Directions for sliding pieces
ROOK_DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
BISHOP_DIRECTIONS = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
QUEEN_DIRECTIONS = ROOK_DIRECTIONS + BISHOP_DIRECTIONS
KING_OFFSETS = QUEEN_DIRECTIONS


def get_attackers_of_square(board: Board, target_r: int, target_c: int, by_color: str) -> List[Tuple[int, int]]:
    """
    Find all pieces of `by_color` that directly attack the square (target_r, target_c).
    Returns list of (row, col) coordinates of attacker pieces.
    """
    by_color = by_color.lower()
    attackers: List[Tuple[int, int]] = []

    # 1. Pawns attacking target_r, target_c
    # If attacker is white ('w'), pawns move up (decreasing row), so they attack from target_r + 1
    # If attacker is black ('b'), pawns move down (increasing row), so they attack from target_r - 1
    pawn_row = target_r + 1 if by_color == 'w' else target_r - 1
    for pawn_col in (target_c - 1, target_c + 1):
        if is_valid_coord(pawn_row, pawn_col):
            p = board.get_piece(pawn_row, pawn_col)
            if p is not None and p.color == by_color and p.piece_type == 'P':
                attackers.append((pawn_row, pawn_col))

    # 2. Knights attacking target_r, target_c
    for dr, dc in KNIGHT_OFFSETS:
        nr, nc = target_r + dr, target_c + dc
        if is_valid_coord(nr, nc):
            p = board.get_piece(nr, nc)
            if p is not None and p.color == by_color and p.piece_type == 'N':
                attackers.append((nr, nc))

    # 3. King attacking target_r, target_c (adjacent square)
    for dr, dc in KING_OFFSETS:
        nr, nc = target_r + dr, target_c + dc
        if is_valid_coord(nr, nc):
            p = board.get_piece(nr, nc)
            if p is not None and p.color == by_color and p.piece_type == 'K':
                attackers.append((nr, nc))

    # 4. Orthogonal sliders (Rook, Queen)
    for dr, dc in ROOK_DIRECTIONS:
        curr_r, curr_c = target_r + dr, target_c + dc
        while is_valid_coord(curr_r, curr_c):
            p = board.get_piece(curr_r, curr_c)
            if p is not None:
                if p.color == by_color and p.piece_type in ('R', 'Q'):
                    attackers.append((curr_r, curr_c))
                break  # Blocked by piece
            curr_r += dr
            curr_c += dc

    # 5. Diagonal sliders (Bishop, Queen)
    for dr, dc in BISHOP_DIRECTIONS:
        curr_r, curr_c = target_r + dr, target_c + dc
        while is_valid_coord(curr_r, curr_c):
            p = board.get_piece(curr_r, curr_c)
            if p is not None:
                if p.color == by_color and p.piece_type in ('B', 'Q'):
                    attackers.append((curr_r, curr_c))
                break  # Blocked by piece
            curr_r += dr
            curr_c += dc

    return attackers


def is_square_attacked(board: Board, target_r: int, target_c: int, by_color: str) -> bool:
    """Check if (target_r, target_c) is under attack by any piece of `by_color`."""
    return len(get_attackers_of_square(board, target_r, target_c, by_color)) > 0


def is_in_check(board: Board, color: str) -> bool:
    """Check if the king of `color` is currently under attack (in check)."""
    king_pos = board.find_king(color)
    if king_pos is None:
        return False
    opponent_color = 'b' if color.lower() == 'w' else 'w'
    return is_square_attacked(board, king_pos[0], king_pos[1], opponent_color)


def generate_pseudo_legal_moves(board: Board, color: str) -> List[Move]:
    """
    Generate all pseudo-legal moves for player `color`.
    (Moves that follow piece movement rules, regardless of leaving the king in check).
    """
    color = color.lower()
    moves: List[Move] = []

    for r in range(8):
        for c in range(8):
            p = board.get_piece(r, c)
            if p is None or p.color != color:
                continue

            ptype = p.piece_type

            # --- PAWN MOVES ---
            if ptype == 'P':
                forward_dir = -1 if color == 'w' else 1
                start_row = 6 if color == 'w' else 1
                promo_row = 0 if color == 'w' else 7

                # 1 square forward
                fwd_r = r + forward_dir
                if is_valid_coord(fwd_r, c) and board.get_piece(fwd_r, c) is None:
                    if fwd_r == promo_row:
                        for prom in ('Q', 'R', 'B', 'N'):
                            moves.append(Move(r, c, fwd_r, c, promotion=prom, piece=p))
                    else:
                        moves.append(Move(r, c, fwd_r, c, piece=p))

                    # 2 squares forward from starting rank
                    if r == start_row:
                        fwd2_r = r + 2 * forward_dir
                        if board.get_piece(fwd2_r, c) is None:
                            moves.append(Move(r, c, fwd2_r, c, piece=p))

                # Diagonal captures
                for dc in (-1, 1):
                    cap_c = c + dc
                    if is_valid_coord(fwd_r, cap_c):
                        target_piece = board.get_piece(fwd_r, cap_c)
                        if target_piece is not None and target_piece.color != color:
                            if fwd_r == promo_row:
                                for prom in ('Q', 'R', 'B', 'N'):
                                    moves.append(Move(r, c, fwd_r, cap_c, promotion=prom, piece=p, captured=target_piece))
                            else:
                                moves.append(Move(r, c, fwd_r, cap_c, piece=p, captured=target_piece))

            # --- KNIGHT MOVES ---
            elif ptype == 'N':
                for dr, dc in KNIGHT_OFFSETS:
                    nr, nc = r + dr, c + dc
                    if is_valid_coord(nr, nc):
                        target = board.get_piece(nr, nc)
                        if target is None or target.color != color:
                            moves.append(Move(r, c, nr, nc, piece=p, captured=target))

            # --- BISHOP / ROOK / QUEEN MOVES ---
            elif ptype in ('B', 'R', 'Q'):
                dirs = []
                if ptype in ('R', 'Q'):
                    dirs.extend(ROOK_DIRECTIONS)
                if ptype in ('B', 'Q'):
                    dirs.extend(BISHOP_DIRECTIONS)

                for dr, dc in dirs:
                    curr_r, curr_c = r + dr, c + dc
                    while is_valid_coord(curr_r, curr_c):
                        target = board.get_piece(curr_r, curr_c)
                        if target is None:
                            moves.append(Move(r, c, curr_r, curr_c, piece=p))
                        else:
                            if target.color != color:
                                moves.append(Move(r, c, curr_r, curr_c, piece=p, captured=target))
                            break  # Hit a piece, cannot continue along ray
                        curr_r += dr
                        curr_c += dc

            # --- KING MOVES ---
            elif ptype == 'K':
                for dr, dc in KING_OFFSETS:
                    nr, nc = r + dr, c + dc
                    if is_valid_coord(nr, nc):
                        target = board.get_piece(nr, nc)
                        if target is None or target.color != color:
                            moves.append(Move(r, c, nr, nc, piece=p, captured=target))

    return moves


def apply_move(board: Board, move: Move) -> Board:
    """Return a new board with the move executed."""
    next_board = board.clone()
    piece = next_board.get_piece(move.from_r, move.from_c)
    next_board.set_piece(move.from_r, move.from_c, None)

    if move.promotion and piece is not None:
        next_board.set_piece(move.to_r, move.to_c, Piece(piece.color, move.promotion))
    else:
        next_board.set_piece(move.to_r, move.to_c, piece)

    return next_board


def generate_legal_moves(board: Board, color: str) -> List[Move]:
    """
    Generate all strictly legal moves for `color`.
    A pseudo-legal move is legal if and only if the moving player's king
    is NOT left in check after the move is made.
    """
    pseudo_moves = generate_pseudo_legal_moves(board, color)
    legal_moves: List[Move] = []

    for move in pseudo_moves:
        board_after = apply_move(board, move)
        if not is_in_check(board_after, color):
            legal_moves.append(move)

    return legal_moves
