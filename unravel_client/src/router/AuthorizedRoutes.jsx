import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../components/HomePage/HomePage";
import Error404 from "../components/pages/404";
import NewLocation from "../components/Create/NewLocation";
import NewGroup from "../components/Create/NewGroup";
import NewTrip from "../components/Create/NewTrip/GetInput";
import LocationsPage from "../components/pages/Locations";
import UserProfile from "../components/pages/UserProfile/UserProfile";
import EditProfile from "../components/pages/UserProfile/EditProfile";
import UserGroup from "../components/pages/Groups/UserGroup";
import Group from "../components/pages/Groups/Group";
import EditGroup from "../components/pages/Groups/EditGroup";
import Trips from "../components/pages/Trips/Trips";
import UserTrips from "../components/pages/Trips/Usertrips";
import ChatPage from "../components/GroupChat/ChatPage";
import Navbar from "../components/Navbar/Navbar";

export default function AuthorizedRoutes({ user }) {
  return (
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/chat" element={<ChatPage user={user} />} />
          <Route path="/user/trips" element={<UserTrips user={user} />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/group" element={<Group user={user} />} />
          <Route path="/user/group" element={<UserGroup user={user} />} />
          <Route path="/user/edit/group" element={<EditGroup />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/edit/profile" element={<EditProfile user={user} />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/add/location" element={<NewLocation />} />
          <Route path="/create/group" element={<NewGroup />} />
          <Route path="/create/trip" element={<NewTrip user={user} />} />
          <Route path="/" element={<HomePage user={user} />} />
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
