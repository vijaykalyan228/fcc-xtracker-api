'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Users = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: [20, 'username too long']
    }
});

module.exports = mongoose.model('Users', Users);