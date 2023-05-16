const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Setting up the schema
const userSchema = new Schema({
    username: 
    {
        type: String,
        unique: true
    },
    password: 
    {
        type: String
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;