import { configureStore } from "@reduxjs/toolkit";
import authorizerReducer from "../features/authorizer/authorizerSlice";

export default configureStore({
  reducer: { authorizer: authorizerReducer },
});
