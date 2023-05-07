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
        type: Sequelize.TEXT,
      },
      genre: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      espece: {
        type: Sequelize.TEXT,
      },
      sous_espece_cultivar: {
        type: Sequelize.TEXT,
      },
      famille: {
        type: Sequelize.TEXT,
      },
      ordre: {
        type: Sequelize.TEXT,
      },
      categorie: {
        type: Sequelize.TEXT,
      },
      port: {
        type: Sequelize.TEXT,
      },
      couleur_feuillage: {
        type: Sequelize.TEXT,
      },
      couleur_floraison: {
        type :Sequelize.TEXT,
      },
      periode_floraison: {
        type : Sequelize.TEXT,

      },
      description_feuillage: {
        type : Sequelize.TEXT
      },
      description_floraison:{
        type : Sequelize.TEXT
      },
      description_fruit: {
        type : Sequelize.TEXT
      },
      exposition: {
        type : Sequelize.TEXT,
      },
      sol : {
        type : Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT,
      },
      public : {
        type : Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
    },
    {
      sequelize,
      modelName: "Plantes",
      /* validate: {
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
      }, */
    }
  );
  return Plantes;
};
