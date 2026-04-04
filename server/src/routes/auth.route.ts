import express, { Router } from "express";
import { googleAuth, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../lib/middleware.js";

const authRouter = Router();

authRouter.post("/google", googleAuth);
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
