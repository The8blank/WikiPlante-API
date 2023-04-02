const jwt = require("jsonwebtoken");
const dataBase = require("../database/Mysql.database");
require("dotenv").config({ path: "./config/.env" });

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
      user = await dataBase.user.findByPk(decodedToken.userId);

      if(!user) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        return next();
      }

      let newRecord = {
        id : user.id,
        username : user.username,
        isAdmin : user.isAdmin
      }

      res.locals.user = newRecord;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
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

  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(200).send({ result: false, message: "no token" });
      } else {
        res.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(200).send({ result: false, message: "no token" });
  }
};
