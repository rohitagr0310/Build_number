const subcommodityModule = require("../../module/headers/subCommodityModule");
const { sendError, sendResponse } = require("../../utils/responseHandler");
const errorCodes = require("../../utils/errorCodes");

module.exports = {
  addSubCommodity: async (req, res) => {
    const subcommodityContent = req.body;
    console.log(subcommodityContent);

    try {
      const data = await subcommodityModule.subcommodityCollection.findOne({
        subcommodity: subcommodityContent.code,
      });

      if (data) {
        if (data.subcommodity === "F") {
          const final = {
            index: 0,
            Definition: subcommodityContent.Definition,
            revisedBy: subcommodityContent.revisedBy,
            revisionDate: new Date(), // Set the current date for revisionDate
          };
          data.CrossEntry = [final];
          await data.save();
          sendResponse(
            res,
            errorCodes.SUCCESS.code,
            "Final Subcommodity is created"
          );
        } else {
          if (data.CrossEntry.length > 100) {
            // Limit reached, do not add more entries
            sendError(res, errorCodes.MAX_LIMIT_REACHED);
          } else {
            // Adding new CrossEntry
            const CrossEntry = {
              index: data.CrossEntry.length + 1,
              Definition: subcommodityContent.Definition,
              revisedBy: subcommodityContent.revisedBy,
              revisionDate: new Date(), // Set the current date for revisionDate
            };
            data.CrossEntry.push(CrossEntry);
            await data.save();
            sendResponse(
              res,
              errorCodes.SUCCESS.code,
              "CrossEntry updated or added successfully"
            );
          }
        }
      } else {
        // Handle case where subcommodity with given code is not found
        sendError(res, errorCodes.NOT_FOUND);
      }
    } catch (err) {
      console.error("Error:", err.message);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  },

  getSubCommodity: async (req, res) => {
    const subcommodityCode = req.body.code;

    try {
      const subcommodity =
        await subcommodityModule.subcommodityCollection.findOne({
          subcommodity: subcommodityCode,
        });

      if (subcommodity) {
        sendResponse(
          res,
          errorCodes.SUCCESS.code,
          "Subcommodity details fetched successfully",
          subcommodity.CrossEntry
        );
      } else {
        sendError(res, errorCodes.NOT_FOUND);
      }
    } catch (err) {
      console.error("Error:", err.message);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  },
};
