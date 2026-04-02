import type { Request, Response } from "express";
import type { CustomRequest } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import { ChannelType, Prisma } from "../generated/prisma/client.js";
import {
  addMonitorSchema,
  incidentParamsSchema,
  monitorStatusSchema,
  paramsSchema,
  pingDataQuerySchema,
  updateIncidentStatusSchema,
} from "../lib/zod-schema.js";

export const addMonitor = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const parsedBody = addMonitorSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedBody.error.issues[0]?.message,
      });
    }
    const { name, url, primaryEmail, timezone } = parsedBody.data;
    const newMonitor = await prisma.$transaction(async () => {
      const data = await prisma.monitor.create({
        data: {
          userId: id,
          name: name,
          url: url,
        },
        select: {
          id: true,
        },
      });

      await prisma.notificationChannel.create({
        data: {
          monitorId: data.id,
          channelType: "EMAIL",
          channelValue: primaryEmail,
          priority: 1,
        },
      });

      if (req.body.esacalationEmail1) {
        await prisma.notificationChannel.create({
          data: {
            monitorId: data.id,
            channelType: "EMAIL",
            channelValue: req.body.esacalationEmail1,
            priority: 2,
          },
        });

        if (req.body.esacalationEmail2) {
          await prisma.notificationChannel.create({
            data: {
              monitorId: data.id,
              channelType: "EMAIL",
              channelValue: req.body.esacalationEmail2,
              priority: 3,
            },
          });
        }
      }
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
        message: "Validation failed",
        error: parsedParam.error.issues[0]?.message,
      });
    }
    const { monitorId } = parsedParam.data;

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
      return res.status(400).json({
        message: "Validation failed",
        error: parsedParam.error.issues[0]?.message,
      });
    }
    const { monitorId } = parsedParam.data;
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
    const parsedBody = monitorStatusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedBody.error.issues[0]?.message,
      });
    }
    const { monitorId, status } = parsedBody.data;
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
        message: "Validation failed",
        error: parsedParam.error.issues[0]?.message,
      });
    }
    if (!parsedQuery.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedQuery.error.issues[0]?.message,
      });
    }

    const { monitorId } = parsedParam.data;
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

export const findIncidents = async (req: Request, res: Response) => {
  try {
    const { id } = req as CustomRequest;
    const incidents = await prisma.incident.findMany({
      where: {
        monitor: {
          userId: id,
        },
      },
      select: {
        id: true,
        startedAt: true,
        currentStatus: true,
        monitor: {
          select: { name: true, url: true },
        },
      },
      orderBy: { startedAt: "asc" },
    });

    return res.status(200).json({
      incidents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const findIncidentData = async (req: Request, res: Response) => {
  try {
    const parsedParam = incidentParamsSchema.safeParse(req.params);
    if (!parsedParam.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedParam.error.issues[0]?.message,
      });
    }

    const { incidentId } = parsedParam.data;
    const incidentData = await prisma.incident.findFirst({
      where: { id: incidentId },
      select: {
        startedAt: true,
        resolvedAt: true,
        currentStatus: true,
        lastAlertSentAt: true,
        alertCount: true,
        monitor: { select: { name: true, url: true } },
      },
    });
    return res.status(200).json({
      incidentData: incidentData,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          error: "Incident Does Not Exist",
        });
      } else {
        return res.status(400).json({
          error: "Failed to Find the Incident!",
        });
      }
    }
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const changeIncidentStatus = async (req: Request, res: Response) => {
  try {
    const parsedParam = incidentParamsSchema.safeParse(req.params);
    const parsedBody = updateIncidentStatusSchema.safeParse(req.body);

    if (!parsedParam.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: parsedParam.error.issues[0]?.message,
      });
    }

    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ error: parsedBody.error.issues[0]?.message });
    }

    const { status } = parsedBody.data;
    const { incidentId } = parsedParam.data;
    let data = null;
    if (status == "OPEN") {
      data = await prisma.incident.update({
        where: { id: incidentId },
        data: {
          currentStatus: "OPEN",
          startedAt: new Date(),
          resolvedAt: null,
          alertCount: 0,
          lastAlertSentAt: new Date(),
        },
        select: {
          startedAt: true,
          resolvedAt: true,
          currentStatus: true,
          lastAlertSentAt: true,
          alertCount: true,
          monitor: { select: { name: true, url: true } },
        },
      });
    } else if (status == "ACKNOWLEDGED") {
      data = await prisma.incident.update({
        where: { id: incidentId },
        data: {
          currentStatus: "ACKNOWLEDGED",
        },
        select: {
          startedAt: true,
          resolvedAt: true,
          currentStatus: true,
          lastAlertSentAt: true,
          alertCount: true,
          monitor: { select: { name: true, url: true } },
        },
      });
    } else if (status == "RESOLVED") {
      data = await prisma.incident.update({
        where: { id: incidentId },
        data: {
          currentStatus: "RESOLVED",
          resolvedAt: new Date(),
        },
        select: {
          startedAt: true,
          resolvedAt: true,
          currentStatus: true,
          lastAlertSentAt: true,
          alertCount: true,
          monitor: { select: { name: true, url: true } },
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Status Successfully updated", data: data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(400).json({
          error: "Incident does not exist",
        });
      } else {
        return res.status(400).json({
          error: "Failed to update the status!",
        });
      }
    }
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
