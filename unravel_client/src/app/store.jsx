import { configureStore } from "@reduxjs/toolkit";
import authorizerReducer from "../features/authorizer/authorizerSlice";
import currentUserReducer from "../features/currentUser/currentUserSlice";
import timerActivatorReducer from "../features/timerAvtivator/timerActivatorSlice";

export default configureStore({
  reducer: {
    authorizer: authorizerReducer,
    timerActivator: timerActivatorReducer,
    currentUser: currentUserReducer,
  },
});
