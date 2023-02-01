import tripsModel from "../model/trips.mjs";

export default {
  create_new_trip: (req, res) => {
    console.log("reached");
    console.log(req.user);

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

    console.log(req.body);

    if (!group_id || !trip_location) {
      return res.status(400).json({
        error: "Invalid request body. Must contain group and location info.",
      });
    }

    try {
      const created_date = Date.now();
      //   const group_admin = req.user._id;

      //   const group_id = groupModel.findOne({ group_admin });

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
          console.log(err);
          return res
            .status(500)
            .json({ error: "Something went wrong. Please try again" });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error. Please try again" });
    }
  },
  get_all_trips: async (req, res) => {
    console.log("inside get_all_trips");
    const all_trips = await tripsModel
      .find()
      .populate("trip_location")
      .populate({ path: "group_id", populate: { path: "group_admin" } });

    console.log(all_trips);
    res.status(200).json(all_trips);
  },
};
