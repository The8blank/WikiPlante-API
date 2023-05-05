const express = require("express")
const router = express.Router()

const UserRouter = require("./User.route")
const PlanteRouter = require("./Plante.route")


// User route
router.use("/user", UserRouter) 

// Plante route
router.use("/plante", PlanteRouter)

module.exports = router;