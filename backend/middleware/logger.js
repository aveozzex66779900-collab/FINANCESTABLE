"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(__dirname, "../logs");
const logFile = path_1.default.join(logDir, "app.log");
// ✅ Create folder if not exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
function log(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs_1.default.appendFileSync(logFile, logMessage);
}
