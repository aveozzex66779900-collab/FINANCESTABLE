import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "app.log");

// ✅ Create folder if not exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function log(message: string) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFileSync(logFile, logMessage);
}