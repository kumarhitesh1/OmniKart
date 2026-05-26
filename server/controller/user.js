const OTP=require("../models/otp");
const User=require("../models/user");
const tryCatch=require("../utils/tryCatch");
const {sendOtp}=require("../utils/sendOtp");
const jwt=require("jsonwebtoken");

async function loginUser(req,res){
    const {email}=req.body;
    const subject="OmniKart OTP Verification";
    const otp=Math.floor(Math.random()*1000000);

    const prevOtp=await OTP.findOne({
        email,
    });

    if(prevOtp){
        await prevOtp.deleteOne();
    }

    await sendOtp(email, subject, otp);

    await OTP.create({email,otp});

    res.json({
        message:"Otp send to your mail"
    });
}

async function verifyUser(req,res){
    const {email,otp}=req.body;
    const haveOtp=await OTP.findOne({
        email,
        otp,
    });
    if(!haveOtp)return res.status(400).json({
        message:"Wrong Otp",
    });
    let user=await User.findOne({email});
    if(user){
        const token=jwt.sign({_id:user._id},process.env.JWT_SEC,{
            expiresIn:"15d",
        });
        await haveOtp.deleteOne();
        res.json({
            message:"User LoggedIn",
            token,
            user,
        })
    }
    else{
        user=await User.create({
            email,
        });
        const token=jwt.sign({_id:user._id},process.env.JWT_SEC,{
            expiresIn:"15d",
        });
        await haveOtp.deleteOne();
        res.json({
            message:"User LoggedIn",
            token,
            user,
        })
    }
}

async function myProfile(req,res){
    const user=await User.findById(req.user._id);
    res.json(user);
}

module.exports={    
    loginUser: tryCatch(loginUser),
    verifyUser:tryCatch(verifyUser),
    myProfile:tryCatch(myProfile),
}