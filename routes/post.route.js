const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { uploadFile } = require("../utils/fileUpload.utils")
const upload = uploadFile("postsImages")

// const { creatingPost, gettingOnePost, gettingAllPosts, gettingUserPosts, gettingFollowPhotoPosts, gettingPhotoGeneralPosts, gettingArtGeneralPosts, gettingFollowArtPosts,
//     gettingDesignGeneralPosts, gettingFollowDesignPosts, gettingSingingGeneralPosts, gettingFollowSingingPosts, deletingPost } = require("../controllers/posts.controller");

const { creatingPost, gettingOnePost, gettingAllPosts, gettingUserPosts,gettingArtGeneralPosts, gettingFollowArtPosts, deletingPost } = require("../controllers/posts.controller");

router.post("/posts/new", [upload.single("url"), authenticate], creatingPost);
router.get("/posts", authenticate, gettingAllPosts);
router.get("/users/:userId/posts", authenticate, gettingUserPosts);

// router.get("/posts/photography", authenticate, gettingFollowPhotoPosts);
// router.get("/general/posts/photography", authenticate, gettingPhotoGeneralPosts);
router.get("/following/posts/art", authenticate, gettingFollowArtPosts);
router.get("/general/posts/art", authenticate, gettingArtGeneralPosts);
// router.get("/posts/design", authenticate, gettingFollowDesignPosts);
// router.get("/general/posts/design", authenticate, gettingDesignGeneralPosts);
// router.get("/posts/singing", authenticate, gettingFollowSingingPosts);
// router.get("/general/posts/singing", authenticate, gettingSingingGeneralPosts);

router.route("/posts/:id").get(authenticate, gettingOnePost).delete(authenticate, deletingPost);

module.exports = router;
