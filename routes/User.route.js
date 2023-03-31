const express = require("express");
const UserRouter = express.Router();

const {
    inscription,
  } = require("../controllers/User.controller.js");


// Inscritpion route
UserRouter.post("/inscription", inscription);


module.exports = UserRouter;