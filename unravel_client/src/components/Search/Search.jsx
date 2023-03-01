import { useState } from "react";
import Scroll from "./Scroll";
import SearchList from "./SearchList";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { setShowSearch } from "../../features/showSearch/showSearchSlice";

function Search({ details }) {
  const [searchField, setSearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const dispatch = useDispatch();
  function handleSearchModal() {
    dispatch(setShowSearch());
  }
  const filteredTrips = details.filter((trip) => {
    return (
      trip?.trip_location?.address?.spot
        .toLowerCase()
        .includes(searchField.toLowerCase()) ||
      trip?.trip_location?.address?.state
        .toLowerCase()
        .includes(searchField.toLowerCase()) ||
      trip?.trip_location?.address?.country
        .toLowerCase()
        .includes(searchField.toLowerCase()) ||
      trip?.trip_location?.address?.city
        .toLowerCase()
        .includes(searchField.toLowerCase())
    );
  });

  const handleChange = (e) => {
    setSearchField(e.target.value);
    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
    }
  };

  function searchList() {
    if (searchShow) {
      return (
        <Scroll>
          <SearchList filteredTrips={filteredTrips} />
        </Scroll>
      );
    }
  }

  return (
    <section className="absolute z-50 bg-lightColor/60 backdrop-blur-xl rounded-xl shadow-xl inset-x-[5%] top-[15%] bottom-[6%]">
      <XMarkIcon
        onClick={handleSearchModal}
        className="h-8 w-8 my-3 text-center text-lg absolute right-3 text-orange-600 cursor-pointer"
        aria-hidden="true"
      />

      <div className="my-3 text-center text-lg">
        <h2 className="">Search Trips</h2>
      </div>
      <div className="text-center mb-5">
        <input
          className="w-[80vw] h-[4vh] sm:h-[8vh] rounded-xl px-4"
          type="search"
          placeholder="Search Trips"
          onChange={handleChange}
        />
      </div>
      {searchList()}
    </section>
  );
}

export default Search;
