import { google } from "googleapis";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

import { oauth2Client } from "../lib/google-config.js";
import { prisma } from "../lib/prisma.js";
import type { CustomRequest } from "../lib/middleware.js";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    console.log("signup endpoint");
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        error: "google signup failed try again!",
      });
    }
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth.userinfo.get();

    const { email, picture, name } = userInfo.data;
    if (!email || !name || !picture)
      return res.status(400).json({ error: "google signup failed try again!" });
    let user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          picture: picture,
        },
      });
    }

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET!, {
      expiresIn: "20d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "prod",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 480,
    });
    res.status(200).json({
      message: "signup successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "prod",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    res.status(200).json({
      message: "logout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
