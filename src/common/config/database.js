const { Sequelize } = require("sequelize");
const envVars = require("./envVars");

const sequelize = new Sequelize(envVars.DB_NAME, envVars.DB_USER, envVars.DB_PASSWORD, {
  host: envVars.DB_HOST,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
