import express, { Router } from "express";
import { authMiddleware } from "../lib/middleware.js";
import {
  updateUserDetails,
  userDetails,
} from "../controllers/user.controller.js";
const userRoute = Router();

userRoute.get("/me", authMiddleware, userDetails);
userRoute.put("/update-user-details", authMiddleware, updateUserDetails);

export default userRoute;
