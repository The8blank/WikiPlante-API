const jwt = require("jsonwebtoken");
const db = require("../models");

require("dotenv").config();

exports.inscription = async (req, res, next) => {
  try {
    let user;

    user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    db.Users.create(user)
      .then((user) => {
        res.status(201).json({ userId: user.id });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  } catch (err) {
    next(err);
  }
};

exports.connexion = async (req, res, next) => {
  try {
    let user;
    let token;

    user = await db.Users.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email incorrect / inconnue" });
    }

    const isPasswordValid = await user.comparePassword(req.body.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "24h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ userId: user.id });
  } catch (err) {
    next(err);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    let id;
    let user;

    id = req.params.id;

    user = await db.Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    res.status(200).json({ user: user.purge() });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users;

    users = await db.Users.findAll({
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

    user = await db.Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    newRecord = {
      ...req.body,
    };

    // Appeler la méthode updateUser du modèle Users pour mettre à jour l'utilisateur
    user = await user.updateUser(newRecord);

    res.status(201).json({ user: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let user;

    user = await db.Users.findByPk(req.params.id);
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
