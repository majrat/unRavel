import tripsModel from "../model/trips.mjs";
import { createClient } from "pexels";

export default {
  create_new_trip: (req, res) => {
    console.log("reached created new trip");

    const {
      date,
      group_id,
      trip_location,
      trip_type,
      travel_mode,
      stay,
      food,
      expected_expense,
      other_details,
    } = req.body;

    if (!group_id || !trip_location) {
      return res.status(400).json({
        error: "Invalid request body. Must contain group and location info.",
      });
    }

    try {
      const created_date = Date.now();

      new tripsModel({
        group_id,
        created_date,
        expected_expense,
        food,
        mode_of_travel: travel_mode,
        stay,
        trip_type,
        starting_data: date,
        other_details,
        trip_location,
      })
        .save()
        .then(() => {
          console.log("new trip created");
          return res
            .status(200)
            .json({ success: "Trip created successfully." });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: `Something went wrong, ${err}, Please try again` });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Server error.${error}, Please try again` });
    }
  },
  get_all_trips: async (req, res) => {
    try {
      const client = createClient(
        "O3jlUZw7ePHeUxBEMnOEfCW9nomV6q98my9bTkzzrfc7dXsmORBhG9QA"
      );
      const query = "taj mahal";
      client.photos
        .search({ query, per_page: 1 })
        .then((photos) => console.log(photos));

      console.log("inside get_all_trips");
      const group_ids = await req.query.groupIds;
      await tripsModel
        .find({ group_id: { $in: group_ids } })
        .populate("trip_location")
        .populate({ path: "group_id", populate: { path: "group_admin" } })
        .then((all_trips) => {
          res.status(200).json(all_trips);
        })
        .catch((err) => {
          res.status(500).json(`No trips found or ${err}`);
        });
    } catch (error) {
      res.status(500).json(`No trips found or ${error}`);
    }
  },
};
