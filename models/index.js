const dbConfig = require("../database/database.config");
const {Sequelize} = require("sequelize");
const User = require("./User.model")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: dbConfig.operatorsAliases,
  logging : false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.user = require("./User.model.js")(sequelize, Sequelize);

module.exports = database;
