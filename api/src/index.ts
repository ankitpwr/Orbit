import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { monitorRouter } from "./routes/monitor.route.js";
import userRoute from "./routes/user.route.js";
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/monitor", monitorRouter);
app.use("/api/v1/user", userRoute);
app.get("/health-check", async (req, res) => {
  try {
    console.log("hit on health check");

    return res.status(200).json({
      message: "All Good!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(3001, () => {
  console.log("up and running");
});
