import express from "express";
import signupController from "../controller/signupController.mjs";
import userInfoController from "../controller/userInfoController.mjs";
import authenticate from "../middleware/authenticate.mjs";
import groupController from "../controller/groupController.mjs";
import locationController from "../controller/locationController.mjs";
import tripController from "../controller/tripController.mjs";

const router = express.Router();

router.get("/", authenticate, userInfoController.user_data);
router.get("/get_all_location", locationController.get_all_locations);
router.get("/user_group_info", authenticate, groupController.user_group_info);
router.get("/get_all_groups", groupController.get_all_groups);
router.get("/get_all_trips", tripController.get_all_trips);

router.post("/", signupController.sign_up);
router.post("/update_user", authenticate, userInfoController.update_user);
router.post("/verify_email", signupController.verify_email);
router.post("/create_group", authenticate, groupController.create_group);
router.post("/add_location", authenticate, locationController.add_location);
router.post("/create_new_trip", authenticate, tripController.create_new_trip);

export default router;
