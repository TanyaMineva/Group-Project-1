const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

// We add the checkAuth after the path, BUT before the logic we want to execute
router.post("", checkAuth, extractFile, PostController.createPost);


// app.patch // Update an existing resource
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);


module.exports = router;
