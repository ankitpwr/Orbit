import express, { Router } from "express";
import { signup, signin, userDetails } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/user-details", userDetails);

export default authRouter;
