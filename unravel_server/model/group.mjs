import mongoose from "mongoose";

const Schema = mongoose.Schema;

const groups = new Schema({
  name: {
    type: String,
    required: true,
  },
  group_admin: { type: Schema.Types.ObjectId, ref: "users" },
  created_date: Date,
  updated_date: Date,
  group_profile: String,
  description: String,
  followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  members: [{ type: Schema.Types.ObjectId, ref: "users" }],
  join_requirements: {
    min_user_followers: Number,
    agree_to_share_info: Boolean,
    min_user_rating: Number,
  },
});

export default mongoose.model("groups", groups);
