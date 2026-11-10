"""
ChessBoard Representation and Utility Functions
CheckmateCheck - Academic Chess Analyzer
"""

from typing import Optional, Dict, Any, List, Tuple
from .constants import (
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    PIECE_TYPES, COLORS
)

def in_bounds(r: int, c: int) -> bool:
    """Check if row and col are within the 8x8 chessboard."""
    return 0 <= r < 8 and 0 <= c < 8

def to_notation(r: int, c: int) -> str:
    """Convert (row, col) matrix index to algebraic notation (e.g., (7, 4) -> 'e1')."""
    file_char = chr(ord('a') + c)
    rank_char = str(8 - r)
    return f"{file_char}{rank_char}"

def from_notation(notation: str) -> Tuple[int, int]:
    """Convert algebraic notation (e.g., 'e1') to (row, col) matrix index."""
    if len(notation) != 2:
        raise ValueError(f"Invalid notation: {notation}")
    file_char = notation[0].lower()
    rank_char = notation[1]
    c = ord(file_char) - ord('a')
    r = 8 - int(rank_char)
    if not in_bounds(r, c):
        raise ValueError(f"Out of bounds notation: {notation}")
    return r, c


class Piece:
    """Represents a chess piece with color and type."""
    def __init__(self, color: str, piece_type: str):
        if color not in COLORS:
            raise ValueError(f"Invalid color: {color}")
        if piece_type not in PIECE_TYPES:
            raise ValueError(f"Invalid piece type: {piece_type}")
        self.color = color
        self.type = piece_type

    def to_dict(self) -> Dict[str, str]:
        return {"color": self.color, "type": self.type}

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> 'Piece':
        return cls(color=data["color"], piece_type=data["type"])

    def symbol(self) -> str:
        """Returns standard FEN symbol: Uppercase for White, Lowercase for Black."""
        return self.type.upper() if self.color == WHITE else self.type.lower()

    def code(self) -> str:
        """Returns 'wK', 'bQ', etc."""
        return f"{self.color}{self.type}"

    def __repr__(self) -> str:
        return f"Piece({self.code()})"

    def __eq__(self, other) -> bool:
        if isinstance(other, Piece):
            return self.color == other.color and self.type == other.type
        return False


class ChessBoard:
    """
    Represents an 8x8 Chess Board.
    Grid index (0,0) is 'a8', (7,7) is 'h1'.
    """
    def __init__(self):
        self.grid: List[List[Optional[Piece]]] = [[None for _ in range(8)] for _ in range(8)]

    def clear(self) -> None:
        """Reset board to completely empty."""
        self.grid = [[None for _ in range(8)] for _ in range(8)]

    def get_piece(self, r: int, c: int) -> Optional[Piece]:
        if not in_bounds(r, c):
            return None
        return self.grid[r][c]

    def set_piece(self, r: int, c: int, piece: Optional[Piece]) -> None:
        if not in_bounds(r, c):
            raise IndexError(f"Position ({r}, {c}) is outside the board.")
        self.grid[r][c] = piece

    def find_kings(self) -> Dict[str, List[Tuple[int, int]]]:
        """Returns coordinates of all kings grouped by color."""
        kings = {WHITE: [], BLACK: []}
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p and p.type == KING:
                    kings[p.color].append((r, c))
        return kings

    def find_pieces_by_color(self, color: str) -> List[Tuple[int, int, Piece]]:
        """Returns list of (row, col, piece) for all pieces of given color."""
        result = []
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p and p.color == color:
                    result.append((r, c, p))
        return result

    def copy(self) -> 'ChessBoard':
        """Deep copy of the board."""
        new_board = ChessBoard()
        for r in range(8):
            for c in range(8):
                p = self.grid[r][c]
                if p:
                    new_board.grid[r][c] = Piece(p.color, p.type)
        return new_board

    def to_matrix_dict(self) -> List[List[Optional[Dict[str, str]]]]:
        """Serializes board into a JSON-friendly 8x8 matrix."""
        matrix = []
        for r in range(8):
            row = []
            for c in range(8):
                p = self.grid[r][c]
                row.append(p.to_dict() if p else None)
            matrix.append(row)
        return matrix

    @classmethod
    def from_matrix_dict(cls, matrix: List[List[Optional[Dict[str, str]]]]) -> 'ChessBoard':
        """Loads board from an 8x8 matrix of dicts or None."""
        board = cls()
        if len(matrix) != 8:
            raise ValueError("Matrix must contain 8 rows")
        for r in range(8):
            if len(matrix[r]) != 8:
                raise ValueError(f"Row {r} must contain 8 columns")
            for c in range(8):
                item = matrix[r][c]
                if item:
                    board.grid[r][c] = Piece(item["color"], item["type"])
        return board

    def to_fen_board(self) -> str:
        """Serializes piece positions to standard FEN board section."""
        fen_rows = []
        for r in range(8):
            empty_count = 0
            row_str = ""
            for c in range(8):
                p = self.grid[r][c]
                if p is None:
                    empty_count += 1
                else:
                    if empty_count > 0:
                        row_str += str(empty_count)
                        empty_count = 0
                    row_str += p.symbol()
            if empty_count > 0:
                row_str += str(empty_count)
            fen_rows.append(row_str)
        return "/".join(fen_rows)

    @classmethod
    def from_fen_board(cls, fen: str) -> 'ChessBoard':
        """Loads piece positions from a FEN board section string."""
        board = cls()
        fen_clean = fen.split()[0]  # Just piece placement if full FEN provided
        rows = fen_clean.split('/')
        if len(rows) != 8:
            raise ValueError(f"Invalid FEN rows: expected 8, got {len(rows)}")

        symbol_map = {
            'K': (WHITE, KING), 'Q': (WHITE, QUEEN), 'R': (WHITE, ROOK),
            'B': (WHITE, BISHOP), 'N': (WHITE, KNIGHT), 'P': (WHITE, PAWN),
            'k': (BLACK, KING), 'q': (BLACK, QUEEN), 'r': (BLACK, ROOK),
            'b': (BLACK, BISHOP), 'n': (BLACK, KNIGHT), 'p': (BLACK, PAWN)
        }

        for r, row_str in enumerate(rows):
            c = 0
            for ch in row_str:
                if ch.isdigit():
                    c += int(ch)
                elif ch in symbol_map:
                    color, p_type = symbol_map[ch]
                    board.grid[r][c] = Piece(color, p_type)
                    c += 1
                else:
                    raise ValueError(f"Unrecognized FEN character: {ch}")
        return board

    def setup_initial_position(self) -> None:
        """Sets standard starting position of chess."""
        self.clear()
        initial_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        initial_board = ChessBoard.from_fen_board(initial_fen)
        self.grid = initial_board.grid
