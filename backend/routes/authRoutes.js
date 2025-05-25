const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
require("../config/passport");

// POST /api/register
router.post('/register', authController.register);

// POST /api/login
router.post('/login', authController.login);

// Initiate Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle callback after Google has authenticated the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;
    const userId = req.user._id;

    // Redirect to frontend "complete profile" route
    res.redirect(`${process.env.FRONTEND_URL}/complete-profile?token=${token}&id=${userId}`);
  }
);

// Add to authRoutes.js or a new route file
const User = require("../models/User");

router.put("/api/complete-profile/:id", async (req, res) => {
  try {
    const { role, businessName, address, phone, description } = req.body;

    const update = { role };
    if (role === "artisan") {
      Object.assign(update, { businessName, address, phone, description, isApproved: false });
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", err });
  }
});


module.exports = router;
