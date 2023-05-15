const express = require("express");
const User = require("../models/user");
const {body, validationResult} = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchuser");
const JWT_SECRET = `food123`;
let userIdF = require("./blog")
router.get("/",(req, res)=>{
    res.render("signup")
})

router.get("/login",(req,res)=>{
    res.render("login");
})

//create user --> works
router.post(`/create/user`, 
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

            console.log({"success": true});
            res.redirect("/api/auth/login");
        }   catch (error) {
            console.error(error);
            res.status(500).json({"message": "Internal Server Error!!!"});
        }
    }
);

//for login --> works
router.post(`/check/login`, 
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
            const passCompare = bcrypt.compare(user.password, req.body.password)
            // console.log(passCompare)
            if (!passCompare){
                return res.status(400).json({"success": false})
            }

            console.log({"success": true});
            res.redirect(`/api/reci/homepage`);
            
        }   catch (error)   {
            console.error(error);
            res.status(500).json({"message": "Internal Server Error!!!"});
        }
    }
)

module.exports = router;