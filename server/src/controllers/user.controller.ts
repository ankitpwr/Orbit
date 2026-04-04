import type { Request, Response } from "express";
import type { CustomRequest } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import { updateUserDetailsSchema } from "../lib/zod-schema.js";
import { Prisma } from "../generated/prisma/client.js";

export const userDetails = async (req: Request, res: Response) => {
  try {
    const { id, email } = req as CustomRequest;
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      omit: {
        id: true,
      },
    });
    if (!user)
      return res.status(400).json({
        error: "Failed to get the user details",
      });

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const parsedData = updateUserDetailsSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedData.error.issues[0]?.message,
      });
    }
    const { name, timezone } = parsedData.data;
    const { id } = req as CustomRequest;
    await prisma.user.update({
      where: { id: id },
      data: {
        name: name,
        timezone: timezone,
      },
    });

    return res.status(200).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          error: "User Does Not Exist",
        });
      } else {
        return res.status(400).json({
          error: "Failed to update",
        });
      }
    }
    return res.status(400).json({
      error: "Internal Server Error",
    });
  }
};
