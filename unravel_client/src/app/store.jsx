import { configureStore } from "@reduxjs/toolkit";
import authorizerReducer from "../features/authorizer/authorizerSlice";
import searchReducer from "../features/showSearch/showSearchSlice";
import currentUserReducer from "../features/currentUser/currentUserSlice";
import timerActivatorReducer from "../features/timerAvtivator/timerActivatorSlice";

export default configureStore({
  reducer: {
    authorizer: authorizerReducer,
    search: searchReducer,
    timerActivator: timerActivatorReducer,
    currentUser: currentUserReducer,
  },
});
