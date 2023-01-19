import express from "express";
import authenticate from "../middleware/authenticate.mjs";
import firebaseAdmin from "../services/firebase.mjs";
import userModel from "../models/user.mjs";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

router.post("/", async (req, res) => {
  const { email, name, username, password, country, state, city } = req.body;
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
    // const newFirebaseUser = await firebaseAdmin.auth.createUser({
    //   email,
    //   password,
    // });

    const created_date = Date.now();

    if (newFirebaseUser) {
      const newUser = new userModel({
        email,
        name,
        username,
        "location.country": country,
        "location.state": state,
        "location.city": city,
        firebase_id: newFirebaseUser.uid,
        created_date,
      });
      newUser.save().then(console.log("New user created"));
    }
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

export default router;
