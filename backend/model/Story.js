const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    cloudinaryPublicId: { type: String },
    expiresAt: {
      type: Date,
      default: function () {
        // Set expiration to 24 hours from creation
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

// Add index on expiresAt field for better query performance
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
