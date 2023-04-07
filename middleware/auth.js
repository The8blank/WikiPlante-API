const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config();

/**
 *@description Cette fonction middleware vérifie si l'utilisateur est authentifié à l'aide d'un cookie contenant un JSON Web Token (JWT).
 *Si le token est valide, l'utilisateur est stocké dans res.locals.user pour être utilisé par les middlewares ultérieurs.
 *Si le token est invalide ou expiré, le cookie est supprimé et l'utilisateur est redirigé vers la page d'accueil.
 *Si aucun token n'est présent dans les cookies, res.locals.user est défini à null.
 *@param {Object} req - L'objet de demande HTTP.
 *@param {Object} res - L'objet de réponse HTTP.
 *@param {Function} next - La fonction middleware suivante.
 */
module.exports.checkUser = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        return next();
      }

      let user;
      user = await db.Users.findByPk(decodedToken.userId);

      if (!user) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        return next();
      }

      let newRecord = user.purge();

      res.locals.user = newRecord;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
};

/**
 *@description Cette fonction middleware vérifie si l'utilisateur est admin ou si il est bien l'auteur de la ressource au quelle il veut
 * acceder en comparant l'id donnee en requete, et l'user stocker dans la res.
 * ATTENTION, ce middleware doit etre utilise apres checkUser.
 *Si le token est valide, next est appele
 *Si l'user ne correspond pas aux criteres, la requete est aborte avec un message d'erreur.
 *Si aucun token n'est présent dans les cookies, une réponse est renvoyée avec un message d'erreur indiquant l'absence de token.
 *@param {Object} req - L'objet de demande HTTP.
 *@param {Object} res - L'objet de réponse HTTP.
 *@param {Function} next - La fonction middleware suivante.
 */
module.exports.checkAuthor = async (req, res, next) => {
  let authorId;
  let userFromToken;

  authorId = req.params.id;
  userFromToken = res.locals.user;

  if (userFromToken.isAdmin) {
    return next();
  }

  if (authorId != userFromToken.id)
    return res.status(498).json({ message: "Requête invalide !" });

  next();
};

/**
 *@description Cette fonction middleware vérifie si l'utilisateur est authentifié en utilisant un cookie contenant un JSON Web Token (JWT).
 *Si le token est valide, res.decodedToken est défini pour permettre aux middlewares ultérieurs d'accéder aux informations du token.
 *Si le token est invalide ou expiré, une réponse est renvoyée avec un message d'erreur indiquant l'absence de token.
 *Si aucun token n'est présent dans les cookies, une réponse est renvoyée avec un message d'erreur indiquant l'absence de token.
 *@param {Object} req - L'objet de demande HTTP.
 *@param {Object} res - L'objet de réponse HTTP.
 *@param {Function} next - La fonction middleware suivante.
 */
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token)
    return res.status(498).json({ error: "Vous devez etre connecte !" });

  jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
    if (err)
      return res
        .status(200)
        .send({ result: false, message: "Vous devez etre connecte !" });

    next();
  });
};
