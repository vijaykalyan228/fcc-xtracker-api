'use strict';
const User = require('../models/users');
const Exercise = require('../models/Exercises');

var newUser = function(req, res) {
    let username = req.body.username;
    // console.log(username);

    let user = new User({ 'username': username });
    user.save()
        .then((result) => {
            // console.log("Successfully created user!");
            res.json({
                username: result.username,
                _id: result._id
            });
        })
        .catch((err) => {
            // console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status = 400;
                res.send("username '" + username + "' is already taken");
            } else return;
        });
};


var getAllUsers = function(req, res) {
    // console.log("Get All users request");
    User.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.json(data);
    });
};

var getAllLogs = function(req, res) {
    console.log(req.query.userId);
    Exercise.find({ 'userId': req.query.userId }, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.json(data);
    });
};

var addExercise = function(req, res) {
    console.log(req.body);
    let exercise = new Exercise(req.body);
    exercise.save()
        .then((data) => {
            data.depopulate('__v');
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
};

exports.newUser = newUser;
exports.getAllUsers = getAllUsers;
exports.addExercise = addExercise;
exports.getAllLogs = getAllLogs;