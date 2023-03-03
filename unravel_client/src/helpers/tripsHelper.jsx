import axios from "axios";
import config from "../utils/constants";
import Swal from "sweetalert2";

export const getTheTrip = async (link_trip_id) => {
  const res = await axios.get(`${config.UNRAVEL_SERVER_API}/get_the_trip`, {
    params: {
      tripId: link_trip_id,
    },
  });
  if (res?.data) {
    return res?.data;
  } else {
    Swal.fire({
      title: "No trips found in the database",
      text: "No trips data found. Database empty",
      icon: "warning",
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
    });
  }
};

export const getAllTrips = async (groupIds) => {
  const res = await axios.get(`${config.UNRAVEL_SERVER_API}/get_all_trips`, {
    params: {
      groupIds: groupIds,
    },
  });

  if (res?.data) {
    return res?.data;
  } else {
    Swal.fire({
      title: "No trips found in the database",
      text: "No trips data found. Database empty",
      icon: "warning",
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
    });
  }
};
