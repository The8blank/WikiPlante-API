const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../database/Mysql.database");

require("dotenv").config();

exports.inscription = (req, res, next) => {
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
        res.status(201).json({ user });
      })
      .catch((err) => {
        return res.status(501).json(err.errors[0].message);
      });
  } catch (err) {
    res.status(404).json(err);
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
      return res.status(404).json({ errors: "Email incorrect / inconnue" });
    }

    // Comparaison du mot de passe de la requete et du compte user trouve
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (!result) {
        return res.status(401).json({ errors: "Mot de passe incorrect" });
      } else {
        token = jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
          expiresIn: "24h",
        });

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(200).json({ user: user.id });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
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
      return res.status(404).json({ error: "user not found." });
    }

    newRecord = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(newRecord);
  } catch (err) {
    res.status(501).json(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users;

    users = await database.user.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ users });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let user;
    let id;
    let userFromToken;
    let newRecord;

    userFromToken = res.locals.user;
    if (!userFromToken) {
      return res.status(401).json({ error: "Vous devez etre connecte." });
    }

    id = req.params.id;

    user = await database.user.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    if (userFromToken.id != user.id || userFromToken.isAdmin) {
      return res.status(401).json({ error: "Requête invalide !" });
    }

    newRecord = {
      ...req.body,
    };

    await user.update(newRecord).then(() => {
      res.status(201).json({ message: "Utilisateur modifie" });
    })
    .catch((err) => {
      res.status(500).json(err)
    })

    
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let user;
    let userFromToken;

    user = await database.user.findByPk(req.params.id);
    userFromToken = res.locals.user;

    if (!userFromToken) {
      return res.status(401).json({ error: "Vous devez etre connecte." });
    }

    // Conpare le proprietaire du compte en database avec l'initiateur de la requete
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable." });

    if (user.id != userFromToken.id || userFromToken.isAdmin)
      return res.status(400).json({ message: "Requête invalide !" });

    await user.destroy();

    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression", err });
  }
};

exports.deconnexion = async (req, res, next) => {
  //renvoie un cookie qui s'efface directement
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
