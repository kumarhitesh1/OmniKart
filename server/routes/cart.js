const express=require("express");
const { addToCart, removeFromCart, updateCart, fetchCart } = require("../controller/cart");
const { isAuth } = require("../middlewares/isAuth");
const router=express.Router();

router.post("/cart/add",isAuth,addToCart);
router.get("/cart/remove/:id",isAuth,removeFromCart);
router.post("/cart/update",isAuth,updateCart);
router.get("/cart/all",isAuth,fetchCart);

module.exports=router;