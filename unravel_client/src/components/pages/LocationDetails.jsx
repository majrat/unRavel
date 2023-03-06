import axios from "axios";
import config from "../../utils/constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getTheTrip } from "../../helpers/tripsHelper";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function LocationDetails() {
  const [reRender, setReRender] = useState(false);
  const [trip, setTrip] = useState({});
  const [user, setUser] = useState({});
  const [userFollowingGroups, setUserFollowingGroups] = useState([]);

  const location = useLocation();
  let link_location_id;
  if (location?.state !== null) {
    link_location_id = location?.state;
  }

  const getUser = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          const req = await axios
            .get(config.VITE_SERVER_API, {
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

  function getUserFollowingGroups() {
    setUserFollowingGroups(user?.connections?.following?.groups);
  }

  const followGroup = async (selectedGroupId) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch(`${config.VITE_SERVER_API}/follow/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              selectedGroupId,
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res.data.success,
                showConfirmButton: false,
                timer: 1500,
              });
              setReRender(!reRender);
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err.message,
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
      }
    }
  };

  const unFollowGroup = async (selectedGroupId) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .delete(`${config.VITE_SERVER_API}/follow/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              data: { groupId: selectedGroupId },
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response?.data,
        });
      }
    }
  };

  const joinGroup = async (link_group_id) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch(`${config.VITE_SERVER_API}/join/group`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              link_group_id,
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response.data,
        });
      }
    }
  };

  async function joinTrip() {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch(`${config.VITE_SERVER_API}/join/trip`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              link_trip_id: link_location_id,
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res?.data?.success,
                showConfirmButton: false,
                timer: 1500,
              }).then(setReRender(!reRender));
            })
            .catch((err) =>
              Swal.fire({
                icon: "error",
                title: err?.message,
                showConfirmButton: false,
                timer: 1500,
              })
            );
        }
      });
    } catch (err) {
      if (err?.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.response.data,
        });
      }
    }
  }

  useEffect(() => {
    getTheTrip(link_location_id).then((data) => setTrip(data));
  }, [link_location_id, location, reRender]);

  useEffect(() => {
    getUser();
  }, [reRender]);

  useEffect(() => {
    getUserFollowingGroups();
  }, [user]);

  return (
    <>
      {!trip || trip.length === 0 ? (
        <div className="circle-ripple unravel_loading"></div>
      ) : (
        <>
          <section className="sm:mx-16 mx-5 mt-20">
            <div className="relative">
              {" "}
              <img
                className="absolute h-48 w-screen object-cover"
                src={trip?.trip_location?.images?.photos[0]?.src?.original}
                alt="img"
              />
              <div className="relative h-48 flex justify-center sm:justify-start backdrop-blur-sm bg-primaryColor/60">
                <div className="absolute sm:flex sm:items-end sm:text-left text-center p-2 sm:bottom-0">
                  <img
                    className="w-20 rounded-full ml-7 h-20"
                    src={
                      trip?.group_id?.group_profile ||
                      "/group_default_profile.jpg"
                    }
                    alt="dp"
                  />
                  <div className="cursor-default sm:m-2 text-lg">
                    <p> {trip?.group_id?.name}</p>
                    <span className="text-xs">
                      {" "}
                      {trip?.group_id?.members.length + " members"}
                    </span>
                    <span className="text-xs">
                      {" "}
                      {trip?.group_id?.followers.length + " followers"}
                    </span>
                  </div>
                </div>

                {trip?.group_id?.members?.find(
                  (member) => user?._id === member
                ) === user?._id ? (
                  trip?.participants?.some(
                    (participant) => user?._id === participant?._id
                  ) ? (
                    <p className="absolute cursor-default sm:left-auto left-0 -bottom-1 sm:right-32 sm:bottom-0 m-4 rounded-md opacity-60 px-5 py-1 bg-secondaryColor">
                      You joined the trip
                    </p>
                  ) : (
                    <p
                      onClick={() => joinTrip()}
                      className="absolute cursor-pointer left-0 sm:left-auto -bottom-1 sm:right-32 sm:bottom-0 m-4 rounded-md hover:bg-secondaryColor opacity-60 px-5 py-1 bg-lightColor"
                    >
                      Join Trip
                    </p>
                  )
                ) : (
                  <p
                    onClick={() => joinGroup(trip?.group_id?._id)}
                    className="absolute cursor-pointer left-0 sm:left-auto -bottom-1 sm:right-32 sm:bottom-0 m-4 rounded-md hover:bg-secondaryColor opacity-60 px-5 py-1 bg-lightColor"
                  >
                    join Group
                  </p>
                )}
                {userFollowingGroups?.find(
                  (followingGroup) => followingGroup === trip?.group_id?._id
                ) === trip?.group_id?._id ? (
                  <p
                    onClick={() => unFollowGroup(trip?.group_id?._id)}
                    className="absolute right-0 cursor-pointer bottom-0 m-4 rounded-md hover:bg-lightColor opacity-60 px-5 py-1 bg-gray-400"
                  >
                    Following
                  </p>
                ) : (
                  <p
                    onClick={() => followGroup(trip?.group_id?._id)}
                    className="absolute right-0 cursor-pointer bottom-0 m-4 rounded-md hover:bg-secondaryColor opacity-60 px-5 py-1 bg-lightColor"
                  >
                    Follow
                  </p>
                )}
              </div>
            </div>
            <div className="cursor-default px-3 font-mono md:text-2xl sm:px-20 py-10 rounded-md bg-primaryColor/30 shadow-lg">
              <p className="text-gray-500 flex justify-between ">
                <span className="text-lg text-gray-400 ">Created by: </span>
                {trip?.created_by?.first_name +
                  " " +
                  trip?.created_by?.last_name}
              </p>
              <p className="text-gray-500 flex justify-between ">
                <span className="text-lg text-gray-400 ">Type: </span>
                {trip?.trip_type}
              </p>{" "}
              <p className="text-gray-500 flex justify-between ">
                <span className="text-lg text-gray-400 "> trip location: </span>
                {trip?.trip_location?.address?.spot}
              </p>{" "}
              <p className="text-gray-500 flex justify-between ">
                <span className="text-lg text-gray-400 "> Date: </span>
                {moment(trip?.starting_date).format("MMM Do YY")}
              </p>
              <p className="text-gray-500 flex justify-between ">
                <span className="text-lg text-gray-400 ">Mode of travel: </span>{" "}
                {trip?.mode_of_travel}{" "}
              </p>
              <p className="flex justify-between">
                <span className="text-lg text-gray-400 ">status: </span>{" "}
                <span className="text-gray-500"> {trip?.trip_status}</span>
              </p>
            </div>
            <div className="cursor-default font-mono sm:px-20 my-3 py-10 px-3 rounded-md bg-primaryColor/30 shadow-lg">
              <h2 className="underline mb-2 text-lg text-gray-600">
                Trip members
              </h2>
              <div className="max-h-36 overflow-y-scroll">
                {trip?.participants?.map((participant, i) => (
                  <p
                    key={participant?._id}
                    className="text-gray-500 flex justify-between "
                  >
                    {i + 1 + " "}
                    {participant?.first_name + " " + participant?.last_name}
                  </p>
                ))}
              </div>
            </div>
          </section>
          <section className="bg-accentColor/30 sm:mx-16 mx-5 my-2 mb-10 rounded">
            <div className="flex overflow-x-scroll overflow-y-hidden h-full rounded-lg">
              {trip?.trip_location?.images?.photos.map((photo) => (
                <img
                  key={photo?.src?.original}
                  src={photo?.src?.original}
                  className="w-96 h-96 object-cover m-3 rounded-xl"
                  alt="img"
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
