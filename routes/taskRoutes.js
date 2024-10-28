const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const taskRoutes = (req , res) =>{
    if (req.method === 'GET') { 
        getTasksks(req, res) ;
    } else if (req.method === 'POST') { 
        createTaskTask(req, res) ;
    } else if (req.method === 'PATCH') {  
        updateTaskteTask(req, res) ;
    } else if (req.method === 'DELETE') {  
        deleteTasketeTask(req, res) ;
    } else { 
        res.writeHead(404, 'Method Not Allowed', {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ 
            message : 'Unknown Method required.'
        }))
    }

}

module.exports = taskRoutes ;