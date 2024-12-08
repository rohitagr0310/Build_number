const express = require("express");
const router = express.Router();
const BOMController = require("../controller/BOMController");

router.post("/create", BOMController.createNewSubassembly);
router.get("/getall", BOMController.getSubassemblies);
router.post("/get", BOMController.getSubassemblyById);
router.put("/update", BOMController.updateSubassembly);
router.delete("/delete", BOMController.deleteSubassembly);

module.exports = router;
