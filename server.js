const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

// Connect to Database
const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://admin:admin@fccnodecluster-uv7h5.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Parse Body as Json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exerciseApp = require('./controllers/app');

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', exerciseApp.newUser);
app.get('/api/exercise/users', exerciseApp.getAllUsers);
app.post('/api/exercise/add', exerciseApp.addExercise);
app.get('/api/exercise/log?:userId', exerciseApp.getAllLogs);

// Not found middleware
app.use((req, res, next) => {
    return next({ status: 404, message: 'not found' })
});

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors)
            // report the first validation error
        errMessage = err.errors[keys[0]].message
    } else {
        // generic or custom error
        errCode = err.status || 500
        errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
        .send(errMessage)
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
});