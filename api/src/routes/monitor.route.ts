import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import {
  addMonitor,
  changeStatus,
  deleteMonitor,
  findIncidentData,
  findIncidents,
  findMonitors,
  monitorDetails,
  pingData,
} from "../controllers/monitor.controller.js";

export const monitorRouter = Router();

monitorRouter.post("/add", authMiddleware, addMonitor);
monitorRouter.delete("/remove/:monitorId", authMiddleware, deleteMonitor);
monitorRouter.get("/details/:monitorId", authMiddleware, monitorDetails);
monitorRouter.patch("/change-status", authMiddleware, changeStatus);
monitorRouter.get("/ping-data/:monitorId", authMiddleware, pingData);
monitorRouter.get("/", authMiddleware, findMonitors);
monitorRouter.get("/incidents", authMiddleware, findIncidents);
monitorRouter.get("/incidents/:incidentId", authMiddleware, findIncidentData);
