import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { HeartIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import moment from "moment";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import Swal from "sweetalert2";

export default function Banner() {
  const [trips, setTrips] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [user, setUser] = useState("");
  const [userFollowingGroups, setUserFollowingGroups] = useState([]);

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
  const followGroup = async (selectedGroupId) => {
    console.log("follow Group..." + selectedGroupId);
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .patch("http://localhost:8080/api/user/follow/group", {
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
    console.log("follow Group..." + selectedGroupId);
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .delete("http://localhost:8080/api/user/follow/group", {
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

  const getGroups = async () => {
    await axios
      .get("http://localhost:8080/api/user/get_all_groups")
      .then((res) => {
        if (res?.data) {
          setGroups(res?.data);
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
  const getTrips = async () => {
    await axios
      .get("http://localhost:8080/api/user/get_all_trips", {
        params: {
          groupIds: groupIds,
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
  };

  function getGroupsIds() {
    setGroupIds(groups.map((group) => group._id));
  }

  function getUserFollowingGroups() {
    setUserFollowingGroups(user?.connections?.following?.groups);
  }

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    getGroupsIds();
  }, [groups]);

  useEffect(() => {
    getTrips();
  }, [groupIds, reRender]);

  useEffect(() => {
    getUser();
  }, [trips]);

  useEffect(() => {
    getUserFollowingGroups();
  }, [user]);

  return (
    <section className="snap-parent parallax-world-of-ugg">
      <div className="snap-child">
        <section>
          <div className="title text-accentColor justify-center flex">
            <div>
              <h3>unRavel the</h3>
              <h1>WORLD</h1>
            </div>
          </div>
        </section>
        <section
          id="carouselDarkVariant"
          className="carousel slide carousel-fade carousel-dark relative"
        >
          {/* <!-- Indicators --> */}
          <div className="carousel-indicators absolute right-0 bottom-0 left-0 flex justify-center p-0 mb-4">
            <button
              data-bs-target="#carouselDarkVariant"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              data-bs-target="#carouselDarkVariant"
              data-bs-slide-to="1"
              aria-label="Slide 1"
            ></button>
            <button
              data-bs-target="#carouselDarkVariant"
              data-bs-slide-to="2"
              aria-label="Slide 1"
            ></button>
          </div>

          {/* <!-- Inner --> */}
          <div className="carousel-inner relative w-full overflow-hidden">
            {/* <!-- Single item--> */}
            <div className="carousel-item active relative float-left parallax-one bg-[url('https://images.unsplash.com/photo-1415018255745-0ec3f7aee47b?dpr=1&auto=format&fit=crop&w=1500&h=938&q=80&cs=tinysrgb&crop=')]">
              <h2>SOUTHERN CALIFORNIA</h2>
              <div className="carousel-caption hidden md:block absolute text-center">
                <h5 className="text-xl">First slide label</h5>
                <p>
                  Some representative placeholder content for the first slide.
                </p>
              </div>
            </div>
            {/* <!-- Single item END--> */}
          </div>
          {/* <!-- Inner END -->*/}

          {/* <!-- Controls --> */}
          <button
            className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
            type="button"
            data-bs-target="#carouselDarkVariant"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon inline-block bg-no-repeat"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
            type="button"
            data-bs-target="#carouselDarkVariant"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon inline-block bg-no-repeat"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </section>
      </div>
      <div className="snap-child">
        <section id="two">
          <div className="sub_title text-accentColor text-center">
            <h3 className="mb-2">check out these</h3>
            <h1>TRIPS</h1>
          </div>
        </section>
        {/* <h2>NEW YORK</h2> */}
        <section className="parallax-two bg-[url('https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=')] ">
          {trips.map((trip) => (
            <div
              key={trip?._id}
              className="relative transition-all z-10 min-w-max bg-secondaryColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90"
            >
              <div className="flex px-3 justify-end">
                <Link
                  to="/group"
                  state={{ link_group_id: trip?.group_id?._id }}
                >
                  <img
                    className="w-10 h-10 my-4 rounded-full absolute left-4"
                    src={
                      trip?.group_id?.group_profile ||
                      "/group_default_profile.jpg"
                    }
                    alt="dp"
                  />

                  <div className="mt-3 mr-4 ml-2 text-gray-800 flex-col flex absolute left-14">
                    <span className="text-sm font-semibold">
                      {trip?.group_id?.name}
                    </span>

                    {trip?.group_id?.members.length ? (
                      trip?.group_id?.members.length === 1 ? (
                        <span className="text-sm">
                          {trip?.group_id?.members.length} member
                        </span>
                      ) : (
                        <span className="text-sm">
                          {trip?.group_id?.members.length} members
                        </span>
                      )
                    ) : (
                      <span className="text-xs mt-3">
                        group no longer exists !!
                      </span>
                    )}
                  </div>
                </Link>
                {trip?.expected_expense === "luxury" ? (
                  <>
                    <div className="premium-symbol absolute left-0"></div>
                    <img
                      className="absolute left-1 top-1"
                      src="/premium.svg"
                      alt="luxury"
                    />
                  </>
                ) : trip?.expected_expense === "budget" ? (
                  <>
                    <div className="budget-symbol absolute left-0"></div>
                    <img
                      className="absolute left-1 top-1"
                      src="/budget.svg"
                      alt="budget"
                    />
                  </>
                ) : (
                  <>
                    <div className="unknown-symbol absolute left-0"></div>
                    <span
                      className="absolute left-3 text-2xl font-bold text-lightColor"
                      alt="unknown"
                    >
                      ?
                    </span>
                  </>
                )}

                {userFollowingGroups?.find(
                  (followingGroup) => followingGroup === trip?.group_id?._id
                ) === trip?.group_id?._id ? (
                  <div
                    key={trip?.group_id?._id}
                    onClick={() => unFollowGroup(trip?.group_id?._id)}
                    className="w-28 h-8 my-4 relative cursor-pointer bg-lightColor/60 rounded"
                  >
                    <span className="left-0 ml-1 mt-1 absolute">following</span>
                    <span className="right-0 mr-1 mt-1 absolute">
                      {trip?.group_id?.followers.length
                        ? trip?.group_id?.followers.length
                        : 0}
                    </span>
                  </div>
                ) : (
                  <div
                    key={trip?._id}
                    onClick={() => followGroup(trip?.group_id?._id)}
                    className="w-28 h-8 my-4 relative bg-accentColor/60 cursor-pointer hover:bg-accentColor rounded"
                  >
                    <span className="left-0 ml-1 mt-1 absolute">+ follow</span>
                    <span className="right-0 mr-1 mt-1 absolute">
                      {trip?.group_id?.followers.length
                        ? trip?.group_id?.followers.length
                        : 0}
                    </span>
                  </div>
                )}
              </div>
              {trip?.trip_location?.images.length === 0 || null || undefined ? (
                <img
                  src="/no-image.gif"
                  alt="img"
                  className="w-96 px-3 h-64 object-cover"
                />
              ) : (
                <img
                  src={trip?.trip_location?.images[0]}
                  alt="img"
                  className="w-96 px-3 h-64 object-cover"
                />
              )}

              <div>
                <div className="flex flex-col">
                  <span className="text-accentColor truncate w-72 mx-4 mt-2">
                    From{" "}
                    {trip?.group_id?.group_admin?.location.city +
                      " " +
                      trip?.group_id?.group_admin?.location.state +
                      " " +
                      trip?.group_id?.group_admin?.location.country}
                  </span>
                  <span className="text-gray-600 truncate w-72 mx-4 mt-1 text-lg font-semibold">
                    To{" "}
                    {trip?.trip_location?.address?.spot +
                      " " +
                      trip?.trip_location?.address?.city +
                      " " +
                      trip?.trip_location?.address?.state +
                      " " +
                      trip?.trip_location?.address?.country}
                  </span>
                  <HeartIcon
                    className="h-10 w-10 absolute right-5 mt-4 cursor-pointer"
                    aria-hidden="true"
                  />

                  <div className="mt-1 text-accentColor mx-4 text-sm justify-between flex mb-3">
                    {/*TODO: <span>3 months trip</span> */}
                    <span>
                      <span className="font-light">Posted on</span>{" "}
                      {moment(trip?.created_date).format("ll")}
                    </span>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <div className="snap-child">
        <section>
          <div className="sub_title text-accentColor text-center">
            <h3 className="mb-2">check out these</h3>
            <h1>GROUPS</h1>
          </div>
        </section>
        <section>
          <div className="parallax-three bg-[url('https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?dpr=1&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=')]">
            {/* <h2>ENCHANTED FOREST</h2> */}
            {groups.map((group) => (
              <div
                key={group?._id}
                className="relative z-10 transition-all min-w-max bg-lightColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90 cursor-pointer"
              >
                <div className="flex px-3 justify-end">
                  <Link to="/group" state={{ link_group_id: group?._id }}>
                    <img
                      className="w-10 h-10 my-4 rounded-full absolute left-4"
                      src={group?.group_profile || "/group_default_profile.jpg"}
                      alt="dp"
                    />

                    <div className="mt-3 mr-4 ml-2 text-gray-800 flex-col flex absolute left-14">
                      <span className="text-sm font-semibold">
                        {group?.name}
                      </span>

                      {group?.members.length ? (
                        group?.members.length === 1 ? (
                          <span className="text-sm">
                            {group?.members.length} member
                          </span>
                        ) : (
                          <span className="text-sm">
                            {group?.members.length} members
                          </span>
                        )
                      ) : (
                        <span className="text-xs mt-3">
                          group no longer exists !!
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="w-28 h-8 my-4 relative rounded">
                    {userFollowingGroups?.find(
                      (followingGroup) => followingGroup === group?._id
                    ) === group?._id ? (
                      <div
                        key={group?._id}
                        onClick={() => unFollowGroup(group?._id)}
                        className="w-28 h-8 relative bg-lightColor/60 rounded"
                      >
                        <span className="left-0 ml-1 mt-1 absolute">
                          following
                        </span>
                        <span className="right-0 mr-1 mt-1 absolute">
                          {group?.followers.length
                            ? group?.followers.length
                            : 0}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={group?._id}
                        onClick={() => followGroup(group?._id)}
                        className="w-28 h-8 relative bg-accentColor/60 cursor-pointer hover:bg-accentColor rounded"
                      >
                        <span className="left-0 ml-1 mt-1 absolute">
                          + follow
                        </span>
                        <span className="right-0 mr-1 mt-1 absolute">
                          {group?.followers.length
                            ? group?.followers.length
                            : 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col">
                    <span className="text-accentColor truncate w-72 mx-4 mt-2">
                      {/* From{" "}
                      {trip?.group_id?.group_admin?.location.city +
                        " " +
                        trip?.group_id?.group_admin?.location.state +
                        " " +
                        trip?.group_id?.group_admin?.location.country} */}
                    </span>
                    <span className="text-gray-600 truncate w-72 mx-4 mt-1 text-lg font-semibold">
                      {/* To{" "}
                      {trip?.trip_location?.address?.spot +
                        " " +
                        trip?.trip_location?.address?.city +
                        " " +
                        trip?.trip_location?.address?.state +
                        " " +
                        trip?.trip_location?.address?.country} */}
                    </span>
                    <HeartIcon
                      className="h-10 w-1/12 absolute right-5 mt-1 cursor-pointer"
                      aria-hidden="true"
                    />

                    <div className="mt-1 text-accentColor mx-4 text-sm justify-between flex mb-3">
                      {/*TODO: <span>3 months trip</span> */}
                      <span>
                        <span className="font-light">Since</span>{" "}
                        {moment(group?.created_date).format("ll")}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section>
        <div className="block"></div>
      </section>
    </section>
  );
}
