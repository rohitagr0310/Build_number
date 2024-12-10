const partTransactionHistory = require("../../module/inventory/PartTransactionHistory");
const partNumberModule = require("../../module/inventory/partNumberModule");

module.exports = {
  // Function to update inventory
  updateInventory: async (req, res) => {
    try {
      const { partId, quantity, transactionType } = req.body;

      // Fetch the part data from the part number collection using the partId
      const partData = await partNumberModule.partNumberCollection.findOne({
        "CrossEntry._id": partId,
      });

      if (!partData) {
        return res.status(404).send({ status: "Part not found" });
      }

      // Find the specific part in the CrossEntry array using the _id
      const partIndex = partData.CrossEntry.findIndex(
        (entry) => entry._id.toString() === partId.toString()
      );

      if (partIndex === -1) {
        return res.status(404).send({ status: "Part entry not found" });
      }

      // Update the inventory based on the transaction type (add or remove)
      if (transactionType === "added") {
        partData.CrossEntry[partIndex].currentStock += quantity;
      } else if (transactionType === "removed") {
        if (partData.CrossEntry[partIndex].currentStock < quantity) {
          return res.status(400).send({ status: "Not enough stock to remove" });
        }
        partData.CrossEntry[partIndex].currentStock -= quantity;
      } else {
        return res.status(400).send({ status: "Invalid transaction type" });
      }

      // Save the updated part data
      await partData.save();

      // Create a transaction history entry for the update
      const transaction = new partTransactionHistory({
        partId: partId,
        transactionType: transactionType,
        quantity: quantity,
      });
      await transaction.save();

      return res.status(200).send({
        status: "Inventory updated and transaction recorded",
      });
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).send({ status: "Internal Server Error" });
    }
  },

  // Optionally, add a function to fetch all transaction history
  getTransactionHistory: async (req, res) => {
    try {
      const { partId } = req.body;

      const transactions = await partTransactionHistory.find({
        partId: partId,
      });

      if (transactions.length > 0) {
        return res.status(200).send({
          status: "Fetched transaction history successfully",
          data: transactions,
        });
      } else {
        return res.status(404).send({
          status: "No transaction history found for this part",
        });
      }
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err.message,
      });
    }
  },
};
