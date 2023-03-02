import chatModel from "../model/chat.mjs";
import groupModel from "../model/group.mjs";

export default {
  create_group: (req, res) => {
    console.log("reached create group");

    const { grpName, grpDesc, token } = req.body;

    if (!grpName || !grpDesc || token) {
      return res.status(400).json({
        error: "Invalid request body. Must contain group name.",
      });
    }

    try {
      const created_date = Date.now();
      const group_admin = req.user._id;

      new groupModel({
        name: grpName,
        description: grpDesc,
        created_date,
        group_admin,
        members: [group_admin],
      })
        .save()
        .then(() => {
          console.log("new Group created");
          return res
            .status(200)
            .json({ success: "Group created successfully." });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Something went wrong. Please try again", err });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error. Please try again" });
    }
  },

  user_group_info: async (req, res) => {
    await groupModel
      .find({ members: req.user._id })
      .populate({ path: "members" })
      .populate("group_admin")
      .then((all_group) => {
        res.status(200).json(all_group);
      })
      .catch((err) => {
        res
          .status(500)
          .json(
            `whether user is not in any group or something else gone wrong ${err}`
          );
      });
  },
  get_all_groups: async (req, res) => {
    console.log("getting all groups...");
    await groupModel
      .find()
      .then((all_groups) => {
        res.status(200).json(all_groups);
      })
      .catch((err) => {
        res.status(500).json(`No groups found or ${err}`);
      });
  },
  edit_group_page: async (req, res) => {
    console.log("Getting group data for edit...");

    // const updated_date = Date.now();
    const userId = req?.user?._id;
    const groupId = req?.query?.link_group_id;
    console.log("dasssssss");
    await groupModel
      .findOne({ _id: groupId, group_admin: userId })
      .populate({ path: "members" })
      .then((group) => {
        res.status(200).json(group);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(`No groups found or ${err}`);
      });
  },

  save_group_edit: async (req, res) => {
    console.log("Getting group data for edit...");

    // const updated_date = Date.now();
    const userId = req?.user?._id;
    const groupId = req?.body?.link_group_id?.link_group_id;
    const name = req?.body?.name;
    const description = req?.body?.description;
    const group_profile = req?.body?.groupProfile;
    console.log("userId---", userId, "----description", description);

    const group = await groupModel.findOne({ _id: groupId });
    if (
      group_profile === group?.profile_photo &&
      name === group?.name &&
      description === group?.description
    ) {
      return res.status(400).json({
        error: "No Changes To Save",
      });
    } else {
      await groupModel
        .updateOne(
          { _id: groupId, group_admin: userId },
          { $set: { name, description, group_profile } }
        )
        .then((group) => {
          res.status(200).json(group);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: `No groups found or ${err}` });
        });
    }
  },

  get_group: async (req, res) => {
    const groupId = req?.query?.link_group_id;
    await groupModel
      .findOne({ _id: groupId })
      .populate({ path: "members" })
      .then((group) => {
        res.status(200).json(group);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(`No groups found or ${err}`);
      });
  },
  groupChat: async (req, res) => {
    try {
      const groupId = req?.query?.groupId;
      await chatModel
        .findOne({ groupId })
        .populate({ path: "messages.from" })
        .then((chats) => {
          res.status(200).json(chats);
        });
    } catch (e) {
      res.status(500).json(`No groups found or ${e.message}`);
    }
  },
};
