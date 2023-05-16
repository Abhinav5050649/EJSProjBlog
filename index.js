const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const connectToMongo = require("./db");
const path = require("path")
const passport = require("passport")
const session = require('express-session')
const User = require("./models/userDetails")
const LocalStrategy = require('passport-local')
const {initializingPassport} = require("./passportConfig")

connectToMongo()
//require("passport-local") // passport strategy will listen to every request


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
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // TTL for the session
      },
    })
);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get("", (req, res) => {
    res.redirect("/api/auth/")
})

app.get("/api/auth",(req, res)=>{
    //res.render("signup")
    res.render("signup")
})

router.get("/api/auth/login",(req, res)=>{
    if (!req.user)
        res.render("login");
    else 
        res.redirect("/api/reci/homepage")
})

//create user --> works
app.post(`/api/auth/create/user`, 
[
    body("email").isEmail(),
    body("password").isLength({min: 5}),
],
async(req, res) => {
    const user = User.findOne({username: req.body.username})
    if (user)   res.redirect("/api/auth/login")
    else{
        const saveDets = await User.create(req.body)
        res.redirect("/api/auth/login")
    }
});

//for login --> 
app.post("/api/auth/check/login", passport.authenticate("local", {failureRedirect: "/api/auth/login", successRedirect: "/api/reci/homepage"}))
// router.post("/api/auth/check/login", function(req, res){
// const user = new User({
//     username: req.body.email,
//     password: req.body.password
// })
// req.login(user, function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function() {
//         res.redirect("/api/reci/homepage")
//       })
//     }
// })})

app.use("/api/reci", require("./routes/blog"))


app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})