const express=require("express");
const {isAuth}=require("../middlewares/isAuth");
const { createProduct,getAllProducts,getSingleProduct, updateProduct, updateProductImage } = require("../controller/product");
const {uploadFiles} = require("../middlewares/multer");
const router=express.Router();

router.post("/product/new",isAuth,uploadFiles,createProduct);
router.get("/product/all",getAllProducts);
router.get("/product/:id",getSingleProduct);
router.put("/product/:id",isAuth, updateProduct);
router.post("/product/:id",isAuth,uploadFiles,updateProductImage);

module.exports=router;