import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { monitorRouter } from "./routes/monitor.route.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/monitor", monitorRouter);

app.listen(3001);
