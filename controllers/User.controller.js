const jwt = require("jsonwebtoken");
const db = require("../models");
const {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
} = require("../services/User.service");

require("dotenv").config();

exports.inscription = async (req, res, next) => {
  try {
    let user;

    user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    createUser(user)
      .then((user) => {
        res.status(201).json({
          success: true,
          message: "Utilisateur cree",
          data: user.purge(),
        });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

exports.connexion = async (req, res, next) => {
  try {
    let user;
    let token;

    const { email, username, password } = req.body;

    user = await getUserByEmail(email);

    if (!user) {
      res.cookie("jwt", "", { maxAge: 1 });
      return res
        .status(404)
        .json({ success: false, message: "Email incorrect / inconnue" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.cookie("jwt", "", { maxAge: 1 });
      return res
        .status(401)
        .json({ success: false, message: "Mot de passe incorrect" });
    }

    token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "24h",
    });

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24,
    });

    res
      .status(200)
      .json({ success: false, data: { user: user.purge(), token: token } });
  } catch (err) {
    next(err);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    let id;
    let user;

    id = req.params.id;

    user = await getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur introuvable." });
    }

    res.status(200).json({ success: true, data: user.purge() });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users;

    users = await getAllUsers();

    res.status(200).json({ success: true, data: { users: users } });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user;
    let id;
    let newRecord;
    let userFromToken;

    id = req.params.id;
    user = await getUserById(id);
    userFromToken = res.locals.user;
    newRecord = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur introuvable." });
    }

    if (userFromToken.id != user.id && !userFromToken.isAdmin) {
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits",
      });
    }

    user = await user.updateUser(newRecord);

    res.status(201).json({ success: true, data: { user: user } });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let user;
    let userFromToken;
    let id;

    id = req.params.id;
    userFromToken = res.locals.user;

    user = await getUserById(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur introuvable." });

    if (userFromToken.id != user.id && !userFromToken.isAdmin) {
      return res.status(498).json({
        success: false,
        message: "Vous n'avez pas les droits",
      });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: "Utilisateur supprimé" });

  } catch (err) {
    next(err);
  }
};

exports.deconnexion = async (req, res, next) => {

  //renvoie un cookie qui s'efface directement

  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send("")
};

exports.getMe = async (req, res, next) => {
  res.status(200).json(res.locals.user)
}
