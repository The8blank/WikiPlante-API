const express = require("express");
const router = express.Router();

const {
    inscription,
  } = require("../controllers/User.controller.js");

router.post("/inscription", inscription);


module.exports = router;