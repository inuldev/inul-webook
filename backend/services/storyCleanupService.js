const Story = require("../model/Story");
const { deleteFileFromCloudinary } = require("../config/cloudinary");
const connectDb = require("../config/db");

class StoryCleanupService {
  static async cleanupExpiredStories() {
    try {
      // Ensure database connection
      await connectDb();

      // Find all expired stories
      const expiredStories = await Story.find({
        expiresAt: { $lt: new Date() },
        mediaUrl: { $exists: true }, // Only delete stories with mediaUrl set
      });

      // Delete media files from Cloudinary
      for (const story of expiredStories) {
        try {
          if (story.cloudinaryPublicId) {
            await deleteFileFromCloudinary(
              story.cloudinaryPublicId,
              story.mediaType
            );
          }
        } catch (error) {
          console.error(`Error deleting media for story ${story._id}:`, error);
        }
      }

      // Delete expired stories from database
      const result = await Story.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      console.log(`Cleaned up ${result.deletedCount} expired stories`);
    } catch (error) {
      console.error("Error in story cleanup:", error);
    }
  }
}

module.exports = StoryCleanupService;
