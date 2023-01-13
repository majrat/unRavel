import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import HomePage from "../components/pages/Home";
import Banner from "../components/Banner/Banner";
export default function AuthorizedRoutes() {
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
        <Route
          path="*"
          element={
            <main className="p-40">
              <h1>Not found.</h1>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}
