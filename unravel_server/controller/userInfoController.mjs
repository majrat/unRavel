import userModel from "../model/user.mjs";

export default {
  user_data: async (req, res) => {
    // If authenticated send user data to client
    res.status(200).json(req.user);
  },
  update_user: async (req, res) => {
    console.log("reached update_user");

    const {
      // profile_photo,
      twitter,
      facebook,
      instagram,
      first_name,
      last_name,
      bio,
    } = req.body;

    const id = req.user._id;

    const user = await userModel.findOne({ _id: id });
    if (
      // profile_photo ||
      twitter === user?.social_media?.twitter &&
      facebook === user?.social_media?.facebook &&
      instagram === user?.social_media?.instagram &&
      first_name === user?.first_name &&
      last_name === user?.last_name &&
      bio === user?.bio
    ) {
      return res.status(400).json({
        error: "No Changes To Save",
      });
    } else {
      try {
        // const created_date = Date.now();
        await userModel
          .findByIdAndUpdate(
            { _id: id },
            {
              $set: {
                // profile_photo,
                "social_media.twitter": twitter,
                "social_media.facebook": facebook,
                "social_media.instagram": instagram,
                first_name,
                last_name,
                bio,
              },
            }
          )
          .then(() => {
            console.log("user data updated");
            return res
              .status(200)
              .json({ success: "User Updated successfully." });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Something went wrong. Please try again" });
          });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: "Server error. Please try again" });
      }
    }
  },
};
