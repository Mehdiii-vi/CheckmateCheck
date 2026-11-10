"""
Automated Unit Tests for Chess Solver
CheckmateCheck - Academic Chess Analyzer
"""

import unittest
from backend.chess_engine import (
    ChessBoard, Piece, analyze_board_state,
    WHITE, BLACK, KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN,
    STATUS_SAFE, STATUS_CHECK, STATUS_CHECKMATE, STATUS_STALEMATE
)

class TestChessSolver(unittest.TestCase):

    def test_initial_board_is_safe(self):
        """Standard starting board should be valid and both kings safe."""
        board = ChessBoard()
        board.setup_initial_position()
        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["overall_status"], STATUS_SAFE)
        self.assertEqual(result["white"]["status"], STATUS_SAFE)
        self.assertEqual(result["black"]["status"], STATUS_SAFE)

    def test_scholars_mate(self):
        """
        Scholar's Mate: 1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#
        FEN: r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR
        Black should be CHECKMATE.
        """
        fen = "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR"
        board = ChessBoard.from_fen_board(fen)
        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["overall_status"], STATUS_CHECKMATE)
        self.assertEqual(result["affected_side"], BLACK)
        self.assertEqual(result["black"]["status"], STATUS_CHECKMATE)
        self.assertEqual(result["white"]["status"], STATUS_SAFE)

    def test_fools_mate(self):
        """
        Fool's Mate: 1. f3 e5 2. g4 Qh4#
        FEN: rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR
        White should be CHECKMATE.
        """
        fen = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR"
        board = ChessBoard.from_fen_board(fen)
        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["overall_status"], STATUS_CHECKMATE)
        self.assertEqual(result["affected_side"], WHITE)
        self.assertEqual(result["white"]["status"], STATUS_CHECKMATE)
        self.assertEqual(result["black"]["status"], STATUS_SAFE)

    def test_simple_check_with_evasion(self):
        """
        White king on e1, Black queen on e2 giving check,
        but White king can capture the queen on e2 or King moves.
        Board: White K at e1, Black Q at e2, Black K at e8.
        """
        board = ChessBoard()
        board.set_piece(7, 4, Piece(WHITE, KING))   # e1
        board.set_piece(0, 4, Piece(BLACK, KING))   # e8
        board.set_piece(6, 4, Piece(BLACK, QUEEN))  # e2
        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        # White can capture queen with King (since Queen is unsupported)
        self.assertEqual(result["overall_status"], STATUS_CHECK)
        self.assertEqual(result["white"]["status"], STATUS_CHECK)
        self.assertGreater(result["white"]["evasions"]["total_evasions_count"], 0)

    def test_classic_stalemate(self):
        """
        Classic Stalemate:
        Black King trapped on a8.
        White King on c7.
        White Queen on b6.
        Black King is NOT in check, but has 0 legal moves!
        """
        board = ChessBoard()
        board.set_piece(0, 0, Piece(BLACK, KING))   # a8: row 0, col 0
        board.set_piece(2, 1, Piece(WHITE, QUEEN))  # b6: row 2, col 1
        board.set_piece(1, 2, Piece(WHITE, KING))   # c7: row 1, col 2
        # At a8:
        # a7 attacked by Queen at b6 and King at c7
        # b8 attacked by King at c7 and Queen at b6
        # b7 attacked by Queen and King
        # Is a8 attacked? Queen at b6 does not attack a8 directly (b6 to a8 is dx=-1, dy=-2 -> knight move!).
        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["black"]["status"], STATUS_STALEMATE)
        self.assertEqual(result["overall_status"], STATUS_STALEMATE)
        self.assertEqual(result["affected_side"], BLACK)

    def test_invalid_missing_king(self):
        """Board with only White King and no Black King."""
        board = ChessBoard()
        board.set_piece(7, 4, Piece(WHITE, KING))
        result = analyze_board_state(board)
        self.assertFalse(result["is_valid"])
        self.assertIn("شاه سیاه در صفحه وجود ندارد.", result["summary_fa"])

    def test_invalid_adjacent_kings(self):
        """White King on e4 and Black King on e5 (adjacent)."""
        board = ChessBoard()
        board.set_piece(4, 4, Piece(WHITE, KING)) # e4
        board.set_piece(3, 4, Piece(BLACK, KING)) # e5
        result = analyze_board_state(board)
        self.assertFalse(result["is_valid"])
        self.assertTrue(any("مجاور" in err for err in result["validation"]["errors_fa"]))

    def test_invalid_pawn_on_rank_8(self):
        """Pawn on row 0 (Rank 8)."""
        board = ChessBoard()
        board.set_piece(7, 4, Piece(WHITE, KING))
        board.set_piece(0, 4, Piece(BLACK, KING))
        board.set_piece(0, 0, Piece(WHITE, PAWN)) # a8 pawn
        result = analyze_board_state(board)
        self.assertFalse(result["is_valid"])
        self.assertTrue(any("سطر ۸" in err for err in result["validation"]["errors_fa"]))

    def test_invalid_mutual_check(self):
        """
        Both kings in check at once:
        White King on e1 in check by Black Rook on e8.
        Black King on e8 in check by White Rook on e1.
        """
        board = ChessBoard()
        board.set_piece(7, 4, Piece(WHITE, KING)) # e1
        board.set_piece(0, 4, Piece(BLACK, KING)) # e8
        # Put black rook on a1 attacking white king on e1
        board.set_piece(7, 0, Piece(BLACK, ROOK))
        # Put white rook on a8 attacking black king on e8
        board.set_piece(0, 0, Piece(WHITE, ROOK))
        result = analyze_board_state(board)
        self.assertFalse(result["is_valid"])
        self.assertTrue(any("همزمان" in err for err in result["validation"]["errors_fa"]))

    def test_double_check_requires_king_move(self):
        """
        Double check on Black king on e8:
        White Knight gives check from d6.
        White Rook gives check from e1.
        Because it's double check, blocking or capturing one piece cannot evade both.
        Only King moves can evade.
        """
        board = ChessBoard()
        board.set_piece(0, 4, Piece(BLACK, KING))   # e8
        board.set_piece(7, 0, Piece(WHITE, KING))   # a1
        board.set_piece(7, 4, Piece(WHITE, ROOK))   # e1 gives check
        board.set_piece(2, 3, Piece(WHITE, KNIGHT)) # d6 gives check
        # Give Black a bishop on h5 that could potentially capture knight or block e-file if it were single check
        board.set_piece(3, 7, Piece(BLACK, BISHOP))

        result = analyze_board_state(board)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["black"]["status"], STATUS_CHECK)
        evasions = result["black"]["evasions"]
        self.assertTrue(evasions["is_double_check"])
        self.assertEqual(len(evasions["captures"]), 0) # Non-king capture cannot resolve double check
        self.assertEqual(len(evasions["blocks"]), 0)   # Non-king block cannot resolve double check

if __name__ == "__main__":
    unittest.main()
