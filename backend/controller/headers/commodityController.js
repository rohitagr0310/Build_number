const commodityModule = require("../../module/headers/commodityModule");
const subCommodityModule = require("../../module/headers/subCommodityModule");
const { sendError, sendResponse } = require("../../utils/responseHandler");
const errorCodes = require("../../utils/errorCodes");

module.exports = {
  addcommodity: async (req, res) => {
    const commodityContent = req.body;

    try {
      const prev = await commodityModule.commodityCollection
        .findOne({ code: commodityContent.code })
        .sort({ _id: -1 })
        .limit(1);

      if (prev) {
        sendError(res, errorCodes.ALREADY_EXISTS);
      } else {
        await commodityModule.addCommodity(commodityContent);

        const field = {
          subcommodity: commodityContent.code,
          CrossEntry: [],
        };

        try {
          await subCommodityModule.createEmpty(field);
          console.log("subCommodity Created Succesfully");
          sendResponse(
            res,
            errorCodes.SUCCESS.code,
            "subCommodity Created Successfully"
          );
        } catch (err) {
          console.error("Error creating subCommodity:", err);
          sendError(res, errorCodes.INTERNAL_SERVER_ERROR, err.message);
        }
      }
    } catch (err) {
      console.error("Error adding commodity:", err);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  },

  getCommodityDetails: async (req, res) => {
    try {
      const commodities = await commodityModule.commodityCollection.find();

      if (commodities && commodities.length > 0) {
        sendResponse(
          res,
          errorCodes.SUCCESS.code,
          "Commodities fetched successfully",
          commodities
        );
      } else {
        sendError(res, errorCodes.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching commodity details:", error);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
};
