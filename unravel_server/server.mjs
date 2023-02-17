import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config/index.mjs";
import userRouter from "./api/user.mjs";
import http from "http";
// import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors({}));

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "20mb" }));
//Socket IO
// const socketIO = new Server(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

// socketIO.on("connection", (socket) => {
//   console.log(`${socket.id} user just connected!`);
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// api routes
app.use("/api/user", userRouter);

mongoose
  .connect(config.MONGO_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoose.set("strictQuery", false);

    const db = mongoose.connection;

    db.on("connected", function () {
      console.log("Success: MongDB Connected");
    });
    db.on(
      "error",
      console.error.bind(console, "Error: MongoDB connection error:")
    );
  })
  .then(() =>
    server.listen(config.PORT, () => {
      console.log(`App listening on PORT ${config.PORT}`);
    })
  );
