import axios from "axios";
import config from "../../utils/constants";
import { useReducer, useRef, useState } from "react";
import { useEffect } from "react";
import { HeartIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import moment from "moment";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import Swal from "sweetalert2";
import { getLocationsWithPhotos } from "../../helpers/locationHelper";
import { getAllGroups } from "../../helpers/groupHelper";
import { getAllTrips } from "../../helpers/tripsHelper";

export default function Banner() {
  const [trips, setTrips] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [user, setUser] = useState("");
  const [userFollowingGroups, setUserFollowingGroups] = useState([]);
  const [allLocationSlides, setAllLocationSlides] = useState([]);
  const [slides, setSlides] = useState([]);

  function getImgsFromLocation() {
    setSlides(
      allLocationSlides.map((slide) => [
        {
          image: slide?.images?.photos[0].src.original,
          title: slide?.address?.spot,
          subtitle: slide?.address?.country,
          photographer: slide?.images?.photos[0].photographer,
          photographer_link: slide?.images?.photos[0].photographer_url,
        },
      ])
    );
  }

  function useTilt(active) {
    const ref = useRef(null);

    useEffect(() => {
      if (!ref.current || !active) {
        return;
      }

      const state = {
        rect: undefined,
        mouseX: undefined,
        mouseY: undefined,
      };

      let el = ref.current;

      const handleMouseMove = (e) => {
        if (!el) {
          return;
        }
        if (!state.rect) {
          state.rect = el.getBoundingClientRect();
        }
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        const px = (state.mouseX - state.rect.left) / state.rect.width;
        const py = (state.mouseY - state.rect.top) / state.rect.height;

        el.style.setProperty("--px", px);
        el.style.setProperty("--py", py);
      };

      el.addEventListener("mousemove", handleMouseMove);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
      };
    }, [active]);

    return ref;
  }

  const initialState = {
    slideIndex: 0,
  };

  const slidesReducer = (state, event) => {
    if (event.type === "NEXT") {
      return {
        ...state,
        slideIndex: (state.slideIndex + 1) % slides.length,
      };
    }
    if (event.type === "PREV") {
      return {
        ...state,
        slideIndex:
          state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1,
      };
    }
  };

  function Slide({ slide, offset }) {
    const active = offset === 0 ? true : null;
    const ref = useTilt(active);
    console.log(slide);

    return (
      <div
        ref={ref}
        className="slide"
        data-active={active}
        style={{
          "--offset": offset,
          "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1,
        }}
      >
        <div
          className="slideBackground"
          style={{
            backgroundImage: `url('${slide[0].image}')`,
          }}
        />
        <div
          className="slideContent sm:h-[70vh] w-[70vw] h-[40vh]"
          style={{
            backgroundImage: `url('${slide[0].image}')`,
          }}
        >
          <div className="slideContentInner">
            <h2 className="slideTitle cursor-default">{slide[0].title}</h2>
            <h3 className="slideSubtitle cursor-default">
              {slide[0].subtitle}
            </h3>
            <a
              href={slide[0].photographer_link}
              className="slideDescription hover:link-primary transition-all"
            >
              {"pic by: " + slide[0].photographer}
            </a>
          </div>
        </div>
      </div>
    );
  }
  const [state, dispatch] = useReducer(slidesReducer, initialState);

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
          if (req?.data) {
            setUser(req?.data);
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

  function getGroupsIds() {
    setGroupIds(groups.map((group) => group._id));
  }

  function getUserFollowingGroups() {
    setUserFollowingGroups(user?.connections?.following?.groups);
  }

  useEffect(() => {
    getLocationsWithPhotos().then((data) => setAllLocationSlides(data));
    getAllGroups().then((data) => setGroups(data));
  }, []);

  useEffect(() => {
    getImgsFromLocation();
  }, [allLocationSlides]);
  useEffect(() => {
    getGroupsIds();
  }, [groups]);

  useEffect(() => {
    getAllTrips(groupIds).then((data) => setTrips(data));
  }, [groupIds, reRender]);

  useEffect(() => {
    getUser();
  }, [trips]);

  useEffect(() => {
    getUserFollowingGroups();
  }, [user]);

  return (
    <section className="snap-y-parent parallax-world-of-ugg">
      <div className="snap-y-child">
        <section>
          <div className="title text-accentColor justify-center flex">
            <div>
              <h3>unRavel the</h3>
              <h1>WORLD</h1>
            </div>
          </div>
        </section>
        <section className="slideBody slideHtml h-[60vh] sm:h-[80vh]">
          <div className="slides">
            <button onClick={() => dispatch({ type: "PREV" })}>‹</button>

            {[...slides, ...slides, ...slides].map((slide, i) => {
              let offset = slides.length + (state.slideIndex - i);
              return <Slide slide={slide} offset={offset} key={i} />;
            })}
            <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
          </div>
        </section>
      </div>
      <div className="snap-y-child">
        <section id="two">
          <div className="sub_title text-accentColor text-center">
            <h3 className="mb-2">check out these</h3>
            <h1>TRIPS</h1>
          </div>
        </section>
        {/* <h2>NEW YORK</h2> */}
        <section className="snap-x snap-mandatory parallax-two bg-[url('https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=')] ">
          {!trips || trips.length === 0 ? (
            <>
              <div className="snap-center sm:snap-start sm:scroll-ml-3 relative transition-all z-10 min-w-max bg-secondaryColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90">
                <div className="flex px-3 justify-end">
                  <div
                    className="animate-pulse w-10 h-10 my-4 rounded-full absolute left-4 bg-accentColor/60"
                    alt="dp"
                  ></div>

                  <div className="animate-pulse mt-3 mr-4 ml-2 flex-col flex absolute left-14">
                    <span className="animate-pulse text-sm w-28 h-3 rounded-md font-semibold bg-primaryColor/60"></span>

                    <span className="animate-pulse text-sm w-28 rounded-md h-3 mt-2 bg-primaryColor/60"></span>
                  </div>

                  <div className="animate-pulse premium-symbol absolute left-0"></div>
                  <span className="animate-pulse absolute left-1 top-1"></span>

                  <div className="w-28 h-8 my-4 relative cursor-pointer bg-lightColor/60 rounded">
                    <span className="animate-pulse left-0 ml-1 mt-2 absolute rounded-lg w-20 h-3 bg-primaryColor/60"></span>
                    <span className="animate-pulse right-0 mr-1 mt-2 absolute w-4 rounded-lg h-3 bg-primaryColor/60"></span>
                  </div>
                </div>

                <div className="animate-pulse w-96 px-3 h-64 object-cover bg-primaryColor/60"></div>

                <div>
                  <div className="flex flex-col">
                    <span className="animate-pulse text-accentColor bg-accentColor/60 h-5 rounded-md truncate w-72 mx-4 mt-2"></span>
                    <span className="animate-pulse text-gray-600 truncate bg-accentColor/60 rounded-md w-72 h-7 mx-4 mt-1 text-lg font-semibold"></span>
                    <span
                      className="h-10 w-10 absolute animate-pulse bg-accentColor/60 rounded-md right-5 mt-4 cursor-pointer"
                      aria-hidden="true"
                    ></span>

                    <div className="mt-1 mx-4 text-sm justify-between animate-pulse flex mb-3 w-24 h-3 bg-accentColor/60 rounded-md">
                      {/*TODO: <span>3 months trip</span> */}
                      <span>
                        <span className="animate-pulse font-light bg-slate-300"></span>{" "}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="snap-center sm:snap-start sm:scroll-ml-3 relative transition-all z-10 min-w-max bg-secondaryColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90">
                <div className="flex px-3 justify-end">
                  <div
                    className="animate-pulse w-10 h-10 my-4 rounded-full absolute left-4 bg-accentColor/60"
                    alt="dp"
                  ></div>

                  <div className="animate-pulse mt-3 mr-4 ml-2 flex-col flex absolute left-14">
                    <span className="animate-pulse text-sm w-28 h-3 rounded-md font-semibold bg-primaryColor/60"></span>

                    <span className="animate-pulse text-sm w-28 rounded-md h-3 mt-2 bg-primaryColor/60"></span>
                  </div>

                  <div className="animate-pulse premium-symbol absolute left-0"></div>
                  <span className="animate-pulse absolute left-1 top-1"></span>

                  <div className="w-28 h-8 my-4 relative cursor-pointer bg-lightColor/60 rounded">
                    <span className="animate-pulse left-0 ml-1 mt-2 absolute rounded-lg w-20 h-3 bg-primaryColor/60"></span>
                    <span className="animate-pulse right-0 mr-1 mt-2 absolute w-4 rounded-lg h-3 bg-primaryColor/60"></span>
                  </div>
                </div>

                <div className="animate-pulse w-96 px-3 h-64 object-cover bg-primaryColor/60"></div>

                <div>
                  <div className="flex flex-col">
                    <span className="animate-pulse text-accentColor bg-accentColor/60 h-5 rounded-md truncate w-72 mx-4 mt-2"></span>
                    <span className="animate-pulse text-gray-600 truncate bg-accentColor/60 rounded-md w-72 h-7 mx-4 mt-1 text-lg font-semibold"></span>
                    <span
                      className="h-10 w-10 absolute animate-pulse bg-accentColor/60 rounded-md right-5 mt-4 cursor-pointer"
                      aria-hidden="true"
                    ></span>

                    <div className="mt-1 mx-4 text-sm justify-between animate-pulse flex mb-3 w-24 h-3 bg-accentColor/60 rounded-md">
                      {/*TODO: <span>3 months trip</span> */}
                      <span>
                        <span className="animate-pulse font-light bg-slate-300"></span>{" "}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="snap-center sm:snap-start sm:scroll-ml-3 relative transition-all z-10 min-w-max bg-secondaryColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90">
                <div className="flex px-3 justify-end">
                  <div
                    className="animate-pulse w-10 h-10 my-4 rounded-full absolute left-4 bg-accentColor/60"
                    alt="dp"
                  ></div>

                  <div className="animate-pulse mt-3 mr-4 ml-2 flex-col flex absolute left-14">
                    <span className="animate-pulse text-sm w-28 h-3 rounded-md font-semibold bg-primaryColor/60"></span>

                    <span className="animate-pulse text-sm w-28 rounded-md h-3 mt-2 bg-primaryColor/60"></span>
                  </div>

                  <div className="animate-pulse premium-symbol absolute left-0"></div>
                  <span className="animate-pulse absolute left-1 top-1"></span>

                  <div className="w-28 h-8 my-4 relative cursor-pointer bg-lightColor/60 rounded">
                    <span className="animate-pulse left-0 ml-1 mt-2 absolute rounded-lg w-20 h-3 bg-primaryColor/60"></span>
                    <span className="animate-pulse right-0 mr-1 mt-2 absolute w-4 rounded-lg h-3 bg-primaryColor/60"></span>
                  </div>
                </div>

                <div className="animate-pulse w-96 px-3 h-64 object-cover bg-primaryColor/60"></div>

                <div>
                  <div className="flex flex-col">
                    <span className="animate-pulse text-accentColor bg-accentColor/60 h-5 rounded-md truncate w-72 mx-4 mt-2"></span>
                    <span className="animate-pulse text-gray-600 truncate bg-accentColor/60 rounded-md w-72 h-7 mx-4 mt-1 text-lg font-semibold"></span>
                    <span
                      className="h-10 w-10 absolute animate-pulse bg-accentColor/60 rounded-md right-5 mt-4 cursor-pointer"
                      aria-hidden="true"
                    ></span>

                    <div className="mt-1 mx-4 text-sm justify-between animate-pulse flex mb-3 w-24 h-3 bg-accentColor/60 rounded-md">
                      {/*TODO: <span>3 months trip</span> */}
                      <span>
                        <span className="animate-pulse font-light bg-slate-300"></span>{" "}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </>
          ) : (
            trips.map((trip) => (
              <div
                key={trip?._id}
                className="snap-center sm:snap-start sm:scroll-ml-3 relative transition-all z-10 min-w-max bg-secondaryColor/60 backdrop-blur-sm mx-4 rounded shadow-lightColor/40 shadow-md hover:shadow-lg hover:shadow-lightColor/60 hover:bg-secondaryColor/90"
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
                      <span className="left-0 ml-1 mt-1 absolute">
                        following
                      </span>
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
                      <span className="left-0 ml-1 mt-1 absolute">
                        + follow
                      </span>
                      <span className="right-0 mr-1 mt-1 absolute">
                        {trip?.group_id?.followers.length
                          ? trip?.group_id?.followers.length
                          : 0}
                      </span>
                    </div>
                  )}
                </div>
                <Link to="/trips" state={trip?._id}>
                  {trip?.trip_location?.images?.photos.length === 0 ||
                  trip?.trip_location?.images?.photos.length === null ||
                  trip?.trip_location?.images?.photos.length === undefined ? (
                    <img
                      src="/no-image.gif"
                      alt="img"
                      className="w-96 px-3 h-64 object-cover"
                    />
                  ) : (
                    <img
                      src={trip?.trip_location?.images?.photos[0].src.medium}
                      alt={trip?.trip_location?.images?.photos[0].alt}
                      className="w-96 px-3 h-64 object-cover"
                    />
                  )}
                </Link>
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
            ))
          )}
        </section>
      </div>
      <div className="snap-y-child">
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
