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
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error parsing form data.' }));
            return;
        }

        const tasks = readTasksFromFile();
        const newTask = {
            id: Date.now(), // Corrected `Data.now()` typo
            title: fields.title,
            description: fields.description || '',
            status: fields.status || 'pending',
            image: files.image ? `/uploads/${files.image.originalFilename}` : null
        };

        tasks.push(newTask);
        writeTasksToFile(tasks);

        // Save the image if provided
        if (files.image) {
            const uploadPath = path.join(__dirname, '../uploads', files.image.originalFilename);
            fs.copyFileSync(files.image.filepath, uploadPath); // Updated copy logic
        }

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newTask));
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

        // Update task properties
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

