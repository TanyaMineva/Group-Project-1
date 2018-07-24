const express = require("express");

const ProfileController = require("../controllers/posts");

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

// We add the checkAuth after the path, BUT before the logic we want to execute
router.post("", checkAuth, extractFile, ProfileController.createProfile);



// app.patch // Update an existing resource
router.post("/", checkAuth, extractFile, ProfileController.createProfile);  // When we SAVE the profile
router.get("/id", ProfileController.getProfile);
router.get("/", ProfileController.getProfiles);  // When we SAVE the profile
router.delete("/:id", checkAuth, ProfileController.deleteProfile);



module.exports = router;