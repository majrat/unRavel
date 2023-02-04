import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

export default function EditProfile() {
  let navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profile_photo, setProfilePhoto] = useState("");

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
            setTwitter(req.data?.social_media?.twitter);
            setFacebook(req.data?.social_media?.facebook);
            setInstagram(req.data?.social_media?.instagram);
            setFirstName(req.data?.first_name);
            setLastName(req.data?.last_name);
            setBio(req.data?.bio);
            setProfilePhoto(req.data?.profile_photo);
          }
        }
      });
    } catch (err) {
      console.error("User might be logged out --" + err);
    }
  };

  const get_groups = async () => {
    await axios
      .get("http://localhost:8080/api/user/user_group_info")
      .then((res) => {
        if (res?.data) {
          setGroups(res?.data);
          console.log(res.data);
        } else {
          Swal.fire({
            title: "No trips found in the database",
            text: "No trips data found. Database empty",
            icon: "warning",
            allowOutsideClick: false,
            confirmButtonColor: "#3085d6",
          });
        }
      });
  };

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleTwitter = (e) => {
    setTwitter(e.target.value);
  };
  const handleFacebook = (e) => {
    setFacebook(e.target.value);
  };
  const handleInstagram = (e) => {
    setInstagram(e.target.value);
  };
  const handleBio = (e) => {
    setBio(e.target.value);
  };
  const handleProfilePhoto = (e) => {
    // setLogo(e.target.logo.files[0]);
    // console.log(...e.target.files);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const profileUpdate = async (e) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          // setProfilePhoto(e.target.logo.files[0]);

          e.preventDefault();
          // console.log(token);
          await axios
            .post("http://localhost:8080/api/user/update_user", {
              first_name,
              last_name,
              bio,
              twitter,
              facebook,
              instagram,
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // refreshPage();
              Swal.fire({
                icon: "success",
                title: res.data.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(navigate('/profile'))
              // console.log("success");
            })
            .catch((error) =>
              Swal.fire({
                icon: "error",
                title: error.response.data.error,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data,
        });
        console.log("error", err.response.data);
      }
    }
  };

  useEffect(() => {
    getUser();
    get_groups();
  }, []);
  return (
    <>
      <Navbar />
      <form
        className="md:m-24 mt-24 mx-2 grid grid-cols-12"
        onSubmit={profileUpdate}
      >
        <div className="p-4 md:col-span-4 col-span-12 relative bg-accentColor">
          <div className="flex justify-center relative">
            <img
              className="rounded-full w-32 h-40 object-cover m-6"
              src={user?.profile_photo || "/profile-setup.gif"}
              alt="user_profile"
            />
            <input
              type="file"
              name="profile_photo"
              className="absolute bottom-6 inset-x-1/2 file:rounded-full file:bg-primaryColor cursor-pointer text-truncate hover:file:bg-secondaryColor xl:w-44 w-20"
            />
          </div>
          <div className="text-center">
            <p className="text-lightColor font-semibold text-lg">
              {user?.first_name + " " + user?.last_name}
            </p>
            <p className="text-lightColor">
              {user?.location?.state + ", " + user?.location?.country}
            </p>
          </div>
          <p className="text-lg text-center text-lightColor mt-4">About me</p>
          <p className="text-secondaryColor text-center mx-3 mb-4">
            {user?.bio || "---"}
          </p>
          <div className="flex justify-evenly">
            <p className="text-lightColor m-3">
              <span className="font-light">Followers:</span>{" "}
              <span className="font-semibold text-lg">
                {user?.connections?.followers.length}
              </span>
            </p>
            <p className="text-lightColor m-3">
              <span className="font-light">Following:</span>{" "}
              <span className="font-semibold text-lg">
                {user?.connections?.following?.users.length}
              </span>
            </p>
          </div>
          <div className="m-4 mb-10">
            <div className="flex">
              <img
                className="cursor-pointer"
                src="/twitter-svgrepo-com.svg"
                alt="twitter"
              />
              <input
                className="h-8 ml-6 pl-3 self-center placeholder:text-secondaryColor text-secondaryColor bg-primaryColor/60 rounded w-full"
                type="text"
                name="twitter"
                placeholder="Add your twitter link here"
                value={twitter}
                onChange={handleTwitter}
              />
            </div>
            <div className="flex">
              <img
                className="my-3 cursor-pointer"
                src="/facebook-svgrepo-com.svg"
                alt="facebook"
              />
              <input
                className="h-8 ml-6 pl-3 self-center placeholder:text-secondaryColor text-secondaryColor bg-primaryColor/60 rounded w-full"
                type="text"
                name="facebook"
                placeholder="Add your facebook link here"
                value={facebook}
                onChange={handleFacebook}
              />
            </div>
            <div className="flex">
              <img
                className="cursor-pointer"
                src="/instagram-svgrepo-com.svg"
                alt="instagram"
              />
              <input
                className="h-8 ml-6 pl-3 self-center placeholder:text-secondaryColor text-secondaryColor bg-primaryColor/60 rounded w-full"
                type="text"
                name="instagram"
                placeholder="Add your instagram link here"
                value={instagram}
                onChange={handleInstagram}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-8 col-span-12 bg-primaryColor">
          <div className="flex justify-between m-3">
            <button
              className="text-lightColor bg-accentColor hover:bg-accentColor/80 hover:rounded-3xl transition-all rounded py-1 px-10 cursor-pointer"
              aria-hidden="true"
              type="submit"
            >
              Save
            </button>
            <Link to="/profile">
              <p
                className="text-lightColor bg-accentColor hover:bg-accentColor/80 hover:rounded-3xl transition-all rounded py-1 px-10 cursor-pointer"
                aria-hidden="true"
              >
                Cancel
              </p>
            </Link>
          </div>
          <div className="sm:m-8 m-4">
            <p className="flex m-5 justify-between">
              <span className="font-light">First Name: </span>{" "}
              <input
                className="font-semibold pl-4 h-12 sm:text-lg bg-accentColor/60 placeholder:text-secondaryColor text-secondaryColor rounded"
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                value={first_name}
                onChange={handleFirstName}
              />
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Last Name: </span>{" "}
              <input
                className="bg-accentColor/60 h-12 text-secondaryColor placeholder:text-secondaryColor rounded font-semibold pl-4 sm:text-lg"
                type="text"
                name="last_name"
                placeholder="Enter your first name"
                value={last_name}
                onChange={handleLastName}
              />
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Email:</span>{" "}
              <span className="text-gray-600 font-semibold sm:text-lg">
                {user?.email || "---"}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Location:</span>{" "}
              <span className="text-gray-600 font-semibold sm:text-lg">
                {user?.location?.city +
                  ", " +
                  user?.location?.state +
                  ", " +
                  user?.location?.country}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">About me:</span>{" "}
              <textarea
                className="bg-accentColor/60 text-secondaryColor h-16 placeholder:text-secondaryColor rounded w-full pl-4 font-semibold sm:text-lg truncate"
                type="text"
                name="bio"
                placeholder="Enter your bio"
                value={bio}
                onChange={handleBio}
              />
            </p>

            <div className="sm:m-5 m-2">
              <span className="font-light">Joined Groups:</span>{" "}
              <div className="overflow-y-scroll sm:h-52 h-72 shadow-inner rounded bg-accentColor/60 mt-5">
                {groups.map((group) => (
                  <div
                    key={group?._id}
                    className="sm:mx-9 mx-3 p-1 rounded-full flex bg-primaryColor mt-2"
                  >
                    <img
                      className="rounded-full h-16 self-center w-16"
                      src={group?.group_profile || "/profile-setup.gif"}
                      alt=""
                    />
                    <div className="w-24 sm:w-60 mx-3 self-center text-sm truncate">
                      <p className="font-semibold">{group?.name}</p>
                      <p className="mt-2">
                        <span className="font-semibold">
                          {group?.members.length}
                        </span>{" "}
                        <span className="text-xs">
                          {group?.members.length === 0 || 1
                            ? "member"
                            : "members"}
                        </span>
                      </p>
                    </div>
                    {/* <div className="w-28 sm:w-40 self-center text-sm truncate">
                      <p className="text-xs"></p>
                      <p className="mt-2">*****</p>
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="sm:m-5 m-2">
              <span className="font-light">Friends:</span>{" "}
              <div className="flex overflow-x-auto sm:h-24 w-full shadow-inner rounded bg-accentColor/60 mt-5">
                {groups.map((group) => (
                  <div className="mx-7 text-center">
                    <img
                      className="rounded-full mt-6 w-16"
                      src="/profile-setup.gif"
                      alt=""
                    />
                    <p className="mb-4 mt-2 w-11 text-xs truncate">name</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </form>
    </>
  );
}
