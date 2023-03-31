const express = require("express")
const router = express.Router()

const UserRouter = require("./User.route")

// User route
router.use("/user", UserRouter) 

// Plante route

// Images routes

module.exports = router;