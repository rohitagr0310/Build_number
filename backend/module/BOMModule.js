const mongoose = require("mongoose");

const BOMSchema = mongoose.Schema({
  serial_No: String,
});

const BOMCollection = mongoose.model("BOM", BOMSchema);

module.exports = {
  BOMCollection,
  Entry: (field) => {
    const Entry = new BOMCollection(field);
    return Entry.save();
  },
};
