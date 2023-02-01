import mongoose from "mongoose";

const Schema = mongoose.Schema;

const users = new Schema({
  firebase_id: String,
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  age: Number,
  gender: String,
  phone_no: Number,
  location: {
    country: {
      type: String,
      required: true,
    },
    state: String,
    city: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
        throw new Error("Email is not valid.");
      }
    },
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  profile_photo: String,
  bio: String,
  social_media: {
    twitter: String,
    instagram: String,
    facebook: String,
  },
  connections: {
    following: {
      users: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
      },
      groups: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
      },
    },
    followers: {
      users: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
      },
    },
    friends: {
      users: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
      },
    },
  },
  created_date: Date,
});

export default mongoose.model("users", users);
