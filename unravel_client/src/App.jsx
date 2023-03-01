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
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import config from "./utils/constants";

function App() {
  const [loading, setLoading] = useState(true);
  const authorized = useSelector((state) => state.authorizer.authorized);
  const dispatch = useDispatch();
  const [user, setUser] = useState("");

  const getUser = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          const req = await axios
            .get(config.VITE_SERVER_API, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .catch(function (error) {
              if (error?.response) {
                Swal.fire({
                  icon: "error",
                  title: error?.response.data,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            });
          if (req?.data) {
            setUser(req?.data);
          }
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User might be logged out --" + err,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const authStateListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        console.log("==================Unauthorized=============");
        setLoading(false);
        return dispatch(setUnauthorized());
      }
      console.log("==================Authorized=============");
      setLoading(false);
      return dispatch(setAuthorized());
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    authStateListener();
  }, [authStateListener]);

  return (
    <div>
      {loading ? (
        <div className="circle-ripple unravel_loading"></div>
      ) : authorized ? (
        <AuthorizedRoutes user={user} />
      ) : (
        <UnauthorizedRoutes />
      )}
    </div>
  );
}

export default App;
