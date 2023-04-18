"use strict";
const { Sequelize } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plantes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plantes.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
      });

      Plantes.hasMany(models.ImagesPlantes, {
        foreignKey: "planteId",
        as: "images",
        onDelete: "CASCADE",
      });
    }
  }
  Plantes.init(
    {
      nom_commun: {
        type: Sequelize.STRING,
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      espece: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      sous_espece_cultivar: {
        type: Sequelize.STRING,
      },
      famille: {
        type: Sequelize.STRING,
      },
      ordre: {
        type: Sequelize.STRING,
      },
      categorie: {
        type: Sequelize.STRING,
      },
      port: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
    },
    {
      sequelize,
      modelName: "Plantes",
      validate: {
        uniqueGenreEspece() {
          return Plantes.findOne({
            where: {
              genre: this.genre,
              espece: this.espece,
            },
          }).then((plante) => {
            if (
              plante &&
              (this.isNewRecord ||
                this.changed("genre") ||
                this.changed("espece"))
            ) {
              throw new Error("Genre and Espece combination must be unique");
            }
          });
        },
      },
    }
  );
  return Plantes;
};
