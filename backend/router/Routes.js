const express = require("express");
const router = express.Router();

const headercontroller = require("../controller/headercontroller");
const commodityController = require("../controller/commodityController");
const subCommodityController = require("../controller/subcommodityController");
const partNumberController = require("../controller/partNumberController");

router.post("/createHeader", headercontroller.addHeader);
router.post("/createCommodity", commodityController.addcommodity);
router.post("/createSubCommodity", subCommodityController.addSubCommodity);
router.post("/createpartNumber", partNumberController.addPartNumber);

router.get("/getheader", headercontroller.getHeaderDetails);
router.get("/getcommodity", commodityController.getCommodityDetails);
router.post("/getsubcommodity", subCommodityController.getSubCommodity);

module.exports = router;
