const db = require("../models");

exports.createUser = async (newRecord) => {
  const user = await db.Users.create(newRecord);

  return user;
};

exports.getUserByEmail = async (email) => {
    const user = await db.Users.findOne({
        where: { email },
      });

    return user
}

exports.getUserById = async (id) => {
    const user = await db.Users.findByPk(id, {
        include: [
          {
            model: db.Plantes,
            include: "images",
          },
        ],
      });

    return user
}

exports.getAllUsers = async (id) => {
    const users = await db.Users.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.Plantes,
            include: "images",
          },
        ],
      });

    return users
}

