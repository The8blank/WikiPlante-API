const express = require("express");
const UserRouter = express.Router();

const {
    inscription,
    connexion,
    deconnexion,

    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
  } = require("../controllers/User.controller.js");

const {
  requireAuth,
} = require("../middleware/auth.js")


// Inscritpion route
UserRouter.post("/inscription", inscription);
UserRouter.post("/connexion", connexion);
UserRouter.get("/deconnexion", deconnexion);
UserRouter.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).json({token:res.decodedToken/* res.locals.user.id */, result : true})
})

// user display "block"
UserRouter.get("/", getAllUsers);
UserRouter.get("/:id" /* id de l'user */, getOneUser);
UserRouter.put("/:id" /* id de l'user */, updateUser);
UserRouter.delete("/:id" /* id de l'user */, deleteUser);




module.exports = UserRouter;