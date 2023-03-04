import mongoose from "mongoose";

const Schema = mongoose.Schema;

const locations = new Schema({
  latitude: Number,
  longitude: Number,
  time_zone: String,
  images: Object,
  address: {
    spot: String,
    city: String,
    state: String,
    country: String,
  },
  created_date: Date,
  posted_by: { type: Schema.Types.ObjectId, ref: "users" },
  location_added_by: { type: Schema.Types.ObjectId, ref: "users" },
});

export default mongoose.model("locations", locations);
