import tripsModel from "../model/trips.mjs";

export default {
  create_new_trip: (req, res) => {
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
      const user = req.user._id;

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
        created_by: user,
        participants: [user],
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
      const group_ids = await req.query.groupIds;
      const sort = { created_date: -1 };
      await tripsModel
        .find({ group_id: { $in: group_ids } })
        .populate("trip_location")
        .populate({ path: "group_id", populate: { path: "group_admin" } })
        .sort(sort)
        .then((all_trips) => {
          res.status(200).json(all_trips);
        })
        .catch((err) => {
          res.status(500).json({ error: `No trips found or ${err}` });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `No trips found or ${error}` });
    }
  },
  get_the_trip: async (req, res) => {
    try {
      const trip_id = await req.query.tripId;
      await tripsModel
        .findOne({ _id: trip_id })
        .populate("trip_location")
        .populate("created_by")
        .populate("participants")
        .populate({ path: "group_id", populate: { path: "group_admin" } })
        .then((the_trip) => {
          res.status(200).json(the_trip);
        })
        .catch((err) => {
          res.status(500).json({ error: `No trips found or ${err}` });
        });
    } catch (error) {
      res.status(500).json({ error: `No trips found or ${error}` });
    }
  },
  join_the_trip: async (req, res) => {
    try {
      const trip_id = await req.body.link_trip_id;
      const userId = req.user._id;

      await tripsModel
        .updateOne({ _id: trip_id }, { $addToSet: { participants: userId } })
        .then(() => {
          res.status(200).json({ success: "successfully joined the trip" });
        })
        .catch((err) => {
          res.status(500).json({ error: `No trips found or ${err}` });
        });
    } catch (error) {
      res.status(500).json({ error: `No trips found or ${error}` });
    }
  },

  get_user_trips: async (req, res) => {
    try {
      const userId = req.user._id;

      await tripsModel
        .find({ participants: userId })
        .populate("trip_location")
        .populate("created_by")
        .populate("participants")
        .populate({ path: "group_id", populate: { path: "group_admin" } })
        .then((the_trips) => {
          res.status(200).json(the_trips);
        })
        .catch((err) => {
          res.status(500).json({ error: `No trips found or ${err}` });
        });
    } catch (error) {
      res.status(500).json({ error: `No trips found or ${error}` });
    }
  },

  change_status: async (req, res) => {
    const tripStatus = req?.body?.tripStatus;
    const tripId = req?.body?.tripId;

    await tripsModel
      .updateOne({ _id: tripId }, { $set: { trip_status: tripStatus } })
      .then(
        res.status(200).json({ success: "successfully changed trip status" })
      )
      .catch((err) => {
        res.status(500).json({ error: `No trip found or ${err}` });
      });
  },
};
