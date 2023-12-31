const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user")
const bcrypt = require("bcrypt")

exports.initializingPassport = (passport) => {
    passport.use(new LocalStrategy( async(username, password, done) => {
        try{
            console.log("running")
            console.log(username)
            const user = await User.findOne({username: username})
            console.log(user)
            if (!user)  return done(null, false)
            if (user.password !== password) return done(null, false)

            return done(null, user)
        }catch(error){
            return done(error, false)
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, user.id)
    })

    passport.deserializeUser( async(id, done) => {
        try{
            const user = await User.findById(id)

            done(null, user)
        }catch(error){
            done(error, false)
        }
    })
};