import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import config from "../../../utils/constants";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebase";

const expected_expenses = ["luxury", "budget", "Unknown"];
const trip_types = [
  "just a visit",
  "For religious purpose",
  "For trekking",
  "Hill Climbing",
  "Festival",
  "Business",
  "Study",
  "Calm my mind",
  "New Experience",
  "I am always travelling",
  "Family trip",
  "To attend a Function",
];
const modes_of_travel = [
  "On bike",
  "On bus",
  "On car",
  "On train",
  "On Plane",
  "Through Sea",
  "Not decided",
];

const stays = ["Hotel", "Apartment", "Tent", "Not decided"];
const foods = ["self cook", "restaurent", "Not decided"];

const NewTrip = ({ user }) => {
  let navigate = useNavigate();
  let location = useLocation();

  const [allLocations, setAllLocations] = useState([]);
  const [allGroupsInfo, setAllGroupsInfo] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedTripType, setSelectedTripType] = useState("");
  const [selectedTravelMode, setSelectedTravelMode] = useState("");
  const [selectedStay, setSelectedStay] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDesc, setSelectedDesc] = useState("");

  const check_data = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .get(`${config.UNRAVEL_SERVER_API}/user_group_info`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then(async (res) => {
              if (res?.data.length !== 0) {
                setAllGroupsInfo(res.data);
              } else {
                Swal.fire({
                  title: "You don't have a group",
                  text: "Group is required for starting a trip.",
                  icon: "warning",
                  allowOutsideClick: false,
                  confirmButtonColor: "#3085d6",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/");
                  }
                });
              }
            });
          await axios
            .get(`${config.UNRAVEL_SERVER_API}/get_all_location`)
            .then((res) => {
              if (res.data) {
                setAllLocations(res.data);
              } else {
                Swal.fire({
                  title: "No locations found in the database",
                  text: "No location data found. Database empty",
                  icon: "warning",
                  allowOutsideClick: false,
                  confirmButtonColor: "#3085d6",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/");
                  }
                });
              }
            });
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

  const newTrip = {};

  const { handleSubmit, register } = useForm({
    defaultValues: {
      date: newTrip?.date,
      group_id: newTrip?.group_id,
      trip_location: newTrip?.trip_location,
      trip_type: newTrip?.trip_type,
      travel_mode: newTrip?.travel_mode,
      stay: newTrip?.stay,
      food: newTrip?.food,
      expected_expense: newTrip?.expected_expense,
      other_details: newTrip?.other_details,
    },
  });
  const onSubmit = async (data) => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await getIdToken(user);
          await axios
            .post(`${config.UNRAVEL_SERVER_API}/create_new_trip`, {
              headers: {
                authorization: `Bearer ${token}`,
              },
              ...data,
            })
            .then(() => {
              navigate("/");
            })
            .catch((err) => alert(err.message));
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

  useEffect(() => {
    check_data();
  }, []);
  return (
    <>
      <div className="grid grid-cols-12 bg-[url('/create_trip_bg.jpg')] h-screen bg-cover bg-center">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ stiffness: 100 }}
          className="sm:col-span-5 col-span-12 shadow-xl backdrop-blur-lg rounded sm:mx-0 mx-6 sm:ml-16 sm:mb-8 pb-8 sm:pb-0 mt-28 justify-center items-center flex flex-col"
        >
          <div className="text-center text-lightColor">
            <h1>Create new Trip</h1>
            <p>Invite the community</p>
            <p>Explore the world together</p>
          </div>
        </motion.div>
        <div className="sm:col-span-7 col-span-12 shadow-xl sm:mr-16 mb-8 sm:mx-0 mx-6 sm:mt-28 backdrop-blur-sm bg-secondaryColor/80 rounded overflow-y-scroll">
          {/* <Header {...props} router={{ location }} /> */}
          <form className="px-14 py-4" onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ stiffness: 100 }}
            >
              <div className="pb-6">
                <p className="text-gray-700 text-lg mr-7 underline font-bold">
                  Trip Location:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("trip_location")}
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {allLocations.map((location) => (
                    <option value={location._id} key={location._id}>
                      {location.address.spot} - {location.address.state},{" "}
                      {location.address.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Group:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("group_id", {})}
                  value={selectedGroup}
                  onChange={(event) => setSelectedGroup(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {allGroupsInfo.map((group) => (
                    <option value={group._id} key={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Trip Type:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("trip_type", {})}
                  value={selectedTripType}
                  onChange={(event) => setSelectedTripType(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {trip_types.map((trip_type, i) => (
                    <option value={trip_type} key={i}>
                      {trip_type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Expected Expense:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("expected_expense", {})}
                  value={selectedExpense}
                  onChange={(event) => setSelectedExpense(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {expected_expenses.map((expected_expense, i) => (
                    <option value={expected_expense} key={i}>
                      {expected_expense}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Travel Mode:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("travel_mode", {})}
                  value={selectedTravelMode}
                  onChange={(event) =>
                    setSelectedTravelMode(event.target.value)
                  }
                >
                  <option value="">Please select an option</option>
                  {modes_of_travel.map((mode, i) => (
                    <option value={mode} key={i}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Stay:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("stay", {})}
                  value={selectedStay}
                  onChange={(event) => setSelectedStay(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {stays.map((stay, i) => (
                    <option value={stay} key={i}>
                      {stay}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Food:
                </p>
                <select
                  required
                  className="p-3 w-full text-gray-700 bg-secondaryColor rounded"
                  as="select"
                  {...register("food", {})}
                  value={selectedFood}
                  onChange={(event) => setSelectedFood(event.target.value)}
                >
                  <option value="">Please select an option</option>
                  {foods.map((food, i) => (
                    <option value={food} key={i}>
                      {food}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-6">
                <p className="text-gray-700 text-lg underline font-bold mr-7">
                  Planned Date:
                </p>
                <input
                  className="p-3 w-full bg-secondaryColor text-gray-700 rounded"
                  type="date"
                  as="select"
                  {...register("date", {})}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>

              <div className="mt-6">
                <p className="text-gray-700 mb-3 underline font-bold">
                  Other Details:{" "}
                </p>
                <textarea
                  className="h-40 w-full bg-secondaryColor rounded"
                  {...register("other_details", {})}
                  type="text"
                  placeholder="eg: A group focused on party trips...."
                  autoComplete="off"
                  value={selectedDesc}
                  onChange={(event) => setSelectedDesc(event.target.value)}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button className="btn btn--primary" type="submit">
                  Done
                </button>
                {/* <Link className="btn my-5 btn--secondary" to="/signin">
                  Already have an account
                </Link> */}
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewTrip;
