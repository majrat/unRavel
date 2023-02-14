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
import LoginWave from "./Loginwave";
import Swal from "sweetalert2";
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
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: err.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              });
          } else {
            dispatch(setAuthorized());
            navigate("/");
          }
        })
        .catch((err) => setError(err.message));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err,
        showConfirmButton: false,
        timer: 1500,
      });
      setError("Invalid email address or password.");
    }
  };

  return (
    <>
      <div className="sm:grid flex flex-col-reverse sm:flex-none sm:grid-cols-12">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="sm:col-span-5 col-span-12 mt-11 justify-center items-center flex flex-col"
        >
          <Link className="items-center nav-btn flex flex-col cursor-pointer" to="/">
            <img
              className="sm:w-36 hover:shadow-lg rounded-lg transition-all"
              src="/unravel.svg"
              alt="icon_img"
            />
          </Link>
          <p className="text-gray-700">Join the community</p>
          <p className="text-gray-700">Explore the world together</p>
          <img
            className="sm:w-96"
            src="/undraw_navigator_a479.svg"
            alt="bg_img"
          />
        </motion.div>
        <div className="sm:col-span-7 col-span-12">
          <Header {...props} router={{ location }} />
          <motion.div
            className="sm:p-24 justify-center flex"
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
                      className="form--input sm:mr-56"
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
                      className="form--input sm:mr-56"
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
      <LoginWave />
    </>
  );
}
