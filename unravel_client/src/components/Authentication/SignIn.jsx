// IMPORTS ------------------------------------------
import { useDispatch } from "react-redux";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { motion } from "framer-motion";
import { setAuthorized } from "../../features/authorizer/authorizerSlice";
import Header from "./Header";
import { setTimerActivatorOn } from "../../features/timerAvtivator/timerActivatorSlice";
// --------------------------------------------------

export default function SignInPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // =================================================
  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, fields.email, fields.password)
        .then(() => {
          if (!auth.currentUser.emailVerified) {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                dispatch(setTimerActivatorOn());
                navigate("/verify_email");
              })
              .catch((err) => alert(err.message));
          } else {
            dispatch(setAuthorized());
            navigate("/");
          }
        })
        .catch((err) => setError(err.message));
    } catch (err) {
      console.log(err);
      setError("Invalid email address or password.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="col-span-5 justify-center items-center flex flex-col"
        >
          <img className="w-36" src="/unravel.svg" alt="icon_img" />
          <p className="text-gray-700">Join the community</p>
          <p className="text-gray-700">Explore the world together</p>
          <img className="w-96" src="/undraw_navigator_a479.svg" alt="bg_img" />
        </motion.div>
        <div className="col-span-7">
          <Header {...props} router={{ location }} />
          <motion.div
            className="p-24 justify-center flex"
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ stiffness: 100 }}
          >
            <main>
              {location.state && location.state.message ? (
                <p style={{ color: "green" }}>{location.state.message}</p>
              ) : null}
              <form onSubmit={handleSubmit}>
                <div className="group relative">
                  <div>
                    <label className="absolute form--label" htmlFor="email">
                      Email Address
                    </label>
                  </div>
                  <div>
                    <input
                      className="form--input"
                      type="email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="group relative mt-6">
                  <div style={{ marginTop: "1rem" }}>
                    <label className="absolute form--label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div>
                    <input
                      className="form--input"
                      type="password"
                      name="password"
                      value={fields.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {error ? <p style={{ color: "red" }}>Error: {error}</p> : null}
                <div className="flex justify-between mt-4">
                  <div>
                    <button className="btn btn--primary" type="submit">
                      Sign In
                    </button>
                  </div>
                  <Link className="btn btn--secondary" to="/signup/1">
                    Create an Account
                  </Link>
                </div>
              </form>
            </main>
          </motion.div>
        </div>
      </div>
      {/* Waves Container */}
      <div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#c19892" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#d8d7d7" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#bebfbd" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f3f1ef" />
          </g>
        </svg>
      </div>
      {/* Waves end */}
    </>
  );
}
