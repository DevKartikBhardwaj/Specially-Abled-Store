import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    otp:Number,
    registered:{
        type:Boolean,
        default:false
    },
    options:{
        type:String,
        default:"{}"
    },    
},{timestamps:true})

export const userCollection=mongoose.model('users',userSchema);