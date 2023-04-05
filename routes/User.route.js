const express = require("express");
const UserRouter = express.Router();

const {
  inscription,
  connexion,
  deconnexion,

  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controllers/User.controller.js");

const {
  validationInscription,
  validationUpdateUser,
} = require("../middleware/inputUserValidator.js");

const { requireAuth, checkAuthor } = require("../middleware/auth.js");

// Inscritpion route
UserRouter.post("/inscription", validationInscription, inscription);
UserRouter.post("/connexion", connexion);
UserRouter.get("/deconnexion", deconnexion);

// user display "block"
UserRouter.get("/", getAllUsers);
UserRouter.get("/:id" /* id de l'user */, getOneUser);
UserRouter.put(
  "/:id" /* id de l'user */,
  requireAuth,
  checkAuthor,
  validationUpdateUser,
  updateUser
);
UserRouter.delete(
  "/:id" /* id de l'user */,
  requireAuth,
  checkAuthor,
  deleteUser
);

module.exports = UserRouter;
