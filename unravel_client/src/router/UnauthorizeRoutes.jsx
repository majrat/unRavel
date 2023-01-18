import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/Home";
import SignInPage from "../components/Authentication/SignIn";
// import SignUpPage from "../components/Authentication/SignUp";
import FirstStep from "../components/Authentication/FirstStep";
import SecondStep from "../components/Authentication/SecondStep";
import ThirdStep from "../components/Authentication/ThirdStep";

export default function UnauthorizedRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage login={false} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup/1" element={<FirstStep />} />
        <Route path="/signup/2" element={<SecondStep />} />
        <Route path="/signup/3" element={<ThirdStep />} />
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
