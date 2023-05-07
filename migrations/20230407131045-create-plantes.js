"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Plantes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nom_commun: {
        type: Sequelize.TEXT,
      },
      genre: {
        allowNull: false,
        type: Sequelize.TEXT,
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
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      public : {
        type : Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Plantes");
  },
};
