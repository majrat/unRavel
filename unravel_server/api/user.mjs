import express from "express";
import authenticate from "../middleware/authenticate.mjs";
import userModel from "../models/user.mjs";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

router.post("/", async (req, res) => {
  const { email, name, username, password, country, state, city, uid } =
    req.body;
  console.log("req.body", req.body);
  if (
    !email ||
    !name ||
    !password ||
    !username ||
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
    const created_date = Date.now();
    new userModel({
      email,
      name,
      username,
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
});

router.post("/verify_email", async (req, res) => {
  const { userUid } = req.body;
  console.log("userUid ===> "+userUid);
  if (!userUid) {
    console.log("Invalid request body. Must contain uid.");
    return res.status(400).json({
      error: "Invalid request body. Must contain uid.",
    });
  }
  try {
    console.log("Inside post(/verify_email) ======>>>");
    await userModel.updateOne(
      { firebase_id: userUid },
      { $set: { email_verified: true } }
    );
  } catch (error) {
    console.log(error);
  }
});

export default router;
