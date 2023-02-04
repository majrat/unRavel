import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

export default function UserProfile() {
  const [groups, setGroups] = useState([]);
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

  console.log(groups);

  useEffect(() => {
    getUser();
    get_groups();
  }, []);
  return (
    <>
      <Navbar />
      <div className="md:m-24 mt-24 mx-2 grid grid-cols-12">
        <div className="p-4 md:col-span-4 col-span-12 relative bg-accentColor">
          <div className="flex justify-center">
            {user?.profile_photo ? (
              <img
                className="rounded-full w-32 h-40 object-cover m-6"
                src={user?.profile_photo}
                alt="user_profile"
              />
            ) : (
              <img
                className="rounded-full w-32 m-6"
                src="/profile-setup.gif"
                alt="profile"
              />
            )}
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
          {user?.bio === undefined || null ? (
            <p className="text-secondaryColor text-center mx-3 mb-4">---</p>
          ) : (
            <p className="text-secondaryColor text-center mx-3 mb-4">
              {user?.bio}
            </p>
          )}
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
          <div className="flex justify-center mt-4 mb-10">
            <a href={user?.social_media?.twitter}>
              <img
                className="cursor-pointer"
                src="/twitter-svgrepo-com.svg"
                alt="twitter"
              />
            </a>
            <a href={user?.social_media?.facebook}>
              <img
                className="mx-3 cursor-pointer"
                src="/facebook-svgrepo-com.svg"
                alt="facebook"
              />
            </a>
            <a href={user?.social_media?.instagram}>
              <img
                className="cursor-pointer"
                src="/instagram-svgrepo-com.svg"
                alt="instagram"
              />
            </a>
            <span className="bottom-1 text-center w-40 text-lightColor absolute">
              member since {moment(user?.created_date).format("YYYY")}
            </span>
          </div>
        </div>
        <div className="md:col-span-8 col-span-12 bg-primaryColor">
          <div className="flex justify-end m-3">
            <Link to="/edit/profile">
              <PencilSquareIcon
                className="h-8 w-8 text-lightColor cursor-pointer hover:text-accentColor"
                aria-hidden="true"
              />
            </Link>
          </div>
          <div className="sm:m-8 m-4">
            <p className="flex m-5 justify-between">
              <span className="font-light">First Name:</span>{" "}
              <span className="text-gray-800 font-semibold sm:text-lg">
                {user?.first_name}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Last Name:</span>{" "}
              <span className="text-gray-800 font-semibold sm:text-lg">
                {user?.last_name}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Phone no:</span>{" "}
              <span className="text-gray-800 font-semibold sm:text-lg">
                {user?.phone_no ? user?.phone_no : "---"}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Email:</span>{" "}
              <span className="text-gray-800 font-semibold sm:text-lg">
                {user?.email ? user?.email : "---"}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">Location:</span>{" "}
              <span className="text-gray-800 font-semibold sm:text-lg">
                {user?.location?.city +
                  ", " +
                  user?.location?.state +
                  ", " +
                  user?.location?.country}
              </span>
            </p>
            <p className="flex m-5 justify-between">
              <span className="font-light">About me:</span>{" "}
              {user?.bio ? (
                <span className="text-gray-800 sm:w-80 w-40 font-semibold sm:text-lg truncate">
                  {user?.bio}
                </span>
              ) : (
                <span className="text-gray-800 font-semibold sm:text-lg">
                  ---
                </span>
              )}
            </p>
            <div className="sm:m-5 m-2">
              <span className="font-light">Joined Groups:</span>{" "}
              <div className="overflow-y-scroll sm:h-52 h-72 shadow-inner rounded bg-accentColor/60 mt-5">
                {groups.map((group) => (
                  <div
                    key={group?._id}
                    className="sm:mx-9 mx-3 p-1 rounded-full flex bg-primaryColor mt-2"
                  >
                    {group?.group_profile ? (
                      <img
                        className="rounded-full h-16 self-center w-16"
                        src={group?.group_profile}
                        alt=""
                      />
                    ) : (
                      <img
                        className="rounded-full h-16 self-center w-16"
                        src="/profile-setup.gif"
                        alt=""
                      />
                    )}
                    <div className="w-24 sm:w-60 mx-3 self-center text-sm truncate">
                      <p className="font-semibold">{group?.name}</p>
                      <p className="mt-2">
                        {group?.members.length <= 1 ? (
                          <>
                            <span className="font-semibold">
                              {group?.members.length}
                            </span>{" "}
                            <span className="text-xs">member</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">
                              {group?.members.length}
                            </span>{" "}
                            <span className="text-xs">members</span>
                          </>
                        )}
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
      </div>
    </>
  );
}