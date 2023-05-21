const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const connectToMongo = require("./db");
const path = require("path")
const passport = require("passport")
const session = require('express-session')
const User = require("./models/user")
const LocalStrategy = require('passport-local')
const {initializingPassport} = require("./passportConfig")

connectToMongo()

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "/views"))

initializingPassport(passport);
app.use(
    session({
      secret: 'food123', // secret key to sign our session
      resave: false,
      saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

//this will redirect user to signup page from base link
app.get("", (req, res) => {
    res.redirect("/api/auth/")
})

//for signup
app.get("/api/auth",(req, res)=>{
    res.render("signup")
})

//for login
app.get("/api/auth/login",(req, res)=>{
    res.render("login")
})

//create user --> works
app.post(`/api/auth/createuser`, async(req, res) => {
    const user = await User.findOne({username: req.body.username})
    if (user)   res.redirect("/api/auth/login")
    else{
        let data = {
            username: req.body.username, 
            password: req.body.password,
        }
        console.log(data)
        const saveDets = await User.create(data)
        //console.log(saveDets)
        res.redirect("/api/auth/login")
    }
});

//for login --> 
app.post("/api/auth/check/login", passport.authenticate("local", {failureRedirect: "/api/auth/login", successRedirect: "/api/reci/homepage"}))

//for all aspects related to blog posts
app.use("/api/reci", require("./routes/blog"))


app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})