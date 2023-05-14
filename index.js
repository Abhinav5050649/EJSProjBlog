const express = require(`express`)
const cors = require(`cors`)
const port = 5000
const app = express()
const passport = require('passport');
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = `food123`

const mongooseURL = `mongodb://localhost:27017`
const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.connect(mongooseURL, () => {
    console.log(`Connected to DB`)
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

app.use(passport.initialize())


const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
})
const User = mongoose.model('user', userSchema)

const blogSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String, 
        required: true
    }
})
const recipe = mongoose.model('foodrecipes', blogSchema)

var authToken = null
// Configure Passport.js with the JWT strategy
passport.use(new JWTStrategy({
    jwtFromRequest: authToken,
    secretOrKey: JWT_SECRET
    }, (jwtPayload, done) => {
        const user1 = User.findById(jwtPayload.sub);
        if (!user1) {
            return done(null, false);
        }
    //done(null, jwtPayload.user); // Assuming the user information is stored in jwtPayload.user
    done(null, user1)
}));

const fetchUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
        }

        if (!user) {
        return res.status(401).send({ error: 'Faulty Authentication' });
        }

        req.user = user;
        next();
    })(req, res, next);
};
// const fetchUser = (req, res, next) => {
//     // const token = req.header(`authtoken`)
//     const token = authToken
//     if (!token) res.status(401).send({error: `Faulty Authentication`})

//     try{
//         const data = jwt.verify(token, JWT_SECRET)
//         req.user = data.user
//         next()
//     }catch(error){
//         res.status(401)
//     }
// }

app.get("/",(req,res)=>{
    res.render("signup")
    console.log("done");
})

app.post(`/signup`, 
[
    body("name").isLength({min: 3}),
    body("email").isEmail(),
    body("password").isLength({min: 5}),
],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            success = false;
            return res.status(400).send({"success": success, "errors": errors.array()})
        }

        try{
            let user = await User.findOne({email: req.body.email})

            if (user)
            {
                return res.status(400).json({"success": false, "errors": "Account exists!"})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            const data = {
                user: {
                    id: user.id,
                }
            };

            authToken = jwt.sign(data, JWT_SECRET);

            //res.json({"success": true, "authtoken": authToken});
            res.redirect("/login");
        }   catch (error) {
            console.error(error);
            res.status(500).send(`Internal Server Error!!!`);
        }
    }
);


app.post("/login2", (req,res)=>{
    res.redirect("/login")
}
)

app.get("/login",(req,res)=>{
    res.render("login");
})

//for login
app.post(`/login`, 
[
    body("email").isEmail(),
    body("password").isLength({min: 5}),
], async(req, res) => {
        try{
            const user = await User.findOne({"email": req.body.email})

            if (!user)
            {
                return res.status(400).json({"success": false})
            }

            const passwordComparison = await bcrypt.compare(req.body.password, user.password);

            if (!passwordComparison){
                return res.status(400).json({"success": false})
            }

            const data = {
                user: {
                    id: user.id,
                },
            }

            authToken = jwt.sign(data, JWT_SECRET);

            //res.json({"success": true, "authtoken": authToken});
            res.redirect("/homepage");
            
        }   catch (error)   {
            console.error(error);
            res.status(500).send(`Internal Server Error!!!`);
        }
    }
)

//display current users' blogs
app.get("/view",(req,res)=>{
    res.render("normal");
})

//get recipes such that you find all posts by all users
app.get(`/getallrecipes`, fetchUser, async(req, res) => {
    try{
        const limitValue = req.query.limit || 2;
        const skipValue = req.query.skip || 0;
        const data = await recipe.find().limit(limitValue).skip(skipValue);

        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500).send(`Internal Server Error`)
    }
})

//display ALL users' blogs
app.get("/homepage",(req,res)=>{
    res.render("homepage");
})

//normal get recipes
app.get(`/getallrecipesnorm`, fetchUser, async(req, res) => {
    try{
        const data = await recipe.find({userId: req.user.id})
        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500)
    }
})

//create new blog post
app.get("/create",(req,res)=>{
    res.render("create");
})

//create a recipe post
app.post(`/create`, fetchUser, async(req, res) => {
    try{
        console.log(`running`)
        const errors  = validationResult(req)

        if (!errors.isEmpty())  return res.status(400).json({errors: errors.array()})
        
        let data = {}
        data["userId"] = req.user.id
        if (req.body.title)   data["title"]    =   req.body.title
        if (req.body.content)    data["content"] =   req.body.content

        const use = new recipe(data)

        const saveDet = await use.save()
        res.status(200).json(saveDet);
    }catch(error){
        console.error(error)
        res.status(500)
    }
})


//update user's blog post
app.get("/update",(req,res)=>{
    res.render("update")
})

//update a recipe
app.post(`/update`, fetchUser, async(req, res) => {
    try{
        const {title, content} = req.body
        
        let data = await recipe.findOne({title: req.body.title})

        if (content)    data["content"] =   req.body.content
        
        data = await recipe.findByIdAndUpdate(
            {_id: data.id},
            {$set: data},
            {new: true}
        )

        res.status(200).json(data)

    }catch(error){
        console.error(error)
        res.status(500)
    }
})


//delete user's blog post
app.get("/delete",(req,res)=>{
    res.render("delete")
})

//delete a recipe
app.post(`/delete`, fetchUser, async(req, res) => {
    try{
        const data = await recipe.findOneAndDelete({title: req.body.title})

        if (!data)  res.status(404).send(`Internal Server Error`)

        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500)
    }
})

app.get("/logout", (req, res) => {
    authToken = null
    req.logout()
    res.redirect("/")
})
app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})