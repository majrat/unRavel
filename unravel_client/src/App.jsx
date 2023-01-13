import "./App.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UnauthorizedRoutes from "./routes/UnauthorizeRoutes";
import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import firebaseService from "./services/firebase";
import {
  setAuthorized,
  setUnauthorized,
} from "./features/authorizer/authorizerSlice";

function App() {
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState();

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
        <p>Loading...</p>
      ) : authorized ? (
        <AuthorizedRoutes />
      ) : (
        <UnauthorizedRoutes />
      )}
    </div>
  );
}

export default App;
