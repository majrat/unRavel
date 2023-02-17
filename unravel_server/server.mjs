import express from "express";
import cors from "cors";
import config from "./config/index.mjs";
import db from "./config/db.mjs";
import userRouter from "./api/user.mjs";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

db(config.MONGO_URI);

app.use(cors({ origin: true }));

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "20mb" }));
//Socket IO
const socketIO = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// api routes
app.use("/api/user", userRouter);

server.listen(config.PORT, () => {
  console.log(`App listening on PORT ${config.PORT}`);
});
