const app = require("./app");
const cron = require("node-cron");
const sequelize = require("./common/config/database");
const envVars = require("./common/config/envVars");
const borrowingsService = require("./borrowings/service");

const PORT = envVars.port || 5000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database connected successfully.");

    cron.schedule("0 0 * * *", async () => {
      console.log("checkOverdueBorrowings job started", new Date());
      await borrowingsService.checkOverdueBorrowings();
      console.log("checkOverdueBorrowings job finished", new Date());
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
}

startServer();
