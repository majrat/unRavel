import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/Home";
export default function AuthorizedRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage login={true} />} />
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
