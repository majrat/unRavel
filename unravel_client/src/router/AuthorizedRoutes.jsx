import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import HomePage from '../components/pages/Home'
import Error404 from '../components/pages/404'
import NewLocation from '../components/Create/NewLocation'
import NewGroup from '../components/Create/NewGroup'

export default function AuthorizedRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/add/location" element={<NewLocation />} />
        <Route path="/create/group" element={<NewGroup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/signin" element={<Navigate replace to="/" />} />
        <Route path="/signup/1" element={<Navigate replace to="/" />} />
        <Route path="/signup/2" element={<Navigate replace to="/" />} />
        <Route path="/signup/3" element={<Navigate replace to="/" />} />
        <Route path="/verify_email" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}
