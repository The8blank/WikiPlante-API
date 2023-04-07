"use strict";
const { Model, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }

    purge() {
      const user = this.toJSON();
      delete user.password;
      return user;
    }
    static associate(models) {
      // define association here
    }

    /**
     * Mettre à jour les informations d'un utilisateur
     * @param {Object} newData - Les nouvelles données de l'utilisateur
     * @returns {Promise<Users>} - L'instance mise à jour de l'utilisateur
     */
    async updateUser(newData) {
      // Mettre à jour les attributs de l'instance avec les nouvelles données
      this.username = newData.username || this.username;
      this.email = newData.email || this.email;
      this.password = newData.password ? newData.password : this.password;
      this.isAdmin =
        newData.isAdmin !== undefined ? newData.isAdmin : this.isAdmin;

      // Enregistrer les modifications dans la base de données
      await this.save();

      // Retourner l'instance mise à jour
      return this;
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique : true
      },
      password: {
        type: Sequelize.STRING(1024),
        allowNull: false,
        set(value) {
          this.setDataValue("password", bcrypt.hashSync(value, 15));
        },
      },
      isAdmin: {
        type : DataTypes.BOOLEAN,
        defaultValue : false
      }
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  /* Users.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  }; */

  return Users;
};
