#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # If it's a file request (has extension), serve it normally
        if '.' in os.path.basename(path):
            return super().do_GET()
        
        # For all other routes (React Router routes), serve index.html
        if path != '/':
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == "__main__":
    PORT = 5178
    
    # Change to the dist directory
    os.chdir('dist')
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"🚀 SPA Server running on http://localhost:{PORT}")
        print(f"📱 Open: http://localhost:{PORT}")
        print("✅ React Router navigation supported")
        httpd.serve_forever()
