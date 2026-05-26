const Address = require("../models/address");
const tryCatch = require("../utils/tryCatch");

async function addAddress(req, res) {
  const { address, phone } = req.body;

  if (!address || !phone) {
    return res.status(400).json({
      message: "Address and phone are required",
    });
  }

  await Address.create({
    address,
    phone,
    user: req.user._id,
  });

  res.status(201).json({
    message: "Address created",
  });
}

async function getAllAddress(req, res) {
  const allAddress = await Address.find({ user: req.user._id });

  res.json(allAddress);
}

async function getSingleAddress(req, res) {
  const address = await Address.findById(req.params.id);

  res.json(address);
}

async function deleteAddress(req, res) {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  await address.deleteOne();

  res.json({
    message: "address Deleted",
  });
}

module.exports = {
    addAddress:tryCatch(addAddress),
    getAllAddress:tryCatch(getAllAddress),
    getSingleAddress:tryCatch(getSingleAddress),
    deleteAddress:tryCatch(deleteAddress),
}
