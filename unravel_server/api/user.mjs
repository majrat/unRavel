import express from "express";
import signupController from "../controller/signupController.mjs";
import userInfoController from "../controller/userInfoController.mjs";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

router.get("/", authenticate, userInfoController.user_data);

router.post("/", signupController.sign_up);
router.post("/verify_email", signupController.verify_email);

export default router;
