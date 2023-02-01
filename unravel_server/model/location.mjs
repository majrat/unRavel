import mongoose from "mongoose";

const Schema = mongoose.Schema;

const locations = new Schema({
  latitude: Number,
  longitude: Number,
  time_zone: String,
  images: [String],
  address: {
    spot: String,
    city: String,
    state: String,
    country: String,
  },
  created_date: Date,
  location_added_by: Schema.Types.ObjectId,
});

export default mongoose.model("locations", locations);
