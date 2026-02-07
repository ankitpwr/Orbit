import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  id: string;
  email: string;
}

export interface CustomPayload extends JwtPayload {
  id: string;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("cookie are ", req.cookies);
    const token = req.cookies.token;
    if (!token) {
      res.status(400).json({
        error: "Invalid User , Token is not present",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as CustomPayload;
    if (!decode || !decode.email || !decode.id)
      res.status(401).json({
        error: "Please Signup!",
      });
    (req as CustomRequest).id = decode.id;
    (req as CustomRequest).email = decode.email;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
