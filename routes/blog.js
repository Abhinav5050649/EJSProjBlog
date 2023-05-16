const express = require(`express`)
const { body, validationResult } = require("express-validator")
const recipe = require(`../models/reci`)
const router = express.Router()
const fetchUser = require(`../middleware/fetchuser`)
const { findByIdAndDelete } = require("../models/reci")
const User = require("../models/user")
let userIdF = null  //user id obtained from signup

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    else    res.redirect("")
}

//in all api routes below, add fetchUser after testing these apis

//add pagination on header
//get recipes such that you find all posts by all users
router.get(`/browse`, checkAuthenticated, async(req, res) => {
    try{
        const data = await recipe.find();
        res.render("browse", { data })
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//normal get recipes
router.get(`/homepage`, checkAuthenticated, async(req, res) => {
    try{
        //const user = await User.findById(req.user.id)
        console.log(req.user.id)
        const data = await recipe.find({userId: req.user.id})
        console.log(data)
        res.render("homepage", { data })
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

router.get("/read/:id", checkAuthenticated, async(req, res) => {
    const data = await recipe.findById(req.params.id)
    res.render("read", { data })
})

router.get("/create", checkAuthenticated, async(req, res) => {
    res.render("create")
})

//create a recipe post
router.post(`/create`, checkAuthenticated, async(req, res) => {
    try{
        const errors  = validationResult(req)

        if (!errors.isEmpty())  return res.status(400).json({errors: errors.array()})
        
        let data = {}
        data["userId"] = req.user.id
        if (req.body.title)   data["title"]    =   req.body.title
        if (req.body.content)    data["content"] =   req.body.content

        const use = await recipe.create(data)
        console.log(use)
        res.redirect("/api/reci/homepage")

    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//get update page
router.get("/update/:id", checkAuthenticated, async(req, res) => {
    try{
        const data = await recipe.findById(req.params.id)
        res.render("update", { data })
    }   catch(error)    {
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//update a recipe
router.post(`/update/:id`, checkAuthenticated, async(req, res) => {
    try{
        const {title, content} = req.body
        
        let data = await recipe.findById(req.params.id)

        if (!data)  res.status(404).send(`Not Found`)

        if (title)   data["title"]    =   title
        if (content)    data["content"] =   content
        
        data = await recipe.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: data},
            {new: true}
        )

        console.log(data)
        res.redirect("/api/reci/homepage")
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

router.get("/delete", checkAuthenticated, async(req, res) => {
    try{
        const data = await recipe.find({userId: req.user.id})
        res.render("delete", { data })
    }   catch(error)    {
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//delete a recipe
router.get(`/delete/:id`, async(req, res) => {
    try{
        const data = await recipe.findById(req.params.id)

        if (!data)  res.status(404).send(`Internal Server Error`)

        console.log(data)

        const ans = await recipe.deleteOne(data)
        
        res.redirect("/api/reci/homepage")
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

router.get('/logout', (req, res) => {
    res.redirect("/api/auth")
});

module.exports = router