import type { Request, Response } from "express";
import type { CustomRequest } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import { ChannelType, Prisma } from "../generated/prisma/client.js";
import {
  addMonitorSchema,
  monitorStatusSchema,
  paramsSchema,
  pingDataQuerySchema,
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
    const { name, url, email } = req.body;
    const newMonitor = await prisma.$transaction(async () => {
      const data = await prisma.monitor.create({
        data: {
          userId: id,
          name: name,
          url: url,
        },
        select: {
          id: true,
          name: true,
          url: true,
          status: true,
        },
      });

      await prisma.notificationChannel.create({
        data: {
          monitorId: data.id,
          ChannelType: "EMAIL",
          ChannelValue: email,
        },
      });
    });
    return res.status(200).json({
      message: "Monitor Successfully Added",
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
    const parsedParam = paramsSchema.safeParse(req.params);
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
    const parsedParam = paramsSchema.safeParse(req.params);
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

      omit: {
        userId: true,
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
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      monitors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    console.log("in change status!");
    const { monitorId, status } = req.body;
    console.log("data ", monitorId, status);
    const { id } = req as CustomRequest;
    const parsedBody = monitorStatusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues,
      });
    }
    const updatedData = await prisma.monitor.update({
      where: {
        id: monitorId,
      },
      data: {
        status: status,
        statusChangedAt: new Date(),
      },
      omit: {
        userId: true,
      },
    });

    return res.status(200).json({
      updatedData,
    });
  } catch (error) {
    console.log("error ", error);
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

    return res.status(400).json({
      error: "Internal Server Error",
    });
  }
};

export const pingData = async (req: Request, res: Response) => {
  try {
    const parsedParam = paramsSchema.safeParse(req.params);
    const parsedQuery = pingDataQuerySchema.safeParse(req.query);
    if (!parsedParam.success) {
      return res.status(400).json({
        error: parsedParam.error.issues,
      });
    }
    if (!parsedQuery.success) {
      return res.status(400).json({ error: parsedQuery.error.issues });
    }

    const monitorId = String(req.params.monitorId);
    const { days } = parsedQuery.data;
    const date = new Date();
    date.setDate(date.getDate() - days);
    const [data, aggregate] = await prisma.$transaction([
      prisma.pingLog.findMany({
        where: {
          monitorId: monitorId,
          timestamp: {
            gte: date,
          },
        },
        select: {
          timestamp: true,
          latency: true,
          statusCode: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      }),

      prisma.pingLog.aggregate({
        where: {
          monitorId: monitorId,
          timestamp: { gte: date },
        },
        _avg: {
          latency: true,
        },
      }),
    ]);

    return res.status(200).json({
      pingData: data,
      avgLatency: aggregate._avg.latency ?? 0,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
