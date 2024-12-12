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
    min: 0, // Minimum allowed value
    max: 99, // Maximum allowed value
  },
  CrossEntry: [
    {
      index: Number,
      name: {
        type: String,
        required: true,
      },
      revisions: [
        {
          revisionNumber: Number,
          revisedBy: String,
          Definition: String,
          revisedDate: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

const partNumberCollection = mongoose.model("part_slave", partNumberSchema);

module.exports = {
  partNumberCollection,
  Addpart: (fields) => {
    const partNumber = new partNumberCollection(fields);
    return partNumber.save();
  },
};
