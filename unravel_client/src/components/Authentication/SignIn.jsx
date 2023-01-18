import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import firebaseService from "../../services/firebase";
import { motion } from "framer-motion";
import { setAuthorized } from "../../features/authorizer/authorizerSlice";
import Header from "./Header";

export default function SignInPage(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        firebaseService.auth,
        fields.email,
        fields.password
      );
      if (user) {
        dispatch(setAuthorized());
        navigate("/");
        console.log("Called");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid email address or password.");
    }
  };

  return (
    <>
      <Header {...props} router={{ location }} />
      <motion.div
        className="p-24 justify-center flex"
        initial={{ x: "-100vw" }}
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
    </>
  );
}
