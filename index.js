const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const connectToMongo = require("./db");
const path = require("path")
const passport = require("passport")
connectToMongo()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

app.use(passport.initialize())

app.get("", (req, res) => {
    res.redirect("/api/auth/")
})

app.use("/api/auth", require("./routes/auth"))
app.use("/api/reci", require("./routes/blog"))


app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})