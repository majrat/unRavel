import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AuthorizedNav from "../components/navigation/AuthorizedNav";
import DashboardPage from "../components/pages/Dashboard";

export default function AuthorizedRoutes() {
  return (
    <Router>
      <AuthorizedNav />
      <Routes>
        <Route path="/" element={<Navbar />} />
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
