const express = require(`express`)
const { body, validationResult } = require("express-validator")
const recipe = require(`../models/reci`)
const router = express.Router()
const fetchUser = require(`../middleware/fetchuser`)
const { findByIdAndDelete } = require("../models/reci")

//add pagination on header
//get recipes such that you find all posts by all users
router.get(`/all`, fetchUser, async(req, res) => {
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

//normal get recipes
router.get(`/all/norm`, fetchUser, async(req, res) => {
    try{
        const data = await recipe.find({userId: req.user.id})
        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500).send(`Internal Server Error`)
    }
})

//create a recipe post
router.post(`/create`, fetchUser, async(req, res) => {
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
        res.status(500).send(`Internal Server Error`)
    }
})

//update a recipe
router.put(`/update/:id`, fetchUser, async(req, res) => {
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

    }catch(error){
        console.error(error)
        res.status(500).send(`Internal Server Error`)
    }
})

//delete a recipe
router.delete(`/delete/:id`, fetchUser, async(req, res) => {
    try{
        const data = await recipe.findByIdAndDelete(req.params.id)

        if (!data)  res.status(404).send(`Internal Server Error`)

        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500).send(`Internal Server Error`)
    }
})

/*
//get recipes such that you find all posts by all users
app.get(`/getallrecipes`, addToken, fetchUser, async(req, res) => {
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


//normal get recipes
app.get(`/getallrecipesnorm`, addToken, fetchUser, async(req, res) => {
    try{
        const data = await recipe.find({userId: req.user.id})
        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500)
    }
})


//create a recipe post
app.post(`/create`, addToken, fetchUser, async(req, res) => {
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


//update a recipe
app.post(`/update`, addToken, fetchUser, async(req, res) => {
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



//delete a recipe
app.post(`/delete`, addToken, fetchUser, async(req, res) => {
    try{
        const data = await recipe.findOneAndDelete({title: req.body.title})

        if (!data)  res.status(404).send(`Internal Server Error`)

        res.status(200).json(data);
    }catch(error){
        console.error(error)
        res.status(500)
    }
})
*/
module.exports = router