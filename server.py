from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

handler = CustomHandler
port = 5000

with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
    print(f"Server running at port {port}")
    httpd.serve_forever()
