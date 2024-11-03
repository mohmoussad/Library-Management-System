const { CustomError } = require("./errorHandler");
const redisClient = require("../config/redis");

const rateLimiter = (timeWindowSize = 15 * 60 * 1000, maxRequests = 100) => {
  return async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    const key = `rate-limit:${ip}`;

    redisClient.get(key, (err, data) => {
      if (err) {
        return next(CustomError());
      }

      const requestData = data ? JSON.parse(data) : { count: 0, startTime: currentTime };

      if (currentTime - requestData.startTime > timeWindowSize) {
        requestData.count = 1;
        requestData.startTime = currentTime;
      } else {
        requestData.count += 1;
      }

      if (requestData.count > maxRequests) {
        next(new CustomError({ type: "RateLimitExceeded" }));
      }

      redisClient.set(key, JSON.stringify(requestData), "EX", Math.floor(timeWindowSize / 1000));
      next();
    });
  };
};

module.exports = rateLimiter;
