import { create } from "zustand";

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

export const usePostStore = create((set) => ({
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

      return newPost;
    } catch (error) {
      set({ error, loading: false });
      throw error;
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

      return newStory;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  //create a new story
  handleLikePost: async (postId) => {
    set({ loading: true });
    try {
      await likePost(postId);
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  //create a new story
  handleCommentPost: async (postId, text) => {
    set({ loading: true });
    try {
      const newComments = await commentsPost(postId, { text });
      set((state) => ({
        posts: state.posts.map((post) =>
          post?._id === postId
            ? { ...post, comments: [...post.comments, newComments] }
            : post
        ),
      }));
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  //create a new story
  handleSharePost: async (postId) => {
    set({ loading: true });
    try {
      await sharePost(postId);
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      set({ error, loading: false });
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
      const posts = await getAllPosts(); // Fetch fresh data
      set({ posts });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
