const mongoose = require("mongoose");

const subcommoditySchema = mongoose.Schema({
  subcommodity: {
    type: String,
    required: true,
    maxlength: 1,
    minlength: 1,
    match: /^[A-Z]$/, // Ensures that the code is a single uppercase letter
  },
  CrossEntry: [
    {
      index: Number,
      Definition: String,
      revisedBy: String,
      revisionDate: Date,
    },
  ],
});

const subcommodityCollection = mongoose.model(
  "subcommmodity",
  subcommoditySchema
);

module.exports = {
  subcommodityCollection,
  createEmpty: (field) => {
    const subcommmodity = new subcommodityCollection(field);
    return subcommmodity.save();
  },
};
