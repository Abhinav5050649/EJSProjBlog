const express = require("express");
const user = require("../models/userDetails");
const {body, validationResult} = require("express-validator");
const router = express.Router();
const passport = require("passport")
const User = require("../models/userDetails")

router.get("/",(req, res)=>{
    //res.render("signup")
    res.render("signup")
})

router.get("/login",(req, res)=>{
    if (!req.user)
        res.render("login");
    else 
        res.redirect("/api/reci/homepage")
})

//create user --> works
router.post(`/create/user`, 
[
    body("email").isEmail(),
    body("password").isLength({min: 5}),
],
function(req, res) {
    User.register({
      username: req.body.email
    }, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/api/reci/homepage")
        })
      }
    })
});

//for login --> check
router.post("/check/login", function(req, res){
const user = new User({
    username: req.body.email,
    password: req.body.password
})
req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/api/reci/homepage")
      })
    }
})})


module.exports = router;