const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const filePath = path.join(__dirname, 'public', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
    const extname = path.extname(filePath);
    
    // Determine content type
    let contentType = 'text/html';
    if (extname === '.css') contentType = 'text/css';
    else if (extname === '.js') contentType = 'application/javascript';

    // Route to write data to a file (POST request to "/save-data")
    if (req.method === 'POST' && parsedUrl.pathname === '/save-data') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFile(path.join(__dirname, 'uploads', 'data.txt'), body, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Failed to save data');
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Data saved successfully');
            });
        });
    }
    // Route to read data from the file (GET request to "/get-data")
    else if (req.method === 'GET' && parsedUrl.pathname === '/get-data') {
        fs.readFile(path.join(__dirname, 'uploads', 'data.txt'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Failed to read data');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }
    // Serve static files (HTML, CSS, JS)
    else {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
