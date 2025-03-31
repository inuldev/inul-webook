const User = require("../model/User");
const Bio = require("../model/UserBio");
const { response } = require("../utils/responseHandler");
const {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} = require("../config/cloudinary");

const createOrUpdateUserBio = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      bioText,
      liveIn,
      relationship,
      workplace,
      education,
      phone,
      hometown,
    } = req.body;

    let bio = await Bio.findOneAndUpdate(
      { user: userId },
      {
        bioText,
        liveIn,
        relationship,
        workplace,
        education,
        phone,
        hometown,
      },
      { new: true, runValidators: true }
    );

    // if bio does not exist to create new one
    if (!bio) {
      bio = new Bio({
        user: userId,
        bioText,
        liveIn,
        relationship,
        workplace,
        education,
        phone,
        hometown,
      });

      await bio.save();
      await User.findByIdAndUpdate(userId, { bio: bio._id });
    }

    return response(res, 201, "Bio create or update successfully", bio);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

const updateCoverPhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;
    let coverPhoto = null;
    let cloudinaryPublicId = null;

    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "user not found with this id");
    }

    // Delete old cover photo from Cloudinary if exists
    if (user.coverPhoto && user.coverPhotoPublicId) {
      try {
        await deleteFileFromCloudinary(user.coverPhotoPublicId, "image");
      } catch (cloudinaryError) {
        console.error("Error deleting old cover photo:", cloudinaryError);
      }
    }

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      coverPhoto = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    if (!coverPhoto) {
      return response(res, 400, "failed to upload cover photo");
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          coverPhoto,
          coverPhotoPublicId: cloudinaryPublicId,
        },
      },
      { new: true }
    );

    return response(res, 200, "Cover photo update successfully", updatedUser);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, gender, dateOfBirth } = req.body;
    const file = req.file;
    let profilePicture = null;
    let profilePicturePublicId = null;

    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "user not found with this id");
    }

    if (file) {
      // Delete old profile picture from Cloudinary if exists
      if (user.profilePicture && user.profilePicturePublicId) {
        try {
          await deleteFileFromCloudinary(user.profilePicturePublicId, "image");
        } catch (cloudinaryError) {
          console.error("Error deleting old profile picture:", cloudinaryError);
        }
      }

      const uploadResult = await uploadFileToCloudinary(file);
      profilePicture = uploadResult.secure_url;
      profilePicturePublicId = uploadResult.public_id;
    }

    // Create update object
    const updateData = {
      ...(username && { username }),
      ...(gender && { gender }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(profilePicture && {
        profilePicture,
        profilePicturePublicId,
      }),
    };

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    return response(res, 200, "user profile update successfully", updatedUser);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error", error.message);
  }
};

module.exports = {
  createOrUpdateUserBio,
  updateCoverPhoto,
  updateUserProfile,
};
