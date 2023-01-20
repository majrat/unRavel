import unravel_logo from "/unravel.svg";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIdToken, onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const authorized = useSelector((state) => state.authorizer.authorized);
  const [user, setUser] = useState("");

  const getUser = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          const req = await axios
            .get("http://localhost:8080/api/user", {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              }
            });
          if (req.data) {
            setUser(req.data);
          }
        }
      });
    } catch (err) {
      console.error("User might be logged out --" + err);
    }
  };

  const logUserOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="my-navbar-color bg-white bg-opacity-80 backdrop-blur z-10 text-black font-bold px-6 py-3 mb-2 shadow-lg rounded flex top-0 justify-between fixed w-full overflow-hidden">
        <Link to="/">
          <img src={unravel_logo} alt="unRavel" className="h-9" />
        </Link>
        <p>Search</p>
        <p>Shop</p>
        <p>Locations</p>
        <p>Create</p>
        <p>Favourites</p>
        {authorized ? (
          <>
            <p>{user.name}</p> <p onClick={logUserOut}>LogOut</p>
          </>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </>
  );
}
