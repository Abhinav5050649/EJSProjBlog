const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const connectToMongo = require("./db");
connectToMongo()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

app.use(passport.initialize())
app.use("/api/auth", require("./routes/auth"))
app.use("/api/blog", require("./routes/blog"))

app.get("/",(req,res)=>{
    res.render("signup")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/login",(req,res)=>{
    res.render("login");
})

//display current users' blogs
app.get("/view",(req,res)=>{
    res.render("normal");
})

//display ALL users' blogs
app.get("/homepage",(req, res)=>{
    res.render("homepage");
})


//create new blog post
app.get("/create",(req,res)=>{
    res.render("create");
})


//delete user's blog post
app.get("/delete",(req,res)=>{
    res.render("delete")
})

//update user's blog post
app.get("/update",(req,res)=>{
    res.render("update")
})

app.get('/logout', function(req, res, next) {
    authToken = null
    res.render("signup")
});

app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})