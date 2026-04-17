const queue: any[] = [];

export function addToQueue(job: any) {
  queue.push(job);
}

export function processQueue() {
  setInterval(() => {
    if (queue.length > 0) {
      const job = queue.shift();
      console.log("Processing job:", job);
    }
  }, 1000);
}