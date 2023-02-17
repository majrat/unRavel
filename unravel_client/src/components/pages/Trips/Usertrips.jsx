import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebase";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import GoToChatWidget from "../../GroupChat/GoToChatWidget";

export default function UserTrips() {
  const [user, setUser] = useState("");
  const [currentTrip, setCurrentTrip] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripStatus, setTripStatus] = useState("");
  const [filteredTripStatus, setFilteredTripStatus] = useState([]);
  const [IsTripCreatedUser, SetIsTripCreatedUser] = useState(false);

  const allTripStatus = [
    "waiting for members",
    "waiting closed",
    "trip preperations",
    "on trip",
    "trip completed",
  ];

  const location = useLocation();
  let link_trip_id;
  if (location?.state !== null) {
    link_trip_id = location?.state.link_trip_id;
  }
  console.log(link_trip_id);
  console.log(tripStatus);

  const handleTripStatus = (e) => {
    setTripStatus(e.target.value);
  };

  async function changeStatus() {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          // setProfilePhoto(e.target.logo.files[0]);

          await axios
            .patch("http://localhost:8080/api/user/change/trip/status", {
              tripStatus,
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              // refreshPage();
              Swal.fire({
                icon: "success",
                title: "Edits saved",
                showConfirmButton: false,
                timer: 1500,
              });
              setReRender(!reRender);
              // console.log("success");
            });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  const get_trips = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        await axios
          .get("http://localhost:8080/api/user/get_user_trips", {
            params: {
              userid: user?._id,
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res?.data) {
              setTrips(res?.data);
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
      }
    });
  };

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
                Swal.fire({
                  icon: "error",
                  title: error.response.data,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            });
          if (req.data) {
            setUser(req.data);
          }
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User might be logged out --" + err,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  console.log(filteredTripStatus);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    SetIsTripCreatedUser(
      currentTrip[0]?.created_by?._id === user?._id ||
        trips[0]?.created_by?._id === user?._id
    );
    setFilteredTripStatus(
      allTripStatus.filter(
        (filteredStatus) =>
          currentTrip[0]?.trip_status !== filteredStatus ||
          trips[0]?.trip_status !== filteredStatus
      )
    );
  }, [currentTrip, trips]);

  useEffect(() => {
    get_trips();
  }, [user]);

  console.log(currentTrip);
  useEffect(() => {
    setCurrentTrip(trips.filter((trip) => trip?._id === link_trip_id));
  }, [link_trip_id]);

  return (
    <>
      <Navbar />
      <GoToChatWidget userName={user?.first_name + " " + user?.last_name} />

      <div className="absolute z-10 w-full">
        <p className="Oswald-font mt-20 pt-1 bg-primaryColor/30 backdrop-blur-md sm:mx-16 mx-5 rounded font-bold text-center pb-2 text-lightColor ">
          My Trips
        </p>
        <div className="mx-5 rounded sm:mx-16 overflow-x-scroll flex backdrop-blur-xl bg-secondaryColor/30">
          {trips.map((trip) => (
            <Link
              key={trip?._id}
              to="/user/trips"
              state={{ link_trip_id: trip?._id }}
              className="w-32 m-2 flex flex-col justify-center rounded cursor-pointer hover:shadow-md hover:shadow-gray-600/50 shadow shadow-lightColor/10 h-12 bg-lightColor/50"
            >
              <p className="text-xs font-semibold pl-2 py-4 w-32 truncate hover:text-clip backdrop-blur-lg rounded text-gray-600">
                {trip?.trip_location?.address?.spot}
              </p>
            </Link>
          ))}
        </div>

        <div className="sm:hidden flex col-span-7 w-44 lg:max-w-sm">
          Status:
          <select
            onSelect={handleTripStatus}
            className="h-8 w-52 mx-5 px-2 bg-accentColor/20 text-gray-600 mt-3 cursor-pointer rounded-md"
          >
            <option selected disabled>
              {currentTrip[0]?.trip_status || trips[0]?.trip_status}
            </option>
            {IsTripCreatedUser &&
              filteredTripStatus?.map((status) => (
                <option value={status}>{status}</option>
              ))}
          </select>
          {IsTripCreatedUser && (
            <p
              onClick={changeStatus}
              className="h-8 px-2 bg-accentColor/20 text-gray-600 mt-3 cursor-pointer rounded-md"
            >
              Save
            </p>
          )}
        </div>
        <div className="grid grid-cols-12">
          <div className="bg-lightColor/50 backdrop-blur-xl  grid grid-cols-12 col-span-12 sm:h-24 h-20 mt-4 sm:mx-16 mx-5 z-10 rounded-md">
            <div className="sm:col-span-2 col-span-4 justify-center flex">
              <img
                className="rounded-full h-20 w-20 sm:w-28 sm:h-28 object-cover mt-6 sm:mt-5"
                src={
                  currentTrip[0]?.group_id?.group_profile ||
                  trips[0]?.group_id?.group_profile ||
                  "/group_default_profile.jpg"
                }
                alt="img"
              />
            </div>
            <div className="sm:col-span-3 col-span-4 relative">
              <div className="sm:bottom-11 bottom-8 absolute left-0">
                <p className="text-gray-600 font-bold text-shadow sm:text-xl">
                  {currentTrip[0]?.group_id?.name || trips[0]?.group_id?.name}
                </p>
                <p className="text-gray-600 font-light sm:text-base text-xs text-shadow flex justify-between">
                  {currentTrip[0]?.group_id?.members.length ||
                    trips[0]?.group_id?.members.length}{" "}
                  {currentTrip[0]?.group_id?.members.length <= 1 ||
                  trips[0]?.group_id?.members.length <= 1
                    ? "member"
                    : "members"}
                </p>
              </div>
            </div>
            <div className="hidden sm:block col-span-7 w-44 lg:max-w-sm">
              <select
                onSelect={handleTripStatus}
                className="h-8 w-52 px-2 bg-accentColor/20 text-gray-600 absolute m-3 cursor-pointer rounded-md right-20 bottom-0"
              >
                <option selected disabled>
                  {currentTrip[0]?.trip_status || trips[0]?.trip_status}
                </option>
                {IsTripCreatedUser &&
                  filteredTripStatus?.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
              </select>
              {IsTripCreatedUser && (
                <p
                  onClick={changeStatus}
                  className="h-8 px-2 bg-accentColor/20 text-gray-600 absolute m-3 cursor-pointer rounded-md right-0 bottom-0"
                >
                  Save
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 col-span-12 sm:h-24 h-20 sm:mx-16 mx-5 rounded-md">
            <div className="col-span-12 rounded-md bg-secondaryColor/60 backdrop-blur-xl my-4 mr-2">
              <p className="mt-8 text-center text-xl font-semibold text-gray-600">
                Participants
              </p>
              <div className="px-10 mx-1 rounded-md py-2 mb-6 shadow-xl text-gray-600 bg-lightColor/20 sm:min-h-[16rem] min-h-[20rem] overflow-y-scroll">
                {currentTrip?.length === 0 || link_trip_id === undefined
                  ? trips[0]?.participants?.map((participant, i) => (
                      <div key={participant?._id} className="flex py-1">
                        <p className="mt-1 mr-9">{i + 1}.</p>
                        <img
                          src={
                            participant?.profile_photo || "/profile-setup.gif"
                          }
                          alt="dp"
                          className="rounded-full mr-6 w-9 h-9"
                        />
                        <p className="mt-1 mr-9 truncate">
                          {participant?.first_name +
                            " " +
                            participant?.last_name}
                        </p>
                        {trips[0]?.created_by?._id === participant?._id ? (
                          <p className="mt-1 ml-auto truncate hover:text-clip">
                            Created Trip
                          </p>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    ))
                  : currentTrip[0]?.participants?.map((participant, i) => (
                      <div key={participant?._id} className="flex py-1">
                        <p className="mt-1 mr-9">{i + 1}.</p>
                        <img
                          src={
                            participant?.profile_photo || "/profile-setup.gif"
                          }
                          alt="dp"
                          className="rounded-full mr-6 w-9 h-9"
                        />
                        <p className="mt-1 mr-9 truncate hover:text-clip">
                          {participant?.first_name +
                            " " +
                            participant?.last_name}
                        </p>
                        {trips[0]?.created_by?._id === participant?._id ? (
                          <p className="mt-1 ml-auto truncate hover:text-clip">
                            Created Trip
                          </p>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        className="object-center h-screen object-cover w-screen blur-sm z-0"
        src={
          currentTrip[0]?.trip_location?.images?.photos[0]?.src?.original ||
          trips[0]?.trip_location?.images?.photos[0]?.src?.original ||
          "/group_default_profile.jpg"
        }
        alt=""
      />
    </>
  );
}
