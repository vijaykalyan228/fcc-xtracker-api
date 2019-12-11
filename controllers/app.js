'use strict';
const User = require('../models/users');

var newUser = function(req, res) {
    let username = req.body.username;
    console.log(username);

    let user = new User({ 'username': username });
    user.save()
        .then((result) => {
            console.log("Successfully created user!");

            res.json({
                username: result.username,
                _id: result._id
            });
        })
        .catch((err) => {
            console.log(err);
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status = 400;
                res.send("username '" + username + "' already taken");
            } else return;
        });
};

exports.newUser = newUser;