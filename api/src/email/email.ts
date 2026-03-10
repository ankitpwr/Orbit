import "dotenv/config";
import { render, type EmailElementProps } from "@react-email/components";
import nodemailer from "nodemailer";
import { Email } from "./emailTemplate.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import type { ChannelType } from "../generated/prisma/enums.js";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (
  channelValue: string,
  monitorName: string,
  monitorUrl: string,
  checkedAt: string,
) => {
  try {
    const emailHtml = await render(
      Email({ monitorName, monitorUrl, checkedAt }),
    );
    const info = await transporter.sendMail({
      from: `"Orbit" <${process.env.EMAIL_FROM}>`,
      to: `${channelValue}`,
      subject: "Monitor Is Down",
      text: "your monitor is experiencing down time",
      html: emailHtml,
    });

    console.log("email has been sent!");
  } catch (error) {
    console.log(error);
  }
};
