const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// new user registration..
router.post("/register",async(req,res)=>{
    try{   

          // check if user already exist..
          const user = await User.findOne({email:req.body.email});
          if(user){
            throw new Error("User already exists");
        
          }
          // email validation
          if (!emailRegex.test(req.body.email)) {
            throw new Error("Please provide a valid email address");
        }
          if (req.body.password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password,salt);
          req.body.password = hashedPassword;

          // save user..
          const newUser =  new User(req.body);
           await newUser.save();

           res.send({
            success:true,
            message:"User created successfully"
           })

    }
    catch(error){
        res.send({
            success:false,
            message: error.message
        })
    }
});

// user login
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            throw new Error("User doesn't exist");
        }
        // if user is active or not..
        if(user.status!=="active"){
            throw new Error("User account is blocked, please contact admin");
        }
        // compare password..
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            throw new Error("Invalid username or Password");
        }
        // create and assign token...
        const token = jwt.sign({userId:user._id},process.env.jwt_secret,{expiresIn:"1d"});

        res.send({
            success:true,
            message:"User logged in successfully",
            data:token
        })
        
    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
});

// get current user.
router.get("/get-current-user",authMiddleware,async(req,res)=>{
    try {
        const user =  await User.findById(req.body.userId);

        res.send({
            success:true,
            message:"User fetched successfully",
            data:user,
        })
        
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        })
    }
});

// get all users...
router.get("/get-users",authMiddleware,async(req,res)=>{
    try {
        const users= await User.find();
        res.send({
            success:true,
            message:"Users fetched successfully",
            data:users
        })
    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
});

// update user status...
router.put("/update-user-status/:id",authMiddleware,async(req,res)=>{
    try {
        const {status}=req.body;
        await User.findByIdAndUpdate(req.params.id,{status});

        res.send({
            success:true,
            message:"User status updated successfully"
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message
        });
    }
})
module.exports = router;