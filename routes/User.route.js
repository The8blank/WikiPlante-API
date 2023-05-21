const express = require("express");
const UserRouter = express.Router();

const {
  inscription,
  connexion,
  adminConnexion,
  deconnexion,

  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getMe, 
} = require("../controllers/User.controller.js");

const {
  validationInscription,
  validationUpdateUser,
} = require("../validations/inputUserValidator.js");

const { requireAuth } = require("../middleware/auth.js");

// Inscritpion route
UserRouter.post("/inscription", validationInscription, inscription);
UserRouter.post("/adminconnexion", adminConnexion)
UserRouter.post("/connexion", connexion);
UserRouter.get("/deconnexion", deconnexion);

// user display "block"
UserRouter.get("/", getAllUsers);
UserRouter.get("/me", requireAuth, getMe)
UserRouter.get("/:id" /* id de l'user */, getOneUser);
UserRouter.put(
  "/:id" /* id de l'user */,
  requireAuth,
  validationUpdateUser,
  updateUser
);
UserRouter.delete(
  "/:id" /* id de l'user */,
  requireAuth,
  deleteUser
);

module.exports = UserRouter;
