// routes/cartRoutes.js
const express = require("express");
const router = express.Router();

const PartTransactionHistoryController = require("../controller/inventroy/PartTransactionHistoryController");

router.post("/get", PartTransactionHistoryController.getTransactionHistory);
router.post("/update", PartTransactionHistoryController.updateInventory);

module.exports = router;
