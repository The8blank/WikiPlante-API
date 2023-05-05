var validator = require("validator");

exports.validationInscription = async (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({erreur : "La response doit contenir les champs username, email, password."})
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ erreur: "Mail incorrect" });
  }
  if (!validator.isAlphanumeric(req.body.username, ["fr-FR"])) {
    return res.status(400).json({
      erreur: "Le pseudo ne peux pas contenir de carateres speciaux.",
    });
  }
  if (req.body.password.length < 7) {
    return res.status(400).json({
      erreur: "Votre mot de passe doit faire plus de 6 caracteres.",
    });
  }
  next();
};

exports.validationUpdateUser = (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({erreur : "La response doit contenir les champs username, email, password."})
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ erreur: "Mail incorrect" });
  }
  if (!validator.isAlphanumeric(req.body.username, ["fr-FR"])) {
    return res.status(400).json({
      erreur: "Le pseudo ne peux pas contenir de carateres speciaux.",
    });
  }
  if (req.body.password.length < 7) {
    return res.status(400).json({
      erreur: "Votre mot de passe doit faire plus de 6 caracteres.",
    });
  }
  next();
}