import axios from "axios";
import config from "../utils/constants";

export async function getLocationsWithPhotos() {
  const res = await axios.get(`${config.VITE_SERVER_API}/get_all_location`);

  if (res.data) {
    return res.data.filter(
      (location) =>
        location &&
        location?.images &&
        location?.images?.photos &&
        location?.images?.photos.length != 0
    );
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
}
