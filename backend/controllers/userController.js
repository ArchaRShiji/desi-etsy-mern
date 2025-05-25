// controllers/userController.js
const User = require("../models/User");

const completeProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body },
      { new: true }
    );
    res.json({ msg: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  completeProfile,
};
