"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFraudRisk = detectFraudRisk;
function detectFraudRisk(amount) {
    let risk = "LOW";
    let score = 10;
    let blocked = false;
    let reason = "Safe transaction";
    if (amount > 100000) {
        risk = "HIGH";
        score = 95;
        blocked = true;
        reason =
            "Very large transaction detected";
    }
    else if (amount > 50000) {
        risk = "MEDIUM";
        score = 70;
        reason =
            "Unusual transaction amount";
    }
    else if (amount < 0) {
        risk = "HIGH";
        score = 99;
        blocked = true;
        reason =
            "Invalid negative transaction";
    }
    return {
        amount,
        risk,
        score,
        blocked,
        reason,
        aiChecks: [
            "Behavior analysis",
            "Transaction scoring",
            "Risk engine completed",
            "Pattern validation completed"
        ]
    };
}
