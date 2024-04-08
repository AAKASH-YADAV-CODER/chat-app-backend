import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connect from "./database/index.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import express from "express";
// const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
dotenv.config({
  path: ".env",
});
const port = process.env.PORT || 5000;

//Route Definitions
import userRouter from "./routers/user.router.js";
import messageRouter from "./routers/message.router.js";
import getuserRouter from "./routers/getuser.router.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/getuser", getuserRouter);

server.listen(port, () => {
  connect();
  console.log(`Listening on this port --> ${process.env.PORT}`);
});
