const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../models");

require("dotenv").config();

exports.inscription = async (req, res, next) => {
  try {
    let user;

    user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    database.user
      .create(user)
      .then((user) => {
        res.status(201).json({ userId: user.id });
      })
      .catch((err) => {
        res.status(400).json({ error: err.stack });
      });
  } catch (err) {
    next(err);
  }
};

exports.connexion = async (req, res, next) => {
  try {
    let user;
    let token;

    user = await database.user.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email incorrect / inconnue" });
    }

    // Comparaison du mot de passe de la requete et du compte user trouve
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (!result) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      } else {
        token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
          expiresIn: "24h",
        });

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(200).json({ userId: user.id });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    let id;
    let user;
    let newRecord;

    id = req.params.id;

    user = await database.user.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    newRecord = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({ user: newRecord });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users;

    users = await database.user.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ users: users });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user;
    let id;
    let newRecord;

    id = req.params.id;

    user = await database.user.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    newRecord = {
      ...req.body,
    };

    user
      .update(newRecord)
      .then((user) => {
        res.status(201).json({ user: user });
      })
      .catch((err) => {
        res.status(400).json({ error: err.stack });
      });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let user;

    user = await database.user.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    await user.destroy();
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (err) {
    next(err);
  }
};

exports.deconnexion = async (req, res, next) => {
  //renvoie un cookie qui s'efface directement
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
