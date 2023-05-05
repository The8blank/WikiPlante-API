"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagesPlantes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ImagesPlantes.belongsTo(models.Plantes, {
        foreignKey: "planteId",
        as: "plante",
      });
    }
  }
  ImagesPlantes.init(
    {
      description: DataTypes.STRING,
      planteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url : DataTypes.STRING
    },
    {
      sequelize,
      modelName: "ImagesPlantes",
    }
  );
  return ImagesPlantes;
};
