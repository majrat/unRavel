import groupModel from "../model/group.mjs";
import userModel from "../model/user.mjs";

export default {
  user_data: async (req, res) => {
    // If authenticated send user data to client
    res.status(200).json(req.user);
  },
  update_user: async (req, res) => {
    console.log("reached update_user");
    // console.log(req.body);
    const {
      profile_photo,
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
      profile_photo === user?.profile_photo &&
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
                profile_photo,
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
            return res
              .status(500)
              .json({ error: `Something went wrong. ${err} Please try again` });
          });
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Server error. ${error}, Please try again` });
      }
    }
  },

  join_group: async (req, res) => {
    console.log("joining new group...");
    const userId = req.user._id;
    console.log(userId);
    const groupId = req?.body?.link_group_id;
    console.log(groupId);

    await groupModel
      .updateOne({ _id: groupId }, { $addToSet: { members: userId } })
      .then(res.status(200).json({ success: "successfully joined the group" }))
      .catch((err) => {
        res.status(500).json({ error: `No groups found or ${err}` });
      });
  },

  exit_group: async (req, res) => {
    console.log("joining new group...");
    const userId = req.user._id;
    console.log(userId);
    const groupId = req?.body?.link_group_id?.link_group_id;
    console.log(groupId);

    await groupModel
      .updateOne({ _id: groupId }, { $pull: { members: userId } })
      .then(res.status(200).json({ success: "successfully joined the group" }))
      .catch((err) => {
        res.status(500).json({ error: `No groups found or ${err}` });
      });
  },

  follow_group: async (req, res) => {
    const userId = req.user._id;
    const groupId = req?.body?.selectedGroupId;
    // console.log(
    //   "Following a group..." , "userId---" , userId , "-------groupId" , groupId
    // );

    await userModel
      .updateOne(
        { _id: userId },
        { $addToSet: { "connections.following.groups": groupId } }
      )
      .then(async () => {
        await groupModel.updateOne(
          { _id: groupId },
          { $addToSet: { followers: userId } }
        );
      })
      .then(res.status(200).json({ success: "followed group" }))
      .catch((err) => {
        res.status(500).json({ error: `No such group found or ${err}` });
      });
  },

  unfollow_group: async (req, res) => {
    const userId = req.user._id;
    const groupId = req?.body?.groupId;

    console.log(
      "UnFollowing a group...",
      "userId---",
      userId,
      "-------groupId",
      groupId
    );

    await userModel
      .updateOne(
        { _id: userId },
        { $pull: { "connections.following.groups": groupId } }
      )
      .then(async () => {
        await groupModel.updateOne(
          { _id: groupId },
          { $pull: { followers: userId } }
        );
      })
      .then(() => res.status(200).json({ success: "unfollowed group" }))
      .catch((err) => {
        res.status(500).json({ error: `No such group found or ${err}` });
      });
  },
};
