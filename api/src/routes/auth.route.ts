import express, { Router } from "express";
import {
  googleAuth,
  logout,
  userDetails,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../lib/middleware.js";

const authRouter = Router();

authRouter.post("/google", googleAuth);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/me", authMiddleware, userDetails);

export default authRouter;
