const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    role:{
        type:String,
        default:"user"
    },
    status:{
       type:String,
       default:"active"   
    },
    profilePic:{
        type:String,
        default:""
    }
},{
    timestamps:true
});

const User = mongoose.model("users",userSchema);

module.exports =User;