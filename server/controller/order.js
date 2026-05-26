const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const { sendOrderConfirmation } = require("../utils/sendOrderConfirmation");
const tryCatch = require("../utils/tryCatch");

async function newOrderCod(req, res) {
  const { method, address, phone } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate({
    path: "product",
    select: "title price",
  });

  if (!cart.length) return res.status(400).json({ message: "Cart is empty" });

  let subTotal = 0;

  const items = cart.map((i) => {
    const itemSubtotal = i.product.price * i.quantity;
    subTotal += itemSubtotal;
    return {
      product: i.product._id,
      name: i.product.title,
      price: i.product.price,
      quantity: i.quantity,
    };
  });

  const order = await Order.create({
    items,
    method,
    user: req.user._id,
    phone,
    address,
    subTotal,
  });

  // delete cart BEFORE responding so frontend gets empty cart
  await Cart.deleteMany({ user: req.user._id });

  // respond immediately
  res.json({
    message: "Order created successfully",
    order,
  });

  // stock update and email in background
  try {
    for (let i of order.items) {
      const product = await Product.findById(i.product);
      if (product) {
        product.stock -= i.quantity;
        product.sold += i.quantity;
        await product.save();
      }
    }

    await sendOrderConfirmation({
      email: req.user.email,
      subject: "Order Confirmation",
      orderId: order._id,
      products: items,
      totalAmount: subTotal,
    });
  } catch (error) {
    console.log("Background task error:", error);
  }
}

async function getAllOrders(req, res) {
  const orders = await Order.find({ user: req.user._id });

  res.json({ orders: orders.reverse() });
}

async function getAllOrdersAdmin(req, res) {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "you are not admin",
    });

  const orders = await Order.find().populate("user").sort({ createdAt: -1 });

  res.json(orders);
}

async function getMyOrder(req, res) {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user");

  res.json(order);
}

async function updateStatus(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "you are not admin",
    });
  }

  const order = await Order.findById(req.params.id);

  const { status } = req.body;

  order.status = status;

  await order.save();

  res.json({
    message: "order status updated",
    order,
  });
}

async function getStats(req, res) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "you are not admin",
    });
  }
  const cod = await Order.find({ method: "cod" }).countDocuments();
  const online = await Order.find({ method: "online" }).countDocuments();


  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "Pending" });
  const shippedOrders = await Order.countDocuments({ status: "Shipped" });
  const deliveredOrders = await Order.countDocuments({ status: "Delivered" }); 

  const products = await Product.find();
  
  const data = products.map((prod) => ({
    name: prod.title,
    sold: prod.sold,
  }));
  res.json({
    cod,
    online,
    totalOrders,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    data,
  });
}

module.exports = {
  newOrderCod: tryCatch(newOrderCod),
  getAllOrders: tryCatch(getAllOrders),
  getAllOrdersAdmin: tryCatch(getAllOrdersAdmin),
  getMyOrder: tryCatch(getMyOrder),
  updateStatus: tryCatch(updateStatus),
  getStats: tryCatch(getStats),
};
