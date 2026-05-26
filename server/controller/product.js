const bufferGenerator = require("../utils/bufferGenerator");
const tryCatch = require("../utils/tryCatch");
const { getAIRecommendedProducts } = require("../utils/aiRecommendedProduct");
const Product = require("../models/product");
const cloudinary = require("cloudinary");

async function createProduct(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not admin",
    });
  }
  const { title, about, category, price, stock } = req.body;
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "no files to upload",
    });
  }
  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });
  const uploadedImage = await Promise.all(imageUploadPromises);
  const product = await Product.create({
    title,
    about,
    category,
    price,
    stock,
    images: uploadedImage,
  });
  res.status(201).json({
    message: "Product Created",
    product,
  });
}

async function getAllProducts(req, res) {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }
  if (category) {
    filter.category = category;
  }
  const limit = 8;
  const skip = (page - 1) * limit;

  let sortOption = { created: -1 };
  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highToLow") {
      sortOption = { price: -1 };
    }
  }
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");

  const newProduct = await Product.find().sort("-createdAt").limit(4);

  const countProduct = await Product.countDocuments();

  const totalPages = Math.ceil(countProduct / limit);

  res.json({ products, categories, totalPages, newProduct });
}

async function getSingleProduct(req, res) {
  const product = await Product.findById(req.params.id);

  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json({ product, relatedProduct });
}

async function updateProduct(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not admin",
    });
  }
  const { title, about, category, price, stock } = req.body;
  const updateFields = {};
  if (title) updateFields.title = title;
  if (about) updateFields.about = about;
  if (category) updateFields.category = category;
  if (price) updateFields.price = price;
  if (stock) updateFields.stock = Number(stock);

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedProduct) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  res.json({
    message: "Product Updated",
    updatedProduct,
  });
}

async function updateProductImage(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not admin",
    });
  }
  const { id } = req.params;
  const files = req.files;

  if (!files || files.length == 0) {
    return res.status(400).json({
      message: "no files to upload",
    });
  }
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  const oldImages = product.images || [];
  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }
  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });
  const uploadedImage = await Promise.all(imageUploadPromises);
  product.images = uploadedImage;
  await product.save();
  res.status(200).json({
    message: "Image Updated",
    product,
  });
}

module.exports = {
  createProduct: tryCatch(createProduct),
  getAllProducts: tryCatch(getAllProducts),
  getSingleProduct: tryCatch(getSingleProduct),
  updateProduct: tryCatch(updateProduct),
  updateProductImage: tryCatch(updateProductImage),
};
