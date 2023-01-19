import "./App.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UnauthorizedRoutes from "./router/UnauthorizeRoutes";
import AuthorizedRoutes from "./router/AuthorizedRoutes";
import { auth } from "./services/firebase";
import {
  setAuthorized,
  setUnauthorized,
} from "./features/authorizer/authorizerSlice";
import { onAuthStateChanged } from "firebase/auth";
import { setCurrentUserInfo } from "./features/currentUser/currentUserSlice";

function App() {
  const [loading, setLoading] = useState(true);

  const authorized = useSelector((state) => state.authorizer.authorized);
  const currentUser = useSelector((state) => state.currentUser.currentUserInfo);

  const dispatch = useDispatch();

  const authStateListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (!user || !currentUser?.emailVerified) {
        setLoading(false);
        return dispatch(setUnauthorized());
      }
      setLoading(false);
      dispatch(setCurrentUserInfo(user))
      return dispatch(setAuthorized());
    });
  };

  useEffect(() => {
    authStateListener();
  }, [authStateListener]);

  return (
    <div>
      {loading ? (
        <div className="circle-ripple unravel_loading"></div>
      ) : authorized ? (
        <AuthorizedRoutes />
      ) : (
        <UnauthorizedRoutes />
      )}
    </div>
  );
}

export default App;
