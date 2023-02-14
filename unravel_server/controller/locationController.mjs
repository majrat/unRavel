import locationModel from "../model/location.mjs";
import { createClient } from "pexels";
import config from "../config/index.mjs";

export default {
  add_location: async (req, res) => {
    const { spot, country, city, state } = req.body;

    if (!spot || !country) {
      return res.status(400).json({
        error: "Invalid request body. Must contain spot and country.",
      });
    }

    try {
      const client = createClient(config.PEXELS_API);
      const query = spot;
      const photos = await client.photos.search({ query, per_page: 10 });
      console.log(photos);
      const created_date = Date.now();
      const user = req.user._id;

      new locationModel({
        address: {
          city,
          country,
          spot,
          state,
        },
        created_date,
        location_added_by: user,
        images: photos,
      })
        .save()
        .then(() => {
          console.log("new Location Added");
          return res
            .status(200)
            .json({ success: "Location added successfully." });
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

  get_all_locations: async (req, res) => {
    console.log("inside get-all-loc");
    const all_locations = await locationModel.find();
    res.status(200).json(all_locations);
  },
};
