const fs = require('fs');
const path = require('path');

const filePath = './data/tasks.json';

exports.writeTasksToFile = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

exports.readTasksFromFile = () => {
    if (!fs.existsSync(filePath)) {
        this.writeTasksToFile([]);
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading or parsing tasks.json:", error);
        return [];
    }
};
