const mongoose = require("mongoose");

// Subassembly Schema
const subassemblySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  part_numbers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "part_number", // Multiple references to part numbers
      required: false,
    },
  ],
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subassembly", // Reference to subassembly schema for nesting
    default: null, // Parent can be null for root subassemblies
  },
});

// Create a subassembly with multiple parts
const createSubassembly = (fields) => {
  const subassembly = new subassemblyCollection(fields);
  return subassembly.save();
};

const subassemblyCollection = mongoose.model("subassembly", subassemblySchema);

module.exports = {
  subassemblyCollection,
  createSubassembly,
};
