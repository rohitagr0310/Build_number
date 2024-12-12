const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

const sendError = (res, errorCode, details = null) => {
  res.status(errorCode.code).json({
    statusCode: errorCode.code,
    message: errorCode.message,
    details,
  });
};

module.exports = { sendResponse, sendError };
