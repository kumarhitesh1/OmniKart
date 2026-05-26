const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    expiresAt:{
        type:Date,
        default:()=>new Date(Date.now()+2*60*1000),
        index:{
            expires:"5m"
        },
    },
});
const OTP=mongoose.model('OTP',otpSchema);
module.exports=OTP;