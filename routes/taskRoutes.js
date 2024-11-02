// routes/taskRoutes.js
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const taskRoutes = (req, res) => {
    if (req.method === 'GET') {
        getTasks(req, res);
    } else if (req.method === 'POST') {
        createTask(req, res);
    } else if (req.method === 'PATCH') {
        updateTask(req, res);
    } else if (req.method === 'DELETE') {
        deleteTask(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Method Not Allowed.' }));
    }
};

module.exports = taskRoutes;
