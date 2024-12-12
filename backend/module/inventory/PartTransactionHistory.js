const mongoose = require("mongoose");

const partTransactionHistorySchema = mongoose.Schema({
  partId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "part_numbers", // Reference to the part in partNumberCollection
  },
  transactionType: {
    type: String,
    required: true, // Example: "added", "removed"
  },
  quantity: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

const partTransactionHistory = mongoose.model(
  "part_transaction_history",
  partTransactionHistorySchema
);

module.exports = partTransactionHistory;
