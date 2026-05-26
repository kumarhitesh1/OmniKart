const jwt=require("jsonwebtoken");
const User=require("../models/user");

async function isAuth(req,res,next){
    try {
        const {token}=req.headers;
        if(!token)return res.status(403).json({
            message:"Please Login",
        });
        const decoded=jwt.verify(token ,process.env.JWT_SEC);
        req.user=await User.findById(decoded._id);
        next();
    } catch (error) {
        res.status(500).json({
            message:"Please Login",
        });
    }
}
module.exports={isAuth};