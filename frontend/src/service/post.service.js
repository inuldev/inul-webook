import axiosInstance from "./url.service";

//create method for posts
export const createPost = async (postData) => {
  try {
    const result = await axiosInstance.post("/users/posts", postData);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//create method for story
export const createStory = async (postData) => {
  try {
    const result = await axiosInstance.post("/users/story", postData);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get all post method
export const getAllPosts = async () => {
  try {
    const result = await axiosInstance.get("/users/posts");
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get all story method
export const getAllStory = async () => {
  try {
    const result = await axiosInstance.get("/users/story");
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//method for like a post
export const likePost = async (postId) => {
  try {
    const result = await axiosInstance.post(`/users/posts/likes/${postId}`);
    return {
      data: result?.data?.data,
      message: result?.data?.message,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//method for comments a post
export const commentsPost = async (postId, comment) => {
  try {
    const result = await axiosInstance.post(
      `/users/posts/comments/${postId}`,
      comment
    );
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//method for share a post
export const sharePost = async (postId) => {
  try {
    const result = await axiosInstance.post(`/users/posts/share/${postId}`);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get all users posts
export const getAllUserPosts = async (userId) => {
  try {
    const result = await axiosInstance.get(`/users/posts/user/${userId}`);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//delete a post
export const deletePost = async (postId) => {
  try {
    const result = await axiosInstance.delete(`/users/posts/${postId}`);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//delete a story
export const deleteStory = async (storyId) => {
  try {
    const result = await axiosInstance.delete(`/users/story/${storyId}`);
    return result?.data?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
