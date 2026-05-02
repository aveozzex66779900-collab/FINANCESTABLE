"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = audit;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auditFile = path_1.default.join(__dirname, "../logs/audit.log");
function audit(userId, action) {
    const time = new Date().toISOString();
    fs_1.default.appendFileSync(auditFile, `[${time}] USER:${userId} ACTION:${action}\n`);
}
