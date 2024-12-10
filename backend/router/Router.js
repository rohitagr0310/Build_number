const express = require("express");
const router = express.Router();

const headercontroller = require("../controller/headers/headercontroller");
const commodityController = require("../controller/headers/commodityController");
const subCommodityController = require("../controller/headers/subcommodityController");
const partNumberController = require("../controller/inventroy/partNumberController");

router.post("/createHeader", headercontroller.addHeader);
router.post("/createCommodity", commodityController.addcommodity);
router.post("/createSubCommodity", subCommodityController.addSubCommodity);
router.post("/createpartNumber", partNumberController.addPartNumber);
router.get("/getpartNumber", partNumberController.getAllPartNumbers);

router.get("/getheader", headercontroller.getHeaderDetails);
router.get("/getcommodity", commodityController.getCommodityDetails);
router.post("/getsubcommodity", subCommodityController.getSubCommodity);

module.exports = router;
