const metricsMiddleware = (req, res, next) => {
  const startTime = process.hrtime();
  const startMemory = process.memoryUsage();
  const startCPU = process.cpuUsage();

  res.on("finish", () => {
    const endTime = process.hrtime(startTime);
    const endMemory = process.memoryUsage();
    const endCPU = process.cpuUsage(startCPU);

    const responseTime = (endTime[0] * 1e3 + endTime[1] / 1e6).toFixed(2);

    const memoryUsed = {
      rss: ((endMemory.rss - startMemory.rss) / 1024 / 1024).toFixed(2),
      heapUsed: (
        (endMemory.heapUsed - startMemory.heapUsed) /
        1024 /
        1024
      ).toFixed(2),
      heapTotal: (
        (endMemory.heapTotal - startMemory.heapTotal) /
        1024 /
        1024
      ).toFixed(2),
    };

    const cpuUsed = {
      user: (endCPU.user / 1000).toFixed(2),
      system: (endCPU.system / 1000).toFixed(2),
    };

    console.log(
      `
🚀 ${req.method} ${req.originalUrl}
⏱️ Time: ${responseTime} ms
🧠 Memory (MB):`,
      memoryUsed,
      `
⚙️ CPU (ms):`,
      cpuUsed,
      `
📦 Status: ${res.statusCode}
    `,
    );
  });

  next();
};

export default metricsMiddleware;
