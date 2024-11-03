const http = require('http');
const fs = require('fs');
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve the index.html file
        fs.readFile(path.join(__dirname, 'views', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url.startsWith('/tasks')) {
        taskRoutes(req, res);
    } else if (req.url.startsWith('/uploads')) {
        // Serve uploaded images
        const filePath = path.join(__dirname, req.url);
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            fs.createReadStream(filePath).pipe(res);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
