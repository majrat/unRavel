import mongoose from "mongoose";

const Schema = mongoose.Schema;

const user = new Schema({
  name: String,
  password: String,
  user_email: {
    email: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  firebaseId: String,
});

export default mongoose.model("user", user);
