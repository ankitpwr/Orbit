import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface MonitorDownEmailProps {
  monitorName: string;
  monitorUrl: string;
  downSince: string;
}

export function Email({
  monitorName,
  monitorUrl,
  downSince,
}: MonitorDownEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🚨 {monitorName} is DOWN</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🚨 Monitor Down</Heading>
          <Text style={text}>
            Your monitor <strong>{monitorName}</strong> is currently{" "}
            <span style={{ color: "#dc2626", fontWeight: "bold" }}>DOWN</span>.
          </Text>
          <Section style={card}>
            <Text style={label}>Monitor</Text>
            <Text style={value}>{monitorName}</Text>

            <Text style={label}>URL</Text>
            <Text style={value}>{monitorUrl}</Text>

            <Text style={label}>Down Since</Text>
            <Text style={value}>{String(downSince)}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            You are receiving this alert because downtime notifications are
            enabled for this monitor.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/* Styles */

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "8px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "22px",
  marginBottom: "16px",
  color: "#111827",
};

const text = {
  fontSize: "14px",
  color: "#374151",
};

const card = {
  backgroundColor: "#f3f4f6",
  padding: "16px",
  borderRadius: "6px",
  marginTop: "16px",
  marginBottom: "16px",
};

const label = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "2px",
};

const value = {
  fontSize: "14px",
  marginBottom: "12px",
  fontWeight: "bold",
  color: "#111827",
};

const button = {
  backgroundColor: "#dc2626",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block",
  marginTop: "12px",
};

const divider = {
  marginTop: "24px",
  marginBottom: "12px",
};

const footer = {
  fontSize: "12px",
  color: "#9ca3af",
};
