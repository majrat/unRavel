import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chats = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: "groups" },
  messages: [
    {
      message: String,
      from: { type: Schema.Types.ObjectId, ref: "users" },
    },
  ],
});

export default mongoose.model("chats", chats);
