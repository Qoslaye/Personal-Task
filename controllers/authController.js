// authController.js
exports.login = (req, res) => {
    // Simple example - this would be more complex with real auth
    const token = "fake-token";
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token }));
};
