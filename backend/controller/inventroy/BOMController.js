const {
  subassemblyCollection,
  createSubassembly,
} = require("../../module/inventory/BOMModule"); // Import the subassembly model

// Controller for Subassemblies

module.exports = {
  // Create a new subassembly
  createNewSubassembly: async (req, res) => {
    try {
      const {
        name,
        description,
        manufacturer,
        vendor,
        quantity,
        part_numbers, // Array of part numbers (ObjectId references)
        parent_id, // Parent subassembly ObjectId (optional)
      } = req.body;

      // Ensure that all required fields are provided
      if (!name || !description || !manufacturer || !vendor || !quantity) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Create a new subassembly entry
      const subassemblyData = {
        name,
        description,
        manufacturer,
        vendor,
        quantity,
        part_numbers,
        parent_id: parent_id || null, // Handle optional parent subassembly
      };

      const newSubassembly = await createSubassembly(subassemblyData);
      return res.status(201).json({
        message: "Subassembly created successfully",
        subassembly: newSubassembly,
      });
    } catch (error) {
      console.error("Error creating subassembly:", error);
      return res.status(500).json({
        message: "Failed to create subassembly",
        error: error.message,
      });
    }
  },

  // Get a list of all subassemblies
  getSubassemblies: async (req, res) => {
    try {
      const subassemblies = await subassemblyCollection
        .find()
        .populate("part_numbers");
      return res.status(200).json({
        message: "Subassemblies fetched successfully",
        subassemblies,
      });
    } catch (error) {
      console.error("Error fetching subassemblies:", error);
      return res.status(500).json({
        message: "Failed to fetch subassemblies",
        error: error.message,
      });
    }
  },

  // Get a specific subassembly by ID
  getSubassemblyById: async (req, res) => {
    const { id } = req.body; // Get subassembly ID from request body

    try {
      const subassembly = await subassemblyCollection
        .findById(id)
        .populate("part_numbers")
        .exec();

      if (!subassembly) {
        return res.status(404).json({
          message: "Subassembly not found",
        });
      }

      return res.status(200).json({
        message: "Subassembly fetched successfully",
        subassembly,
      });
    } catch (error) {
      console.error("Error fetching subassembly:", error);
      return res.status(500).json({
        message: "Failed to fetch subassembly",
        error: error.message,
      });
    }
  },

  // Update an existing subassembly
  updateSubassembly: async (req, res) => {
    const {
      id,
      name,
      description,
      manufacturer,
      vendor,
      quantity,
      part_numbers,
      parent_id,
    } = req.body;

    // Ensure that all required fields are provided
    if (!id || !name || !description || !manufacturer || !vendor || !quantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const updatedSubassembly = await subassemblyCollection.findByIdAndUpdate(
        id,
        {
          name,
          description,
          manufacturer,
          vendor,
          quantity,
          part_numbers,
          parent_id,
        },
        { new: true } // Return the updated subassembly
      );

      if (!updatedSubassembly) {
        return res.status(404).json({
          message: "Subassembly not found",
        });
      }

      return res.status(200).json({
        message: "Subassembly updated successfully",
        subassembly: updatedSubassembly,
      });
    } catch (error) {
      console.error("Error updating subassembly:", error);
      return res.status(500).json({
        message: "Failed to update subassembly",
        error: error.message,
      });
    }
  },

  // Delete a subassembly
  deleteSubassembly: async (req, res) => {
    const { id } = req.body; // Get subassembly ID from request body

    try {
      const deletedSubassembly = await subassemblyCollection.findByIdAndDelete(
        id
      );

      if (!deletedSubassembly) {
        return res.status(404).json({
          message: "Subassembly not found",
        });
      }

      return res.status(200).json({
        message: "Subassembly deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subassembly:", error);
      return res.status(500).json({
        message: "Failed to delete subassembly",
        error: error.message,
      });
    }
  },
};
