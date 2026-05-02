"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFraud = detectFraud;
function detectFraud(amount) {
    let risk = "SAFE";
    let score = 5;
    let reason = "Normal transaction";
    if (amount > 10000) {
        risk = "MEDIUM";
        score = 55;
        reason = "Large transaction amount";
    }
    if (amount > 50000) {
        risk = "HIGH";
        score = 88;
        reason = "Unusual high-value payment";
    }
    if (amount > 100000) {
        risk = "CRITICAL";
        score = 98;
        reason = "Potential financial fraud detected";
    }
    return {
        success: true,
        risk,
        score,
        reason
    };
}
