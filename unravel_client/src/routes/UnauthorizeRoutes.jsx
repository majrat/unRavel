import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "../components/Banner/Banner";
import Navbar from "../components/Navbar/Navbar";
import HomePage from "../components/pages/Home";
import SignInPage from "../components/pages/SignIn";
import SignUpPage from "../components/pages/SignUp";

export default function UnauthorizedRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="pt-14">
              <HomePage />
              <Banner />
            </div>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="*"
          element={
            <main>
              <p>Not found.</p>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}
