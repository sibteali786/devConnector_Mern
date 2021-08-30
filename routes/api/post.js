const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../modals/Post");
const Profile = require("../../modals/Profile");
const User = require("../../modals/User");
const { check, validationResult } = require("express-validator");

// @route   POST api/post
// @desc    Create a post
// @access  Public

router.post(
  "/",
  [auth, [check("text", "Text is required ").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select("-password");
    try {
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
