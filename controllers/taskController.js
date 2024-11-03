const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const { readTasksFromFile, writeTasksToFile } = require('../utils/fileHandler');

exports.getTasks = (req, res) => {
    const tasks = readTasksFromFile();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
};

exports.createTask = (req, res) => {
    const form = new IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads');
    form.keepExtensions = true;

    // Log to confirm directory existence
    console.log("Upload directory:", form.uploadDir);

    // Ensure the upload directory exists
    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, { recursive: true });
        console.log("Upload directory created.");
    }

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Error parsing form data.' }));
        }

        const tasks = readTasksFromFile();

        let imagePath = null;
        if (files.image && files.image.filepath) {
            console.log("File path received:", files.image.filepath);

            const originalFileName = files.image.originalFilename || 'uploaded_image';
            const newFilePath = path.join(form.uploadDir, originalFileName);

            try {
                const stat = fs.statSync(files.image.filepath);
                if (!stat.isDirectory()) {
                    // Move file to the new location
                    fs.renameSync(files.image.filepath, newFilePath);
                    imagePath = `/uploads/${originalFileName}`;
                    console.log("File successfully moved to:", newFilePath);
                } else {
                    console.error("Error: The filepath is a directory, not a file.");
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Uploaded file path is a directory, not a file.' }));
                }
            } catch (error) {
                console.error("Error handling file operation:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error saving the uploaded file.' }));
            }
        }

        const newTask = {
            id: Date.now(),
            title: fields.title,
            description: fields.description || '',
            status: fields.status || 'pending',
            image: imagePath
        };

        tasks.push(newTask);
        writeTasksToFile(tasks);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(newTask));
    });
};


exports.updateTask = (req, res) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error parsing form data.' }));
            return;
        }

        const taskId = parseInt(fields.id, 10);
        const tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task not found.' }));
            return;
        }

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: fields.title || tasks[taskIndex].title,
            description: fields.description || tasks[taskIndex].description,
            status: fields.status || tasks[taskIndex].status
        };

        writeTasksToFile(tasks);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks[taskIndex]));
    });
};

exports.deleteTask = (req, res) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error parsing form data.' }));
            return;
        }

        const taskId = parseInt(fields.id, 10);
        const tasks = readTasksFromFile();
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        if (tasks.length === updatedTasks.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task not found.' }));
            return;
        }

        writeTasksToFile(updatedTasks);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task deleted successfully.' }));
    });
};
