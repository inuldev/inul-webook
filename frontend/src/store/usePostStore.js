import { create } from "zustand";
import toast from "react-hot-toast";

import {
  createPost,
  getAllPosts,
  getAllStory,
  getAllUserPosts,
  likePost,
  sharePost,
  createStory,
  commentsPost,
  deletePost,
} from "@/service/post.service";

export const usePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
  story: [],
  loading: false,
  error: null,

  //fetchPost
  fetchPost: async () => {
    set({ loading: true });
    try {
      const posts = await getAllPosts();
      set({ posts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //fetch user posts
  fetchUserPost: async (userId) => {
    set({ loading: true });
    try {
      const userPosts = await getAllUserPosts(userId);
      set({ userPosts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //fetch all story
  fetchStoryPost: async () => {
    set({ loading: true });
    try {
      const story = await getAllStory();
      set({ story, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //create a new post
  handleCreatePost: async (postData) => {
    set({ loading: true });
    try {
      const newPost = await createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      toast.success("Post created successfully");
      return newPost; // Return the new post for confirmation
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to create a post");
      throw error; // Throw the error to be handled by the caller
    }
  },

  //create a new story
  handleCreateStory: async (storyData) => {
    set({ loading: true });
    try {
      const newStory = await createStory(storyData);
      set((state) => ({
        story: [newStory, ...state.story],
        loading: false,
      }));
      toast.success("Story created successfully");
      return newStory; // Return the new story for confirmation
    } catch (error) {
      set({ error, loading: false });
      toast.error("failed to create a story");
      throw error; // Throw the error to be handled by the caller
    }
  },

  //create a new story
  handleLikePost: async (postId) => {
    try {
      await likePost(postId);
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //create a new story
  handleCommentPost: async (postId, comment) => {
    try {
      await commentsPost(postId, { text: comment });
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //create a new story
  handleSharePost: async (postId) => {
    try {
      await sharePost(postId);
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //delete a post
  handleDeletePost: async (postId) => {
    try {
      await deletePost(postId);
      // Update local state immediately after successful deletion
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
      throw error; // Throw the error to be handled by the caller
    }
  },
}));
