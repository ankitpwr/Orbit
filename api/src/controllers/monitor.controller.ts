import type { Request, Response } from "express";
import type { CustomRequest } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import {
  addMonitorSchema,
  deleteMonitorSchema,
  monitorDetailsSchema,
} from "../lib/zod-schema.js";

export const addMonitor = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const parsedBody = addMonitorSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues,
      });
    }
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
    const parsedParam = deleteMonitorSchema.safeParse(req.params);
    if (!parsedParam.success) {
      return res.status(400).json({
        error: parsedParam.error.issues,
      });
    }
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

export const monitorDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const parsedParam = monitorDetailsSchema.safeParse(req.params);
    if (!parsedParam.success) {
      res.status(400).json({
        error: parsedParam.error.issues,
      });
    }
    const monitorId = String(req.params.monitorId);
    const details = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId: id,
      },
      select: {
        id: true,
        name: true,
        url: true,
        createdAt: true,
        status: true,
      },
    });

    return res.status(200).json({
      details: details,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          error: "Monitor Does Not Exist",
        });
      } else
        return res.status(400).json({
          error: "Failed To Get Monitor Details",
        });
    }
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const findMonitors = async (req: Request, res: Response) => {
  try {
    const { id, email } = req as CustomRequest;
    const monitors = await prisma.monitor.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        name: true,
        url: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(400).json({
      monitors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
