const express = require("express");
const request = require("request");
const config = require("config");
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
          { new: true } // used to return updated object
        );

        return res.json(profile);
      }

      // Create if there is no profile
      profile = new Profile(profileFields); // create new instance
      await profile.save(); // save it to data base
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
    res.send("Hello");
  }
);

// @route   GET api/profile
// @desc    Get All profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "Profile Not Found" });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete Profile and user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove Profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });

    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Removed " });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add Profile experience
// @access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("company", "Company is Required").not().isEmpty(),
      check("from", "From Date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring Data
    const { title, company, location, from, to, current, description } =
      req.body;
    // assigning destructured values to new variable
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Adding Experience not updating
      // pushing or inserting into the beginning experience array
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/profile/experience/:experience_id
// @desc    Update Profile experience
// @access  Private

// router.post(
//   "/experience/:experience_id",
//   [
//     auth,
//     [
//       check("title", "Title is Required").not().isEmpty(),
//       check("company", "Company is Required").not().isEmpty(),
//       check("from", "From Date is Required").not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const experience_id = req.params.experience_id;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       let profile = await Profile.findOne({
//         user: req.user.id,
//       });
//       if (experience_id) {
//         profile = await Profile.findOneAndUpdate(
//           {
//             $and: [
//               { user: req.user.id },
//               { experience: { $elemMatch: { _id: req.params.experience_id } } },
//             ],
//           },
//           {
//             $set: {
//               "experience.$.current": req.body.current,
//               "experience.$.title": req.body.title,
//               "experience.$.company": req.body.company,
//               "experience.$.location": req.body.location,
//               "experience.$.from": req.body.from,
//               "experience.$.to": req.body.to,
//               "experience.$.description": req.body.description,
//             },
//           },
//           { new: true } // used to return updated object
//         );
//         return res.json(profile);
//       }
//       return res.status(400).json({ msg: "Profile Experience Not Found" });
//     } catch (error) {
//       console.error(error.message);
//       if (error.kind == "ObjectId") {
//         return res.status(400).json({ msg: "Profile Not Found" });
//       }
//       res.status(500).send("Server Error");
//     }
//   }
// );

// @route   PUT api/profile/experience/:exp_id
// @desc    Update Profile experience
// @access  Private
router.put(
  "/experience/:exp_id",
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("company", "Company is Required").not().isEmpty(),
      check("from", "From Date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;
    const exp = { title, company, from };
    if (location) exp.location = location;
    if (to) exp.to = to;
    if (current) exp.current = current;
    if (description) exp.description = description;

    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id, "experience._id": req.params.exp_id },
        {
          $set: {
            // preserving the experience id
            "experience.$": { _id: req.params.exp_id, ...exp },
          },
        },
        {
          new: true,
        }
      );
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT api/profile/education
// @desc    Add Profile education
// @access  Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is Required").not().isEmpty(),
      check("degree", "Degree is Required").not().isEmpty(),
      check("fieldofstudy", "Field Of Study Date is Required").not().isEmpty(),
      check("from", "From Date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring Data
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    // assigning destructured values to new variable
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Adding Experience not updating
      // pushing or inserting into the beginning experience array
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/education/:exp_id
// @desc     Delete education from profile
// @access   Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos for github
// @access   Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        res.sendStatus(404).json({ msg: "No Github profile found" });
      }
      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
