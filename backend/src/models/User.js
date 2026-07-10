const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['user','admin','delivery'],
        default:'user'
    },
      otp: {
         type: String 
        
        },
     otpExpiry: {
        type: Date 
    },
    phone: { type: String },
isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // account tb active hoga jab otp verfy hoga
})
module.exports = mongoose.model("User",userSchema)