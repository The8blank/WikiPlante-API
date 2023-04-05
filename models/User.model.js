const bcrypt = require("bcrypt")

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("Users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    username: {
      type: Sequelize.STRING(50),
      trim: true,
      lowercase: true,
      allowNull: false,
      validate: {
        len: [6,40], 
      },
    },

    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      primaryKey: true,
      trim: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: Sequelize.STRING(1024),
      allowNull: false,
      set(value) {
        this.setDataValue("password", bcrypt.hashSync(value, 15));
      },
    },

    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return User;
};
