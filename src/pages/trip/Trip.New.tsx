// /trips/new → the New Tag form locked to the "Business trip" category
// (one form for all tag types lives in Tag.New.tsx → POST /users/tag/new)
import NewTag from "../Tag.New";

const NewTrip = () => <NewTag defaultType="trip" />;

export default NewTrip;
