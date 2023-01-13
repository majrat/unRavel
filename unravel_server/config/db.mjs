import mongoose from "mongoose";

export default function (connectionString) {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set("strictQuery", false);

  const db = mongoose.connection;

  db.on("connected", function () {
    console.log("Success: MongDB Connected");
  });

  db.on(
    "error",
    console.error.bind(console, "Error: MongoDB connection error:")
  );
}
