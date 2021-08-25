const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../modals/Profile");
const User = require("../../modals/User");
// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ); // The reason for setting the user user.id is that in Profile schema user is an id not a name
    // The populate method helps to get things from user modal instead of profile
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}); // Now its a protected route as we have added auth here as 2nd arg

module.exports = router;
