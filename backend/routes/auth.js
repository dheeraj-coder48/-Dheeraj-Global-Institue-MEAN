const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("./../models/User.Model");
const jwt = require("jsonwebtoken")



//Register Route
//Pist
router.post("/signup",async(req,res)=>{
    const {name , email , password} = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({status:"N",message:"All fields are required"});
        };
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({status:"N",message:"User Already Existing."});

        };
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name , email , password : hashedPassword});
        await newUser.save();
        return res.status(201).json({status:"Y",message:"User registered successfully"});

    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
});



//Login Route
//Pist
router.post("/login",async(req,res)=>{
    const {email , password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({status:"N",message:"All fields are required"});
        };
        const existingUser = await User.findOne({email});
        if (!existingUser){
            return res.status(400).json({status:"N",message:"Invalid email or password."});

        };
        const isValidPassword = await bcrypt.compare(password,existingUser.password);
        if(!isValidPassword){
            return res.status(400).json({status:"N",message:"Invalid email or password."});
        };
        const token = jwt.sign({userId: existingUser._id,email:existingUser.email , name : existingUser.name},process.env.JWT_SECRET,{expiresIn:"1h"});



        return res.status(200).json({status:"Y",message:"Logged In Successfully",token,user:{id:existingUser._id,name : existingUser.name , email : existingUser.email}});

    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
});

module.exports = router;