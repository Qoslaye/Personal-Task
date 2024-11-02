const {IncomingForm} = require('formidable');
const { readTasksFromFile } = require("../utils/fileHandler") ;
const {copyFilesync } = require('fs');

exports.getTasks = (req, res) => { 
    const tasks = readTasksFromFile();
    res.writeHead(200, 'OK', {'Content-Type': 'application/json'});
    res.end(JSON.stringify(tasks));
}

exports.createTask = (req, res) => { 
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => { 
        if (err) {
            res.writeHead(400 ,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Error parsing form data.'
            }));
            return;
        }
        
        const image = files.iamge[0];

        const tasks = readTasksFromFile(); 

        const newTask = { 
            id : Data.now(), 
            title : fields.title ,
            description: fields.description || '' ,
            status : fields.status || 'pending' ,
            image : files.image ? `/uploads/${image.originalFilename}` : null ,
        }

        tasks.push(newTask);
        writeTasksToFile(tasks);

        if (files.image) { 
            copyFilesync(files.image.name , path.join(__dirname__ , '../uploads' , image.origanalFilename) );
            res.end(JSON.stringify(newTask))
        }
    })
}

exports.updateTask = (req, res) => {
    res.end(JSON.stringify({
        message : 'Not implemented yet.'
     }))
 }

 exports.deleteTask = (req, res) => {
    res.end(JSON.stringify({
        message : 'Not implemented yet.'
     }))
 }
