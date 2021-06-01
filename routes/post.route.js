const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { uploadFile } = require("../utils/fileUpload.utils")
const upload = uploadFile("postsImages")

const { creatingPost, gettingOnePost, gettingAllPosts, deletingPost } = require("../controllers/posts.controller");

router.post("/posts/new", [upload.single("url"), authenticate], creatingPost);
router.get("/posts", authenticate,gettingAllPosts);
router.route("/posts/:id").get(authenticate, gettingOnePost).delete(authenticate, deletingPost);

module.exports = router;
