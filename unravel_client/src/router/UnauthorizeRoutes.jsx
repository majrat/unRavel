import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../components/pages/Home";
import VerifyEmailPage from "../components/Authentication/VerifyEmail";
import Error404 from "../components/pages/404";
import SignInPage from "../components/Authentication/SignIn";
import FirstStep from "../components/Authentication/FirstStep";
import SecondStep from "../components/Authentication/SecondStep";
import ThirdStep from "../components/Authentication/ThirdStep";
import { useState } from "react";
import LocationsPage from "../components/pages/Locations";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/verify_email" element={<VerifyEmailPage />} />
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
        <Route
          path="/add/location"
          element={<Navigate replace to="/signin" />}
        />
        <Route
          path="/create/group"
          element={<Navigate replace to="/signin" />}
        />
        <Route
          path="/create/trip"
          element={<Navigate replace to="/signin" />}
        />
        <Route path="/profile" element={<Navigate replace to="/signin" />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>      
  );
}
