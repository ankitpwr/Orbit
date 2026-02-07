import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import {
  addMonitor,
  deleteMonitor,
  findMonitors,
} from "../controllers/monitor.controller.js";

export const monitorRouter = Router();

monitorRouter.post("/add", authMiddleware, addMonitor);
monitorRouter.delete("/remove/:monitorId", authMiddleware, deleteMonitor);
monitorRouter.get("/", authMiddleware, findMonitors);
