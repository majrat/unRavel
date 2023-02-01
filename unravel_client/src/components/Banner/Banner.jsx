import axios from "axios";
import { map } from "leaflet";
import { useState } from "react";
import { useEffect } from "react";
import { HeartIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import useScrollSnap from "react-use-scroll-snap";
import moment from "moment";

export default function Banner() {
  const [trips, setTrips] = useState([]);
  const truncate = (input) =>
    input?.length > 30 ? `${input.substring(0, 27)}...` : input;

  console.log(trips);

  const get_trips = async () => {
    await axios
      .get("http://localhost:8080/api/user/get_all_trips")
      .then((res) => {
        if (res.data) {
          setTrips(res.data);
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
  // const posted_date = trips.created_date;
  // console.log(posted_date);
  const scrollRef = useRef(null);
  useScrollSnap({ ref: scrollRef, duration: 50, delay: 0.1 });

  useEffect(() => {
    get_trips();
  }, []);
  return (
    <section className="parallax-world-of-ugg" ref={scrollRef}>
      <section>
        <div className="title text-accentColor justify-center flex">
          <a href="#two">
            <ChevronDoubleDownIcon
              href=""
              className="h-10 w-10 z-10 mx-3 cursor-pointer"
              aria-hidden="true"
            />
          </a>
          <div>
            <h3>unRavel the</h3>
            <h1>WORLD</h1>
          </div>
          <ChevronDoubleDownIcon
            className="h-10 w-10 z-10 mx-3 cursor-pointer"
            aria-hidden="true"
          />
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
      <section id="two">
        <div className="sub_title text-accentColor text-center">
          <h3 className="mb-2">check out these</h3>
          <h1>TRIPS TO JOIN</h1>
        </div>
      </section>
      {/* <h2>NEW YORK</h2> */}
      <section className="parallax-two bg-[url('https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=')] ">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="relative z-10 min-w-max bg-secondaryColor mx-4 rounded shadow-accentColor/40 shadow-lg"
          >
            <div className="flex px-3 justify-end">
              <div className="w-10 h-10 my-4 bg-accentColor rounded-full absolute left-4"></div>

              {trip.expected_expense === "luxury" ? (
                <>
                  <div className="premium-symbol absolute left-0"></div>
                  <img
                    className="absolute left-1 top-1"
                    src="/premium.svg"
                    alt="luxury"
                  />
                </>
              ) : trip.expected_expense === "budget" ? (
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

              <div className="mt-3 mr-4 ml-2 flex-col flex absolute left-14">
                <span className="text-sm font-semibold">
                  {trip.group_id.name}
                </span>

                {trip.group_id.members.length === 1 ? (
                  <span className="text-sm">
                    {trip.group_id.members.length} member
                  </span>
                ) : (
                  <span className="text-sm">
                    {trip.group_id.members.length} members
                  </span>
                )}
              </div>
              <div className="w-28 h-8 my-4 relative bg-accentColor rounded">
                <span className="left-0 ml-1 mt-1 absolute">+ follow</span>
                <span className="right-0 mr-1 mt-1 absolute">12</span>
              </div>
            </div>
            {trip.trip_location?.images.length === 0 || null || undefined ? (
              <img
                src="/no-image.gif"
                alt="img"
                className="w-96 px-3 h-64 object-cover"
              />
            ) : (
              <img
                src={trip.trip_location?.images[0]}
                alt="img"
                className="w-96 px-3 h-64 object-cover"
              />
            )}

            <div>
              <div className="flex flex-col">
                <span className="text-accentColor mx-4 mt-2">
                  From{" "}
                  {truncate(
                    trip.group_id?.group_admin?.location.city +
                      " " +
                      trip.group_id?.group_admin?.location.state +
                      " " +
                      trip.group_id?.group_admin?.location.country
                  )}
                </span>
                <span className="text-gray-600 mx-4 mt-1 text-lg font-semibold">
                  To{" "}
                  {truncate(
                    trip.trip_location.address.spot +
                      " " +
                      trip.trip_location.address.city +
                      " " +
                      trip.trip_location.address.state +
                      " " +
                      trip.trip_location.address.country
                  )}
                </span>
                <HeartIcon
                  className="h-10 w-10 absolute right-5 mt-4 cursor-pointer"
                  aria-hidden="true"
                />

                <div className="mt-1 text-accentColor mx-4 text-sm justify-between flex mb-3">
                  {/*TODO: <span>3 months trip</span> */}
                  <span>
                    <span className="font-light">Posted on</span>{" "}
                    {moment(trip.created_date).format("ll")}
                  </span>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="block"></div>
      </section>
      <section>
        <div className="parallax-three bg-[url('https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?dpr=1&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=')]">
          <h2>ENCHANTED FOREST</h2>
        </div>
      </section>
      <section>
        <div className="block"></div>
      </section>
    </section>
  );
}
