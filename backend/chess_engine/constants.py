"""
Chess Engine Constants and Types
CheckmateCheck - Academic Chess Analyzer
"""

# Piece Color Constants
WHITE = "w"
BLACK = "b"
COLORS = [WHITE, BLACK]

# Piece Type Constants
KING = "K"
QUEEN = "Q"
ROOK = "R"
BISHOP = "B"
KNIGHT = "N"
PAWN = "P"
PIECE_TYPES = [KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN]

# Persian and English Names
PIECE_NAMES_FA = {
    KING: "شاه",
    QUEEN: "وزیر",
    ROOK: "رخ",
    BISHOP: "فیل",
    KNIGHT: "اسب",
    PAWN: "پیاده"
}

COLOR_NAMES_FA = {
    WHITE: "سفید",
    BLACK: "سیاه"
}

PIECE_NAMES_EN = {
    KING: "King",
    QUEEN: "Queen",
    ROOK: "Rook",
    BISHOP: "Bishop",
    KNIGHT: "Knight",
    PAWN: "Pawn"
}

COLOR_NAMES_EN = {
    WHITE: "White",
    BLACK: "Black"
}

# Standard Unicode Symbols
UNICODE_PIECES = {
    "wK": "♔", "wQ": "♕", "wR": "♖", "wB": "♗", "wN": "♘", "wP": "♙",
    "bK": "♚", "bQ": "♛", "bR": "♜", "bB": "♝", "bN": "♞", "bP": "♟"
}

# Movement Vector Definitions (delta_row, delta_col)
# Row 0 is Rank 8 (top), Row 7 is Rank 1 (bottom).
# Col 0 is File 'a' (left), Col 7 is File 'h' (right).

# Orthogonal directions (Rook & Queen)
ORTHOGONAL_DIRECTIONS = [
    (-1, 0),  # North (up towards rank 8)
    (1, 0),   # South (down towards rank 1)
    (0, -1),  # West (left towards file a)
    (0, 1)    # East (right towards file h)
]

# Diagonal directions (Bishop & Queen)
DIAGONAL_DIRECTIONS = [
    (-1, -1), # North-West
    (-1, 1),  # North-East
    (1, -1),  # South-West
    (1, 1)    # South-East
]

# King moves (all 8 directions, 1 step)
KING_DIRECTIONS = ORTHOGONAL_DIRECTIONS + DIAGONAL_DIRECTIONS

# Knight leap offsets
KNIGHT_OFFSETS = [
    (-2, -1), (-2, 1),
    (-1, -2), (-1, 2),
    (1, -2),  (1, 2),
    (2, -1),  (2, 1)
]

# Pawn attack direction offsets (from pawn's perspective)
# White pawns advance upwards (row decreases: -1), attack diagonally: (-1, -1), (-1, 1)
# Black pawns advance downwards (row increases: +1), attack diagonally: (1, -1), (1, 1)
PAWN_ATTACK_OFFSETS = {
    WHITE: [(-1, -1), (-1, 1)],
    BLACK: [(1, -1), (1, 1)]
}

# Status Definitions
STATUS_SAFE = "SAFE"
STATUS_CHECK = "CHECK"
STATUS_CHECKMATE = "CHECKMATE"
STATUS_STALEMATE = "STALEMATE"

STATUS_LABELS_FA = {
    STATUS_SAFE: "امن (عادی)",
    STATUS_CHECK: "در وضعیت کیش",
    STATUS_CHECKMATE: "کیش و مات",
    STATUS_STALEMATE: "پات (بدون حرکت مجاز)"
}

STATUS_LABELS_EN = {
    STATUS_SAFE: "Safe",
    STATUS_CHECK: "In Check",
    STATUS_CHECKMATE: "Checkmate",
    STATUS_STALEMATE: "Stalemate"
}
