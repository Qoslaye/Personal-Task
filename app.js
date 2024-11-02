// app.js
const http = require('http');
const taskRoutes = require('./routes/taskRoutes');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/tasks')) {
        taskRoutes(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found.' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
