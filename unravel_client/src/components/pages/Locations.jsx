import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../utils/constants";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  async function getAllLocations() {
    await axios
      .get(`${config.VITE_SERVER_API}/get_all_location`)
      .then((res) => {
        if (res.data) {
          setLocations(res.data);
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
  useEffect(() => {
    getAllLocations();
  }, []);

  return (
    <>
      {!locations || locations?.length === 0 ? (
        <div className="circle-ripple unravel_loading"></div>
      ) : (
        <div className="mt-24 mx-3 sm:mx-8 sm:grid sm:grid-cols-12">
          {locations.map((location) => (
            <div className="col-span-4 mx-2 my-5 w-[96%] h-72 bg-black relative">
              <img
                src={
                  location?.images?.photos[0]?.src?.portrait ||
                  "/group_default_profile.jpg"
                }
                className="w-full object-cover h-72"
                alt="grpImg"
              />
              <p className="absolute bottom-0 p-1 bg-secondaryColor/80 backdrop-blur w-full truncate">
                {location?.address?.spot}{" "}
                <span className="text-xs ml-2">
                  {location?.address?.city} {location?.address?.state}{" "}
                  {location?.address?.country}
                </span>
              </p>
              <p className="absolute top-0 p-1 bg-accentColor/60 text-xs">
                posted by {location?.location_added_by?.first_name}{" "}
                {location?.location_added_by?.last_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
