const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate");

// Setting up the schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
  
  // Setting up the passport plugin
// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
module.exports = User;