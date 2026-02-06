import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import { addMonitor } from "../controllers/monitor.controller.js";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport/index.js";

const monitorRouter = Router();

monitorRouter.post("/add", authMiddleware, addMonitor);
monitorRouter.delete("/remove/:monitorId", authMiddleware);
