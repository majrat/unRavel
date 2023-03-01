import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setShowSearch } from "../../features/showSearch/showSearchSlice";

function Card({ trip }) {
  const dispatch = useDispatch();
  function handleSearchModal() {
    dispatch(setShowSearch());
  }
  return (
    <Link
      onClick={handleSearchModal}
      to="/trips"
      state={trip?._id}
      className="sm:text-base text-xs flex sm:mx-48 mx-3 sm:mb-12 mb-6 bg-secondaryColor/60 p-3 rounded-xl"
    >
      <img
        className="sm:w-20 sm:h-20 w-16 h-16 rounded-full"
        alt={trip?.group_id?.name}
        src={trip?.group_id?.group_profile || "/group_default_profile.jpg"}
      />
      <div className="flex flex-col text-start justify-between my-3 mx-3">
        <h2 className="font-semibold sm:text-lg">{trip?.group_id?.name}</h2>
        <p>To: {trip?.trip_location?.address?.spot}</p>
      </div>
      <div className="flex flex-col text-end justify-between my-3 mx-3">
        <p>{trip?.participants.length} travellers joined</p>
        <p>status: {trip?.trip_status}</p>
      </div>
    </Link>
  );
}

export default Card;
