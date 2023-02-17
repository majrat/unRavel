import mongoose from "mongoose";

const Schema = mongoose.Schema;

const trips = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: "groups" },
  trip_location: { type: Schema.Types.ObjectId, ref: "locations" },
  expected_expense: {
    type: String,
    default: "Unknown",
  },
  starting_data: Date,
  ending_date: Date,
  created_date: Date,
  trip_type: {
    type: String,
    default: "Not Specified",
  },
  trip_status: {
    type: String,
    default: "waiting for members",
  },
  mode_of_travel: {
    type: String,
    default: "Not Specified",
  },
  stay: {
    type: String,
    default: "Not Specified",
  },
  food: {
    type: String,
    default: "Not Specified",
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "users" }],
  created_by: { type: Schema.Types.ObjectId, ref: "users" },
  other_details: String,
});

export default mongoose.model("trips", trips);
