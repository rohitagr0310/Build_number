const headerModule = require("../../module/headers/headerModule");
const { sendError, sendResponse } = require("../../utils/responseHandler");
const errorCodes = require("../../utils/errorCodes");

module.exports = {
  addHeader: async (req, res) => {
    const headerContent = req.body;

    try {
      const prev = await headerModule.headerCollection.findOne({
        code: headerContent.code,
      });

      if (prev) {
        // If the header already exists, send an error response
        sendError(res, errorCodes.ALREADY_EXISTS);
      } else {
        // Add new header
        await headerModule.addHeader(headerContent);
        sendResponse(res, errorCodes.SUCCESS.code, "Header Added Successfully");
      }
    } catch (err) {
      console.error("Error adding header:", err);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, err.message);
    }
  },

  getHeaderDetails: async (req, res) => {
    try {
      const headers = await headerModule.headerCollection.find();

      if (headers && headers.length > 0) {
        sendResponse(
          res,
          errorCodes.SUCCESS.code,
          "Headers fetched successfully",
          headers
        );
      } else {
        sendError(res, errorCodes.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching header details:", error);
      sendError(res, errorCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
};
