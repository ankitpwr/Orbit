export interface MonitorDownEmailProps {
  monitorName: string;
  monitorUrl: string;
  checkedAt: string;
}

export function generateMonitorDownEmail({
  monitorName,
  monitorUrl,
  checkedAt,
}: MonitorDownEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 Monitor Down</title>
</head>
<body style="background-color: #f6f9fc; font-family: Arial, sans-serif; margin: 0; padding: 20px;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    🚨 ${monitorName} is DOWN
  </div>

  <div style="background-color: #ffffff; margin: 0 auto; padding: 24px; border-radius: 8px; max-width: 480px;">
    <h1 style="font-size: 22px; margin-bottom: 16px; margin-top: 0; color: #111827;">
      🚨 Monitor Down
    </h1>

    <p style="font-size: 14px; color: #374151; margin-top: 0; line-height: 1.5;">
      Your monitor <strong>${monitorName}</strong> is currently 
      <span style="color: #dc2626; font-weight: bold;">DOWN</span>.
    </p>

    <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin-top: 16px; margin-bottom: 16px;">
      <p style="font-size: 12px; color: #6b7280; margin-bottom: 2px; margin-top: 0;">Monitor</p>
      <p style="font-size: 14px; margin-bottom: 12px; margin-top: 0; font-weight: bold; color: #111827;">${monitorName}</p>

      <p style="font-size: 12px; color: #6b7280; margin-bottom: 2px; margin-top: 0;">URL</p>
      <p style="font-size: 14px; margin-bottom: 12px; margin-top: 0; font-weight: bold; color: #111827;">
        <a href="${monitorUrl}" style="color: #111827; text-decoration: none;">${monitorUrl}</a>
      </p>

      <p style="font-size: 12px; color: #6b7280; margin-bottom: 2px; margin-top: 0;">Checked At</p>
      <p style="font-size: 14px; margin-bottom: 0; margin-top: 0; font-weight: bold; color: #111827;">${String(checkedAt)}</p>
    </div>

    <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 24px; margin-bottom: 12px;" />

    <p style="font-size: 12px; color: #9ca3af; margin-top: 0; margin-bottom: 0; line-height: 1.5;">
      You are receiving this alert because downtime notifications are enabled for this monitor.
    </p>
  </div>
</body>
</html>
  `.trim();
}
