const express = require(`express`)
const { body, validationResult } = require("express-validator")
const recipe = require(`../models/reci`)
const router = express.Router()
const fetchUser = require(`../middleware/fetchuser`)
const { findByIdAndDelete } = require("../models/reci")

let userIdF = null  //user id obtained from signup

//in all api routes below, add fetchUser after testing these apis

//add pagination on header
//get recipes such that you find all posts by all users
router.get(`/browse`, async(req, res) => {
    try{
        const limitValue = req.query.limit || 2;
        const skipValue = req.query.skip || 0;
        const data = await recipe.find().limit(limitValue).skip(skipValue);
        
        res.render("browse", { data })
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

router.get("/homepage/:id", async(req, res) => {
    userIdF = req.params.id
    res.redirect("/api/reci/homepage")
})

//normal get recipes
router.get(`/homepage`, async(req, res) => {
    try{
        const data = await recipe.findById({userId: userIdF})
        res.render("homepage", { data })
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

app.get("/read/:id", async(req, res) => {
    const data = recipe.findById(req.params.id)
    res.render("read", { data })
})

//create a recipe post
router.post(`/create`, fetchUser, async(req, res) => {
    try{
        const errors  = validationResult(req)

        if (!errors.isEmpty())  return res.status(400).json({errors: errors.array()})
        
        let data = {}
        data["userId"] = userIdF
        if (req.body.title)   data["title"]    =   req.body.title
        if (req.body.content)    data["content"] =   req.body.content

        const use = new recipe(data)

        const saveDet = await use.save()
        res.status(200).json(saveDet);
        res.redirect("/api/reci/homepage")

    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//get update page
router.get("/update/:id", async(req, res) => {
    try{
        const data = await recipe.findById(req.params.id)
        res.render("update", { data })
    }   catch(error)    {
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//update a recipe
router.post(`/update/:id`, async(req, res) => {
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

        res.status(200).json(data)
        res.redirect("/api/reci/homepage")
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

router.get("/delete", async(req, res) => {
    try{
        const data = await recipe.findById({userId: userIdF})
        res.render("delete", { data })
    }   catch(error)    {
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

//delete a recipe
router.get(`/delete/:id`, async(req, res) => {
    try{
        const data = await recipe.findByIdAndDelete(req.params.id)

        if (!data)  res.status(404).send(`Internal Server Error`)

        res.status(200).json(data);
        res.redirect("/api/reci/homepage")
    }catch(error){
        console.error(error)
        res.status(500).json({"message": "Internal Server Error"})
    }
})

app.get('/logout', (req, res) => {
    userIdF = null
    res.redirect("/")
});

module.exports = router