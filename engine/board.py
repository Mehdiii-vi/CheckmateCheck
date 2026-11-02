"""
Board representation and coordinate utilities for CheckmateCheck engine.
"""
from typing import Optional, Tuple, List, Dict, Any


def coords_to_square(r: int, c: int) -> str:
    """Convert (row, col) coordinates (0-7, 0-7) to algebraic notation like 'e4'."""
    file_char = chr(ord('a') + c)
    rank_char = str(8 - r)
    return f"{file_char}{rank_char}"


def square_to_coords(sq: str) -> Tuple[int, int]:
    """Convert algebraic notation like 'e4' to (row, col)."""
    sq = sq.strip().lower()
    c = ord(sq[0]) - ord('a')
    r = 8 - int(sq[1])
    return r, c


def is_valid_coord(r: int, c: int) -> bool:
    """Check if (r, c) is within the 8x8 board boundaries."""
    return 0 <= r < 8 and 0 <= c < 8


class Piece:
    __slots__ = ('color', 'piece_type')

    def __init__(self, color: str, piece_type: str):
        # color: 'w' or 'b'
        # piece_type: 'P', 'N', 'B', 'R', 'Q', 'K'
        self.color = color.lower()
        self.piece_type = piece_type.upper()

    @property
    def symbol(self) -> str:
        """Uppercase for white, lowercase for black (standard FEN piece symbol)."""
        return self.piece_type if self.color == 'w' else self.piece_type.lower()

    @property
    def code(self) -> str:
        """Two-letter code e.g. 'wK', 'bQ', 'wP'."""
        return f"{self.color}{self.piece_type}"

    @classmethod
    def from_symbol(cls, symbol: str) -> 'Piece':
        color = 'w' if symbol.isupper() else 'b'
        piece_type = symbol.upper()
        return cls(color, piece_type)

    @classmethod
    def from_code(cls, code: str) -> 'Piece':
        color = code[0].lower()
        piece_type = code[1].upper()
        return cls(color, piece_type)

    def __repr__(self) -> str:
        return f"Piece({self.code})"

    def __eq__(self, other: Any) -> bool:
        if isinstance(other, Piece):
            return self.color == other.color and self.piece_type == other.piece_type
        return False


class Board:
    def __init__(self):
        # 8x8 grid: grid[row][col], row 0 is Rank 8, row 7 is Rank 1
        self.grid: List[List[Optional[Piece]]] = [[None for _ in range(8)] for _ in range(8)]

    def get_piece(self, r: int, c: int) -> Optional[Piece]:
        if not is_valid_coord(r, c):
            return None
        return self.grid[r][c]

    def set_piece(self, r: int, c: int, piece: Optional[Piece]) -> None:
        if is_valid_coord(r, c):
            self.grid[r][c] = piece

    def clear(self) -> None:
        self.grid = [[None for _ in range(8)] for _ in range(8)]

    def clone(self) -> 'Board':
        """Create a deep copy of the board."""
        new_board = Board()
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p is not None:
                    new_board.grid[r][c] = Piece(p.color, p.piece_type)
        return new_board

    def find_king(self, color: str) -> Optional[Tuple[int, int]]:
        """Find the (row, col) coordinates of the king of the given color."""
        color = color.lower()
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p is not None and p.piece_type == 'K' and p.color == color:
                    return r, c
        return None

    def count_kings(self, color: str) -> int:
        color = color.lower()
        count = 0
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p is not None and p.piece_type == 'K' and p.color == color:
                    count += 1
        return count

    def setup_initial(self) -> None:
        """Setup standard starting chess position."""
        self.load_fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    def load_fen(self, fen: str) -> str:
        """
        Load board from FEN string. Returns the active turn ('w' or 'b').
        """
        self.clear()
        parts = fen.strip().split()
        if not parts:
            return 'w'

        rows = parts[0].split('/')
        for r, row_str in enumerate(rows):
            if r >= 8:
                break
            c = 0
            for ch in row_str:
                if c >= 8:
                    break
                if ch.isdigit():
                    c += int(ch)
                else:
                    self.grid[r][c] = Piece.from_symbol(ch)
                    c += 1

        active_turn = 'w'
        if len(parts) > 1 and parts[1].lower() in ('w', 'b'):
            active_turn = parts[1].lower()

        return active_turn

    def to_fen(self, active_turn: str = 'w') -> str:
        """Generate FEN position string."""
        row_strs = []
        for r in range(8):
            empty_count = 0
            row_chars = []
            for c in range(8):
                p = self.grid[r][c]
                if p is None:
                    empty_count += 1
                else:
                    if empty_count > 0:
                        row_chars.append(str(empty_count))
                        empty_count = 0
                    row_chars.append(p.symbol)
            if empty_count > 0:
                row_chars.append(str(empty_count))
            row_strs.append("".join(row_chars))

        board_fen = "/".join(row_strs)
        return f"{board_fen} {active_turn} - - 0 1"

    def from_2d_array(self, arr: List[List[Optional[str]]]) -> None:
        """
        Load board from 8x8 array of piece codes (e.g. 'wP', 'bK', None, '').
        """
        self.clear()
        for r in range(min(8, len(arr))):
            for c in range(min(8, len(arr[r]))):
                code = arr[r][c]
                if code and isinstance(code, str) and len(code) == 2:
                    self.grid[r][c] = Piece.from_code(code)

    def to_2d_array(self) -> List[List[Optional[str]]]:
        """Convert board to 8x8 list of piece codes."""
        return [
            [self.grid[r][c].code if self.grid[r][c] is not None else None for c in range(8)]
            for r in range(8)
        ]
