import Card from "./Card";

function SearchList({ filteredTrips }) {
  const filtered = filteredTrips.map((trip) => (
    <Card key={trip?._id} trip={trip} />
  ));
  return <div>{filtered}</div>;
}

export default SearchList;
