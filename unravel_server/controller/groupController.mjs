import groupModel from "../model/group.mjs";

export default {
  create_group: (req, res) => {
    console.log("reached");
    console.log(req.user);

    const { grpName, grpDesc, token } = req.body;

    console.log(grpName);
    console.log(grpDesc);

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

  user_group_info: async (req, res) => {
    await groupModel
      .find()
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
