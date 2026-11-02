import unittest
from engine.board import Board
from engine.evaluator import evaluate_board


class TestChessEvaluator(unittest.TestCase):

    def test_initial_board_is_normal(self):
        """Initial board state has 20 legal moves for White, no check."""
        board = Board()
        board.setup_initial()
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "NORMAL")
        self.assertFalse(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 20)

    def test_fools_mate(self):
        """Fool's Mate: White King is checkmated by Black Queen on h4."""
        board = Board()
        # 1. f3 e5 2. g4 Qh4#
        board.load_fen("rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3")
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "CHECKMATE")
        self.assertTrue(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)
        self.assertEqual(result["king_square"], "e1")
        self.assertEqual(len(result["checking_pieces"]), 1)
        self.assertEqual(result["checking_pieces"][0]["square"], "h4")

    def test_scholars_mate(self):
        """Scholar's Mate: Black King is checkmated on f7 by White Queen."""
        board = Board()
        board.load_fen("r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4")
        result = evaluate_board(board, 'b')
        self.assertEqual(result["status"], "CHECKMATE")
        self.assertTrue(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)
        self.assertEqual(result["king_square"], "e8")

    def test_smothered_mate(self):
        """Smothered Mate: Black King on h8 trapped by own pieces and mated by Knight on f7."""
        board = Board()
        board.load_fen("6rk/5Npp/8/8/8/8/8/7K b - - 0 1")
        result = evaluate_board(board, 'b')
        self.assertEqual(result["status"], "CHECKMATE")
        self.assertTrue(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)
        self.assertEqual(result["king_square"], "h8")
        self.assertEqual(result["checking_pieces"][0]["square"], "f7")

    def test_back_rank_mate(self):
        """Back rank mate: Black King trapped behind pawns and mated by Rook on d8."""
        board = Board()
        board.load_fen("3R2k1/5ppp/8/8/8/8/8/6K1 b - - 1 1")
        result = evaluate_board(board, 'b')
        self.assertEqual(result["status"], "CHECKMATE")
        self.assertTrue(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)

    def test_classic_queen_stalemate(self):
        """Classic Stalemate: Black King in corner on a8, Queen on c7, White King on b6."""
        board = Board()
        board.load_fen("k7/2Q5/1K6/8/8/8/8/8 b - - 0 1")
        result = evaluate_board(board, 'b')
        self.assertEqual(result["status"], "STALEMATE")
        self.assertFalse(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)

    def test_pawn_lock_stalemate(self):
        """Stalemate with pawn lock: Black King on a8 trapped by pawn on a7 and King on a6."""
        board = Board()
        board.load_fen("k7/P7/K7/8/8/8/8/8 b - - 0 1")
        result = evaluate_board(board, 'b')
        self.assertEqual(result["status"], "STALEMATE")
        self.assertFalse(result["in_check"])
        self.assertEqual(result["legal_moves_count"], 0)

    def test_check_with_valid_defense(self):
        """Check where defender can block: White King in check by Qh4, can block with g2-g3."""
        board = Board()
        board.load_fen("rnbqkbnr/pppp1ppp/8/4p3/5P1q/8/PPPPP1PP/RNBQKBNR w KQkq - 1 3")
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "CHECK")
        self.assertTrue(result["in_check"])
        self.assertGreater(result["legal_moves_count"], 0)
        # Should contain g2-g3 move
        legal_ucis = [m["uci"] for m in result["legal_moves"]]
        self.assertIn("g2g3", legal_ucis)

    def test_invalid_board_missing_king(self):
        """Board missing a king is invalid."""
        board = Board()
        board.load_fen("8/8/8/8/8/8/8/4K3 w - - 0 1")
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "INVALID")

    def test_invalid_board_opponent_in_check(self):
        """Opponent king in check when it's our turn is an illegal board state."""
        board = Board()
        # White turn ('w'), but Black King is attacked by White Rook on e1 while Black King is on e8 with open file
        board.load_fen("4k3/8/8/8/8/8/8/4R2K w - - 0 1")
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "INVALID")

    def test_invalid_board_pawn_on_rank_8(self):
        """Pawns on the 8th or 1st rank are invalid."""
        board = Board()
        board.load_fen("4P2k/8/8/8/8/8/8/4K3 w - - 0 1")
        result = evaluate_board(board, 'w')
        self.assertEqual(result["status"], "INVALID")


if __name__ == '__main__':
    unittest.main()
