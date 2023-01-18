import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/Home";
import Error404 from "../components/pages/404";
import SignInPage from "../components/Authentication/SignIn";
// import SignUpPage from "../components/Authentication/SignUp";
import FirstStep from "../components/Authentication/FirstStep";
import SecondStep from "../components/Authentication/SecondStep";
import ThirdStep from "../components/Authentication/ThirdStep";
import { useState } from "react";

export default function UnauthorizedRoutes(props) {
  const [user, setUser] = useState({});

  const updateUser = (data) => {
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };

  const resetUser = () => {
    setUser({});
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage login={false} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/signup/1"
          element={<FirstStep {...props} user={user} updateUser={updateUser} />}
        />
        <Route
          path="/signup/2"
          element={
            <SecondStep {...props} user={user} updateUser={updateUser} />
          }
        />
        <Route
          path="/signup/3"
          element={
            <ThirdStep
              {...props}
              user={user}
              updateUser={updateUser}
              resetUser={resetUser}
            />
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}
