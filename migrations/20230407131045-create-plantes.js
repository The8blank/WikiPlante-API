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
        type: Sequelize.STRING,
      },
      genre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      espece: {
        allowNull: false,
        type: Sequelize.STRING,
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
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("Plantes", {
      fields: ["genre", "espece"],
      type: "unique",
      name: "unique_genre_espece",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Plantes", "unique_genre_espece");
    await queryInterface.dropTable("Plantes");
  },
};
