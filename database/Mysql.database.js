const { Sequelize } = require("sequelize");
require("dotenv").config();

const { UserModel, RoleModel } = require("../models");

// Creation de la connexion a la database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false
  }
);

// Definition de la base de donnee
const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.user = database.sequelize.define("users", UserModel);

module.exports = database;
