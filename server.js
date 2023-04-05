/**
 * Point d'entrée de l'application.
 * @module server
 */
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./models");
const { checkUser } = require("./middleware/auth.js");
const router = require("./routes");

const app = express();

// Connexion à la base de données, initialisations des tables
// Retirer force pour la production
database.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
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

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

module.exports = app;
