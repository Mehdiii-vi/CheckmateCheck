"""
CheckmateCheck - Unified Launcher Script
Runs the Python Backend & Serves the Modern Academic Frontend
"""

import sys
import os
import webbrowser
import threading
import time

def print_banner(port):
    print("=" * 70)
    print("  ♔ CheckmateCheck - Academic Chess Analyzer Engine ♔")
    print("  Modular Python Backend + UI/UX Pro Max Presentation Frontend")
    print("=" * 70)
    print(f"  [+] Web UI Running at:       http://localhost:{port}")
    print(f"  [+] REST API Health Check:  http://localhost:{port}/api/health")
    print(f"  [+] Presets Catalog:        http://localhost:{port}/api/presets")
    print(f"  [+] Analysis Endpoint:      POST http://localhost:{port}/api/analyze")
    print("=" * 70)
    print("  Press Ctrl+C to terminate the server.\n")

def open_browser(port):
    time.sleep(1.2)
    url = f"http://localhost:{port}"
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    # Auto-open browser in background thread
    threading.Thread(target=open_browser, args=(port,), daemon=True).start()

    print_banner(port)

    # Import and run backend app
    try:
        from backend.app import app
        app.run(host="0.0.0.0", port=port, debug=False)
    except KeyboardInterrupt:
        print("\n[+] CheckmateCheck server safely terminated.")
        sys.exit(0)
    except Exception as e:
        print(f"\n[!] Error launching server: {e}")
        sys.exit(1)
