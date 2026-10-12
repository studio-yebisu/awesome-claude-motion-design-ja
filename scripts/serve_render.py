"""Serve a frozen Vite build. Source edits cannot reload frame captures."""
import functools
import http.server
from pathlib import Path

root = Path(__file__).resolve().parents[1] / '.qa/runtime-dist'

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(root)))
print(f'Frozen examples: http://127.0.0.1:{server.server_port}/', flush=True)
server.serve_forever()
