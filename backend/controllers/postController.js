const Post = require("../model/Post");
const Story = require("../model/Story");
const { response } = require("../utils/responseHandler");
const {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} = require("../config/cloudinary");

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content } = req.body;
    const file = req.file;
    let mediaUrl = null;
    let mediaType = null;
    let cloudinaryPublicId = null;

    if (file) {
      try {
        const uploadResult = await uploadFileToCloudinary(file);
        mediaUrl = uploadResult?.secure_url;
        mediaType = file.mimetype.startsWith("video") ? "video" : "image";
        cloudinaryPublicId = uploadResult?.public_id;
      } catch (uploadError) {
        console.log("Error uploading file:", uploadError);
        return response(res, 400, "File upload failed. " + uploadError.message);
      }
    }

    //create a new post
    const newPost = await new Post({
      user: userId,
      content,
      mediaUrl,
      mediaType,
      cloudinaryPublicId,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    });

    await newPost.save();
    return response(res, 201, "Post created successfully", newPost);
  } catch (error) {
    console.log("error creating post", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//create story
const createStory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return response(res, 400, "file is required to create a story");
    }
    let mediaUrl = null;
    let mediaType = null;
    let cloudinaryPublicId = null;

    if (file) {
      try {
        const uploadResult = await uploadFileToCloudinary(file);
        mediaUrl = uploadResult?.secure_url;
        mediaType = file.mimetype.startsWith("video") ? "video" : "image";
        cloudinaryPublicId = uploadResult?.public_id;
      } catch (uploadError) {
        console.log("Error uploading file:", uploadError);
        return response(res, 400, "File upload failed. " + uploadError.message);
      }
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    //create a new story
    const newStory = await new Story({
      user: userId,
      mediaUrl,
      mediaType,
      cloudinaryPublicId,
      expiresAt,
    });

    await newStory.save();
    return response(res, 201, "Story created successfully", newStory);
  } catch (error) {
    console.log("error creating story", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//getAllStory
const getAllStory = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }, // Only get non-expired stories
      mediaUrl: { $exists: true }, // Only get stories with mediaUrl set
    })
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email");

    // Add remaining time for each story
    const storiesWithTime = stories.map((story) => {
      const remaining = story.expiresAt - new Date();
      return {
        ...story.toObject(),
        remainingTime: Math.max(0, Math.floor(remaining / 1000)), // remaining time in seconds
      };
    });

    return response(res, 200, "Get all story successfully", storiesWithTime);
  } catch (error) {
    console.log("error getting story", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      });
    return response(res, 201, "Get all posts successfully", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//get post by userId
const getPostByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return response(res, 400, "UserId is require to get user post");
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username, profilePicture",
      });
    return response(res, 201, "Get user post successfully", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//like post api
const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likeCount = Math.max(0, post.likeCount - 1);

      const updatedPost = await post.save();
      return response(res, 200, "Post unliked successfully", {
        post: updatedPost,
        message: "unliked",
      });
    } else {
      post.likes.push(userId);
      post.likeCount += 1;

      const updatedPost = await post.save();
      return response(res, 200, "Post liked successfully", {
        post: updatedPost,
        message: "liked",
      });
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//post comments by user
const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const { text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }

    post.comments.push({ user: userId, text });
    post.commentCount += 1;

    await post.save();
    return response(res, 201, "Comments added successfully", post);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//share on post by user
const sharePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }
    const hasUserShared = post.share.includes(userId);
    if (!hasUserShared) {
      post.share.push(userId);
    }

    post.shareCount += 1;

    await post.save();
    return response(res, 201, "Post share successfully", post);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return response(res, 404, "Post not found");
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId) {
      return response(
        res,
        403,
        "Unauthorized: You can only delete your own posts"
      );
    }

    // Delete media from Cloudinary if exists
    if (post.cloudinaryPublicId) {
      try {
        await deleteFileFromCloudinary(post.cloudinaryPublicId, post.mediaType);
      } catch (cloudinaryError) {
        console.error("Error deleting media from Cloudinary:", cloudinaryError);
      }
    }

    await Post.findByIdAndDelete(postId);
    return response(res, 200, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    const story = await Story.findById(storyId);

    if (!story) {
      return response(res, 404, "Story not found");
    }

    // Check if the user is the owner of the story
    if (story.user.toString() !== userId) {
      return response(
        res,
        403,
        "Unauthorized: You can only delete your own stories"
      );
    }

    // Delete media from Cloudinary if exists
    if (story.cloudinaryPublicId) {
      try {
        await deleteFileFromCloudinary(
          story.cloudinaryPublicId,
          story.mediaType
        );
      } catch (cloudinaryError) {
        console.error("Error deleting media from Cloudinary:", cloudinaryError);
      }
    }

    await Story.findByIdAndDelete(storyId);
    return response(res, 200, "Story deleted successfully");
  } catch (error) {
    console.error("Error deleting story:", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostByUserId,
  likePost,
  addCommentToPost,
  sharePost,
  createStory,
  getAllStory,
  deletePost,
  deleteStory,
};
