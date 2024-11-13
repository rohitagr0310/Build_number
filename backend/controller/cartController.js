const cartCollection = require("../module/cart");

// Get user's cart
module.exports = {
  getCart: async (req, res) => {
    try {
      const cart = await cartCollection.findOne({ userId: req.user.userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart Empty" });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching cart", error });
    }
  },

  // Add item to cart
  addItem: async (req, res) => {
    try {
      const { partNumber, header, commodity, subcommodity, description } =
        req.body;

      // Check if required fields are provided
      if (
        !partNumber ||
        !header ||
        !commodity ||
        !subcommodity ||
        !description
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let cart = await cartCollection.findOne({ userId: req.user.userId });

      if (!cart) {
        cart = new cartCollection({
          userId: req.user.userId,
          items: [],
        });
      }

      cart.items.push({
        partNumber,
        header,
        commodity,
        subcommodity,
        description,
      });

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  },

  // Update cart item
  updateItem: async (req, res) => {
    try {
      const {
        itemId,
        partNumber,
        header,
        commodity,
        subcommodity,
        description,
      } = req.body;

      // Check if itemId and required fields are provided
      if (
        !itemId ||
        !partNumber ||
        !header ||
        !commodity ||
        !subcommodity ||
        !description
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const cart = await cartCollection.findOne({ userId: req.user.userId });

      const item = cart.items.id(itemId);
      if (item) {
        item.partNumber = partNumber;
        item.header = header;
        item.commodity = commodity;
        item.subcommodity = subcommodity;
        item.description = description;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating item", error });
    }
  },

  // Remove item from cart
  removeItem: async (req, res) => {
    try {
      const { itemId } = req.body;

      if (!itemId) {
        return res.status(400).json({ message: "Item ID is required" });
      }

      const cart = await cartCollection.findOne({ userId: req.user.userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Find the index of the item with the specified ID
      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );

      if (itemIndex !== -1) {
        // Remove the item at the found index
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error removing item", error });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const cart = await cartCollection.findOne({ userId: req.user.userId });
      if (cart) {
        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared" });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error clearing cart", error });
    }
  },
};
