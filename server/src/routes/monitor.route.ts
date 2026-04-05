import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import {
  addMonitor,
  changeIncidentStatus,
  changeStatus,
  deleteMonitor,
  findIncidentData,
  findIncidents,
  findMonitors,
  monitorDetails,
  monitorSSE,
  pingData,
} from "../controllers/monitor.controller.js";

export const monitorRouter = Router();

monitorRouter.get("/", authMiddleware, findMonitors);
monitorRouter.post("/add", authMiddleware, addMonitor);
monitorRouter.get("/details/:monitorId", authMiddleware, monitorDetails);
monitorRouter.get("/ping-data/:monitorId", authMiddleware, pingData);
monitorRouter.delete("/remove/:monitorId", authMiddleware, deleteMonitor);
monitorRouter.patch("/change-status", authMiddleware, changeStatus);
monitorRouter.get("/incidents", authMiddleware, findIncidents);
monitorRouter.get("/incidents/:incidentId", authMiddleware, findIncidentData);
monitorRouter.put(
  "/incidents-update-status/:incidentId",
  authMiddleware,
  changeIncidentStatus,
);

monitorRouter.get("/stream/:monitorId", authMiddleware, monitorSSE);
