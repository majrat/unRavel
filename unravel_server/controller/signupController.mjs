import userModel from "../model/user.mjs";

export default {
  sign_up: (req, res) => {
    const { email, first_name, last_name, password, country, state, city, uid } =
      req.body;
    if (
      !email ||
      !first_name ||
      !password ||
      !last_name ||
      !country ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        error:
          "Invalid request body. Must contain email, password, and name for user.",
      });
    }

    try {
      // Save user info to mongoDB with email_verified set to false by default

      const created_date = Date.now();
      new userModel({
        email,
        first_name,
        last_name,
        "location.country": country,
        "location.state": state,
        "location.city": city,
        firebase_id: uid,
        created_date,
      })
        .save()
        .then(console.log("New user Created"));

      return res
        .status(200)
        .json({ success: "Account created successfully. Please sign in." });
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        return res
          .status(400)
          .json({ error: "User account already exists at email address." });
      }
      return res.status(500).json({ error: "Server error. Please try again" });
    }
  },

  // -------------------------------------------------------------------------------

  verify_email: async (req, res) => {
    // Get firebase user UID from the client SDK

    const { userUid } = req.body;
    if (!userUid) {
      console.log("Invalid request body. Must contain uid.");
      return res.status(400).json({
        error: "Invalid request body. Must contain uid.",
      });
    }
    try {
      // If firebase user UID recieved, then set email_verified to true in MongoDB

      await userModel.updateOne(
        { firebase_id: userUid },
        { $set: { email_verified: true } }
      );
    } catch (error) {
      return res.status(500).json({ error: `Server error, ${error}, Please try again` });
    }
  },
};
