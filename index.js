var express = require('express');
var bodyParser = require("body-parser");


const { addStudent } = require('./utils/addStudentUtil');
const { updateStudent, readAllStudents, getStudentById } = require('./utils/updateStudentUtil');

const studentsFilePath = 'C:\\Users\\offic\\Dvops project\\DevOps-Project\\utils\\students.json';

var app = express();
const logger = require('./logger');
const PORT = process.env.PORT || 5050;
var startPage = "course.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

const { editCourse, viewCourses} = require('./utils/updateCourseUtil');
app.put('/edit-course/:id', editCourse);
app.get('/view-courses', viewCourses);

const { addCourse } = require('./utils/addCourseUtil');
app.post('/add-course', addCourse);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

app.post('/add-student', addStudent);

app.get('/students', readAllStudents);

app.put('/students/:id', updateStudent);

// Endpoint to get a single student by ID
app.get('/students/:id', getStudentById);

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`)
    logger.info(`Demo project at: ${baseUrl}!`);
    logger.error(`Example or error log`)
});

module.exports = { app, server }