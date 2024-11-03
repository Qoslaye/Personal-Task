const { login } = require('../controllers/authController');

const authRoutes = (req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
        login(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Method Not Allowed.' }));
    }
};

module.exports = authRoutes;
