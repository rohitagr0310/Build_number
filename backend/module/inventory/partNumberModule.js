const mongoose = require("mongoose");

const partNumberSchema = mongoose.Schema({
  code_header: {
    type: String,
    required: true,
    maxlength: 1,
    minlength: 1,
    match: /^[A-Z]$/, // Ensures that the code is a single uppercase letter
  },
  code_Commodity: {
    type: String,
    required: true,
    maxlength: 1,
    minlength: 1,
    match: /^[A-Z]$/, // Ensures that the code is a single uppercase letter
  },
  code_SubCommodity: {
    type: Number,
    required: true,
    maxlength: 2,
    minlength: 1,
  },
  CrossEntry: [
    {
      index: Number,
      Definition: String,
      revisionNumber: Number,
      revisedBy: String,
      name: {
        type: String,
        required: true,
      },
      currentStock: {
        type: Number,
        required: false,
        default: 0,
      },
      lastIssued: {
        type: Date,
        required: false,
        default: null,
      },
      lastRefilled: {
        type: Date,
        required: false,
        default: null,
      },
    },
  ],
});

const partNumberCollection = mongoose.model("part_number", partNumberSchema);

module.exports = {
  partNumberCollection,
  createEmpty: async (fields) => {
    try {
      const partNumber = new partNumberCollection(fields);
      await partNumber.save();
      console.log("Part number saved successfully.");
    } catch (error) {
      console.error("Error saving part number:", error);
    }
  },
};
