const jwt = require("jsonwebtoken");
const User = require("../module/userModule");

module.exports = {
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User with this email or username already exists",
        });
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  },
};
