const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
});
const Address = mongoose.model('Address', addressSchema);
module.exports = Address;