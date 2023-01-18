import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebaseService from "../../services/firebase";
import { setAuthorized } from "../../features/authorizer/authorizerSlice";
import { Link } from "react-router-dom";
import Header from "./Header";

export default function SignInPage() {
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
      <Header />
      <main className="pt-32 text-center">
        {location.state && location.state.message ? (
          <p style={{ color: "green" }}>{location.state.message}</p>
        ) : null}
        <h1 className="font-bold text-3xl mb-5">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
          </div>
          <div>
            <input
              className="bg-emerald-300"
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="password">Password</label>
          </div>
          <div>
            <input
              className="bg-emerald-300"
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              required
            />
          </div>
          {error ? <p style={{ color: "red" }}>Error: {error}</p> : null}
          <div style={{ marginTop: "1rem" }}>
            <button className="bg-orange-500 p-2 rounded-lg mb-8" type="submit">
              Sign In
            </button>
          </div>
        </form>

        <Link className="bg-slate-300 rounded p-1 m-6" to="/signup">
          Create an Account
        </Link>
      </main>
    </>
  );
}
