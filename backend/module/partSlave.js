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
    },
  ],
});

const partNumberCollection = mongoose.model("part_slave", partNumberSchema);

module.exports = {
  partNumberCollection,
  Addpart: (fields) => {
    const partNumber = new partNumberCollection(fields);
    partNumber.save();
  },
};
