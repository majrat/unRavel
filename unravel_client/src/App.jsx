import "./App.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import unravel_loading from "/unravel_loading.gif";
import UnauthorizedRoutes from "./router/UnauthorizeRoutes";
import AuthorizedRoutes from "./router/AuthorizedRoutes";
import firebaseService from "./services/firebase";
import {
  setAuthorized,
  setUnauthorized,
} from "./features/authorizer/authorizerSlice";

function App() {
  const [loading, setLoading] = useState(true);

  const authorized = useSelector((state) => state.authorizer.authorized);
  const dispatch = useDispatch();

  const authStateListener = () => {
    firebaseService.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return dispatch(setUnauthorized());
      }

      setLoading(false);
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
