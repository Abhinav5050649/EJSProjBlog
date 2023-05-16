const mongoose = require(`mongoose`)

const mongooseURL = `mongodb+srv://abhinav1234:abhinav1234@cluster0.8z45mi6.mongodb.net/`
// const mongooseURL = `mongodb://localhost:27017`

const connectToMongo = () => {
    mongoose.connect(mongooseURL, () => {
        console.log(`Connected to DB`)
    })
}

module.exports = connectToMongo