"""
CheckmateCheck Local Web Server
Runs a lightweight HTTP server using Python's standard library.
Serves static UI files and handles POST /api/evaluate requests.
"""
import sys
import os
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from typing import Dict, Any

# Ensure project root is in python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from engine.board import Board
from engine.evaluator import evaluate_board


class ChessRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(BASE_DIR, 'static'), **kwargs)

    def do_POST(self):
        if self.path == '/api/evaluate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode('utf-8'))
                active_turn = data.get('active_turn', 'w')
                board = Board()

                if 'fen' in data and data['fen']:
                    board.load_fen(data['fen'])
                    if 'active_turn' not in data:
                        active_turn = board.load_fen(data['fen'])
                elif 'grid' in data and data['grid']:
                    board.from_2d_array(data['grid'])
                else:
                    board.setup_initial()

                result = evaluate_board(board, active_turn)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))

            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                err_res = {"status": "ERROR", "message": str(e)}
                self.wfile.write(json.dumps(err_res, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def run_server(port: int = 8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ChessRequestHandler)
    print(f"==================================================")
    print(f" CheckmateCheck Server Running at http://localhost:{port}")
    print(f" Serving UI from: {os.path.join(BASE_DIR, 'static')}")
    print(f" API Endpoint: POST http://localhost:{port}/api/evaluate")
    print(f" Press Ctrl+C to stop.")
    print(f"==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
