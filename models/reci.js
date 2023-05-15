const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

const blogSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    }
})

const recipe = mongoose.model('foodrecipes', blogSchema)
module.exports = recipe