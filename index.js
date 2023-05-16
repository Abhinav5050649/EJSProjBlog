const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const connectToMongo = require("./db");
const path = require("path")
const passport = require("passport")
const fetchUser = require("./middleware/fetchuser")

connectToMongo()
require('./strategy/local'); // passport strategy will listen to every request


app.use(express.json())
app.use(cors())

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

// initialize passport package
app.use(passport.initialize());
// initialize a session with passport that authenticates the sessions from express-session
app.use(passport.session());
passport.use(new LocalStrategy(fetchUser))

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "/views"))


app.get("", (req, res) => {
    res.redirect("/api/auth/")
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/reci", require("./routes/blog"))


app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})