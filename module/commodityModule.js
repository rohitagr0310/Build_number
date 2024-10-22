const mongoose = require("mongoose");

const CommoditySchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    maxlength: 1,
    minlength: 1,
    match: /^[A-Z]$/, // Ensures that the code is a single uppercase letter
  },
  Definition: {
    type: String,
    required: true,
  },
  // revisionNumber: {
  //     type: Number,
  //     required: true,
  //     validate: {
  //         validator: function(value) {
  //             return value > 0; // Revision number cannot be zero
  //         },
  //         message: props => `${props.value} is not a valid revision number. Revision number must be greater than zero.`
  //     }
  // },
  revisionDate: {
    type: Date,
    default: Date.now,
  },
  revisedBy: {
    type: String,
    required: true,
  },
});

const commodityCollection = mongoose.model("commodity_block", CommoditySchema);

module.exports = {
  commodityCollection,
  addCommodity: (field) => {
    const commodity = new commodityCollection(field);
    return commodity.save();
  },
};
