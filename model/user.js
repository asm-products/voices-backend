var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    phoneNumber: String
});

module.exports = mongoose.model('User', userSchema);
