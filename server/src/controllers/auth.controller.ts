import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

import { client } from "../lib/google-config.js";
import { prisma } from "../lib/prisma.js";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    console.log("signup endpoint");
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        error: "Signup failed try again!",
      });
    }
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      return res.status(400).json({ error: "No id_token received" });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ error: "Google Client ID not configured" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const { email, name, picture } = payload;
    if (!email || !name || !picture)
      return res.status(400).json({ error: "Signup failed try again!" });
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
      secure: true, //process.env.NODE_ENV == "prod",
      sameSite: "none",
      path: "/",
      maxAge: 1000 * 60 * 60 * 480,
    });
    return res.status(200).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: "Internal server error",
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

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
