import mongoose, { Schema } from "mongoose";

const travelStorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    visitedLocations: {
      type: [String],
      default: [],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    visitedDate:{
        type:Date,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

export const Story = mongoose.model("Story", travelStorySchema);
