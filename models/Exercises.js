'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = require('./users');

const Exercise = new Schema({
    description: {
        type: String,
        required: true,
        maxlength: [25, 'description too long']
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'duration too short']
    },
    date: {
        type: Date,
        default: Date.now
    },
    username: String,
    userId: {
        type: String,
        ref: 'Users',
        index: true
    }
});


// Validate userId on save
Exercise.pre('save', function(callback) {
    // console.log(this);

    Users.findById(this.userId)
        .then((user) => {
            if (!user) {
                const err = new Error('unknown userId ' + this.userId);
                err.status = 400;
                return callback(err);
            }
            this.username = user.username;
            if (!this.date) {
                this.date = Date.now();
            }
            callback();
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        });
});

module.exports = mongoose.model('Exercise', Exercise);