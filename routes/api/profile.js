const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../modals/Profile");
const User = require("../../modals/User");
const { check, validationResult } = require("express-validator");
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

// @route   POST api/profile
// @desc    Create or Update a user profile
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there is an error
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring to get things we need
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // ready to update and insert the data
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // if there is a profile then update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create if there is no profile
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
    res.send("Hello");
  }
);
module.exports = router;
