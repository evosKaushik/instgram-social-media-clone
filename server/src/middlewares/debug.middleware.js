const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    if (process.env.NODE_ENV === "development") {
      console.log({
        route: req.originalUrl,
        status: res.statusCode,
        time: `${Date.now() - start}ms`
      });
    }
  });

  next();
};

export default metricsMiddleware;