const express=require("express");
const {loginUser,verifyUser,myProfile}=require("../controller/user");
const {isAuth}=require("../middlewares/isAuth");

const router=express.Router();
router.post("/user/login",loginUser);
router.post("/user/verify",verifyUser);
router.get("/user/me",isAuth,myProfile);

module.exports=router;