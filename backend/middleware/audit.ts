import fs from "fs";
import path from "path";

const auditFile = path.join(__dirname, "../logs/audit.log");

export function audit(userId: string, action: string) {
  const time = new Date().toISOString();
  fs.appendFileSync(auditFile, `[${time}] USER:${userId} ACTION:${action}\n`);
}