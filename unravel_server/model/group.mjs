import mongoose from "mongoose";

const Schema = mongoose.Schema;

const groups = new Schema({
  name: {
    type: String,
    required: true,
  },
  group_admin: Schema.Types.ObjectId,
  created_date: Date,
  group_profile: String,
  description: String,
  completed_trips: [Schema.Types.ObjectId],
  planned_trips: [Schema.Types.ObjectId],
  members: [Schema.Types.ObjectId],
  join_requirements: {
    min_user_followers: Number,
    agree_to_share_info: Boolean,
    min_user_rating: Number,
  },
});

export default mongoose.model("groups", groups);
