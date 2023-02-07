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
};
