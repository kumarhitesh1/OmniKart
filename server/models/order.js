const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    items: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    method: {
      type: String,
      required: true,
    },

    paymentInfo: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    paidAt: {
      type: String,
    },

    subTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", schema);

module.exports = Order;
