/**
 * Point d'entrée de l'application.
 * @module server
 */
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { checkUser } = require("./middleware/auth.js");
const database = require("./database/Mysql.database.js");
const router = require("./routes");

const app = express();

// Connexion à la base de données, initialisations des tables
database.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync database");
});

// Parse le body de la requete en json
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(cookieParser());

// JWT
app.use("*", checkUser);


// Routes
app.use("/wikiplante-api", router);


// Error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
