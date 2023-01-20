import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../components/pages/Home";
import Error404 from "../components/pages/404";

export default function AuthorizedRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/signin" element={<Navigate replace to="/" />} />
        <Route path="/signup/1" element={<Navigate replace to="/" />} />
        <Route path="/signup/2" element={<Navigate replace to="/" />} />
        <Route path="/signup/3" element={<Navigate replace to="/" />} />
        <Route path="/verify_email" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}
