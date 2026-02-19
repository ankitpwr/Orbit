import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import {
  addMonitor,
  changeStatus,
  deleteMonitor,
  findMonitors,
  monitorDetails,
} from "../controllers/monitor.controller.js";

export const monitorRouter = Router();

monitorRouter.post("/add", authMiddleware, addMonitor);
monitorRouter.delete("/remove/:monitorId", authMiddleware, deleteMonitor);
monitorRouter.get("/details/:monitorId", authMiddleware, monitorDetails);
monitorRouter.patch("/change-status", authMiddleware, changeStatus);
monitorRouter.get("/", authMiddleware, findMonitors);
