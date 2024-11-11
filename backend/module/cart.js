const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        partNumber: { type: String },
        header: { type: String, required: true },
        commodity: { type: String, required: true },
        subcommodity: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const cartCollection = mongoose.model("Cart", CartSchema);

module.exports = cartCollection;
