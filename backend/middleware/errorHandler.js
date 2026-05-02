"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const logger_1 = require("../utils/logger");
const globalErrorHandler = (err, req, res, next) => {
    logger_1.logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
exports.globalErrorHandler = globalErrorHandler;
