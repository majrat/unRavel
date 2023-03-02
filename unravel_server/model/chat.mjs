import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chats = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: "groups" },
  messages: [
    {
      message: String,
      timestamp: Date,
      from: { type: Schema.Types.ObjectId, ref: "users" },
    },
  ],
});

export default mongoose.model("chats", chats);
