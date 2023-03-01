import express from "express";
import signupController from "../controller/signupController.mjs";
import userController from "../controller/userController.mjs";
import authenticate from "../middleware/authenticate.mjs";
import groupController from "../controller/groupController.mjs";
import locationController from "../controller/locationController.mjs";
import tripController from "../controller/tripController.mjs";

const router = express.Router();

router.get("/", authenticate, userController.user_data);
router.get("/get_all_location", locationController.get_all_locations);
router.get("/user_group_info", authenticate, groupController.user_group_info);
router.get("/get_all_groups", groupController.get_all_groups);
router.get("/get_all_trips", tripController.get_all_trips);
router.get("/get_the_trip", tripController.get_the_trip);
router.get("/get_user_trips", authenticate, tripController.get_user_trips);
router.get("/get_group", groupController.get_group);
router.get("/chats", groupController.groupChat);

router.post("/", signupController.sign_up);
router.post("/update_user", authenticate, userController.update_user);
router.post("/verify_email", signupController.verify_email);
router.post("/create_group", authenticate, groupController.create_group);
router.post("/add_location", authenticate, locationController.add_location);
router.post("/create_new_trip", authenticate, tripController.create_new_trip);

router.patch("/join/group", authenticate, userController.join_group);
router.patch("/join/trip", authenticate, tripController.join_the_trip);
router.patch("/change/trip/status", authenticate, tripController.change_status);

router
  .route("/group")
  .get(authenticate, groupController.edit_group_page)
  .patch(authenticate, groupController.save_group_edit);
router
  .route("/follow/group")
  .patch(authenticate, userController.follow_group)
  .delete(authenticate, userController.unfollow_group);

export default router;
