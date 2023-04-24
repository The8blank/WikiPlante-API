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
const router = require("./routes/index.js");
const db = require("./models/index.js");

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données, initialisations des tables
// Retirer force pour la production
db.sequelize
  .sync(/* { force: true } */)
  .then(() => {
    console.log("✅ Sync and Reset database.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:" + err.message);
  });

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());
app.use(morgan("short"));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use("/images", express.static("images"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middleware pour vérifier l'utilisateur avec JWT
app.use("*", checkUser);

// Routes
app.use("/wikiplante-api", router);

// Port d'écoute du serveur
const PORT = process.env.PORT || 8080;

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log("🚀Server started Successfully");
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.errors[0].message || "Erreur interne du serveur",
      details: err.details || null,
    },
  });
});

// Exportation de l'application Express
module.exports = app;
