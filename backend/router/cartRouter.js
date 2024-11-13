// routes/cartRoutes.js
const express = require("express");
const router = express.Router();

const cartController = require("../controller/cartController");

router.get("/", cartController.getCart);
router.post("/add", cartController.addItem);
router.put("/update", cartController.updateItem);
router.post("/remove", cartController.removeItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
