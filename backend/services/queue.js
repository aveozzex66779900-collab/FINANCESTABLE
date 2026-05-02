"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToQueue = addToQueue;
exports.processQueue = processQueue;
const queue = [];
function addToQueue(job) {
    queue.push(job);
}
function processQueue() {
    setInterval(() => {
        if (queue.length > 0) {
            const job = queue.shift();
            console.log("Processing job:", job);
        }
    }, 1000);
}
