import unravel_logo from "/unravel.svg";
import { useEffect, useState } from "react";
import firebaseService from "../../services/firebase";
import axios from "axios";

export default function Navbar() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const token = await firebaseService.auth.currentUser.getIdToken(true);
      console.log(token);
      const req = await axios.get("http://localhost:8080/api/user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(req.data);
      if (req.data) {
        setUser(req.data);
        setLoadingUser(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="my-navbar-color bg-white bg-opacity-30 backdrop-blur z-10 text-black font-bold px-6 py-3 mb-2 shadow-lg rounded flex top-0 justify-between fixed w-full overflow-hidden">
        <p>Search</p>
        <p>Shop</p>
        <p>Locations</p>
        <img src={unravel_logo} alt="unRavel" className="h-9" />
        <p>Create</p>
        <p>Favourites</p>
        {loadingUser ? <p>Login/SignUp</p> : <p>Name: {user.name}</p>}
      </div>
    </>
  );
}
