const Cart = require("../models/cart");
const Product = require("../models/product");
const tryCatch = require("../utils/tryCatch");

async function addToCart(req, res) {
  const { product } = req.body;
  const cart = await Cart.findOne({
    product: product,
    user: req.user._id,
  }).populate("product");
  if (cart) {
    if (cart.product.stock === cart.quantity)
      return res.status(400).json({
        message: "Out of Stock",
      });
    cart.quantity = cart.quantity + 1;
    await cart.save();
    return res.json({
      message: "Added to cart",
    });
  }
  const cartProd = await Product.findById(product);
  if (cartProd.stock === 0)
    return res.status(400).json({
      message: "Out of Stock",
    });
  await Cart.create({
    quantity: 1,
    product: product,
    user: req.user._id,
  });
  return res.json({
    message: "Added to cart",
  });
}

async function removeFromCart(req, res) {
  const cart = await Cart.findById(req.params.id);
  await cart.deleteOne();

  res.json({
    message: "Removed from cart",
  });
}

async function updateCart(req, res) {
  const { action } = req.query;

  if (action === "inc") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity < cart.product.stock) {
      cart.quantity++;
      await cart.save();
    } else {
      return res.status(400).json({
        message: "Out of stock",
      });
    }

    res.json({
      message: "cart updated",
    });
  }

  if (action === "dec") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity > 1) {
      cart.quantity--;
      await cart.save();
    } else {
      return res.status(400).json({
        message: "You have only one item",
      });
    }

    res.json({
      message: "cart updated",
    });
  }
}

async function fetchCart(req, res) {
  const cart = await Cart.find({ user: req.user._id }).populate("product");

  const sumofQuantities = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  let subTotal = 0;

  const cartItems = cart.map((i) => {
    const itemSubTotal = i.product.price * i.quantity;
    subTotal += itemSubTotal;
    return {
      _id: i._id,
      product: i.product,
      quantity: i.quantity,
      itemSubTotal, // send this from backend
    };
  });

  res.json({ cart: cartItems, subTotal, sumofQuantities });
}

module.exports = {
  addToCart: tryCatch(addToCart),
  removeFromCart: tryCatch(removeFromCart),
  updateCart: tryCatch(updateCart),
  fetchCart: tryCatch(fetchCart),
};
