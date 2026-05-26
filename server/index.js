const express=require("express");
const dotenv=require("dotenv");
const {connectToDB}=require("./utils/connection");
const cloudinary=require("cloudinary");
const cors = require("cors");

dotenv.config();

cloudinary.v2.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET 
    });

const app=express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

const PORT=process.env.PORT;

const userRoutes=require("./routes/user");
const productRoutes=require("./routes/product");
const cartRoutes=require("./routes/cart");
const addressRoutes=require("./routes/address");
const orderRoutes=require("./routes/order");

app.use("/api",userRoutes);
app.use("/api",productRoutes);
app.use("/api",cartRoutes);
app.use("/api",addressRoutes);
app.use("/api",orderRoutes);

app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`);
    connectToDB();
});