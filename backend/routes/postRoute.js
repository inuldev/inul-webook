const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const {
  createPost,
  getAllPosts,
  getPostByUserId,
  likePost,
  sharePost,
  addCommentToPost,
  getAllStory,
  createStory,
  deletePost,
  deleteStory,
} = require("../controllers/postController");

//create post
router.post(
  "/posts",
  authMiddleware,
  multerMiddleware.single("media"),
  createPost
);

//get all posts
router.get("/posts", authMiddleware, getAllPosts);

//get post by userid
router.get("/posts/user/:userId", authMiddleware, getPostByUserId);

//user like post route
router.post("/posts/likes/:postId", authMiddleware, likePost);

//user share post route
router.post("/posts/share/:postId", authMiddleware, sharePost);

//user comments post route
router.post("/posts/comments/:postId", authMiddleware, addCommentToPost);

//create story
router.post(
  "/story",
  authMiddleware,
  multerMiddleware.single("media"),
  createStory
);

//get all story
router.get("/story", authMiddleware, getAllStory);

//delete post
router.delete("/posts/:postId", authMiddleware, deletePost);

//delete story
router.delete("/story/:storyId", authMiddleware, deleteStory);

module.exports = router;
