import type { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  res.send("signup is successful");
};
export const signin = (req: Request, res: Response) => {
  res.send("sigin is successful");
};
export const userDetails = (req: Request, res: Response) => {
  res.send("userDetails is successful");
};
