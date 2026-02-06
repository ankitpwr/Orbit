import type { Request, Response } from "express";
import type { CustomRequest } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import { MonitorStatus } from "../generated/prisma/enums.js";
import { Prisma } from "../generated/prisma/client.js";

export const addMonitor = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const { name, url } = req.body;
    const newMonitor = await prisma.monitor.create({
      data: {
        userId: id,
        name: name,
        url: url,
      },
    });
    return res.status(200).json({
      id: newMonitor.id,
      name: newMonitor.name,
      url: newMonitor.url,
      createdAt: newMonitor.createdAt,
      status: newMonitor.status,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          error: "URL Already Exist",
        });
      } else {
        return res.status(400).json({
          error: "Failed to Add Monitor",
        });
      }
    }
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deleteMonitor = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const monitorId = String(req.params.monitorId);
    if (!monitorId) {
      return res.status(400).json({
        error: "Monitor ID Required!",
      });
    }

    await prisma.monitor.delete({
      where: {
        id: monitorId,
        userId: id,
      },
    });

    return res.status(200).json({
      message: "Monitor Removed Successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          error: "Monitor Does Not Exist",
        });
      } else {
        return res.status(400).json({
          error: "Failed to Remove the Monitor!",
        });
      }
    }
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
