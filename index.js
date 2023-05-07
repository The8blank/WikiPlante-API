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
const dataPlante = require("./config/planteFormat.json");
require("dotenv").config();

// Initialisation de l'application Express
const app = express();

// Fonction qui essaie de se connecter à la base de données
const connectToDatabase = async () => {
  try {
    if (process.env.ENV === "dev") {
      await db.sequelize.sync({ force: true });
      console.log("✅ Connected to the database.");
    } else {
      await db.sequelize.sync();
      console.log("✅ Connected to the database.");
    }
  } catch (err) {
    console.log(`❌ Unable to connect to the database: ${err.message}`);
    // Attendre 5 secondes avant d'essayer de se reconnecter
    setTimeout(connectToDatabase, 5000);
  }
};

// Connexion à la base de données et creation d'un admin et de quelques plantes
connectToDatabase().then(async () => {
  const user = await db.Users.create({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_MAIL,
    isAdmin: true,
  });
  dataPlante.forEach(async (el) => {
    await user.createPlante({
      ...el,
    });
  });
});

// Middleware pour parser le corps de la requête en JSON
const corsOptions = {
  origin: process.env.ENV === "dev" ? "https://wikiplante-api-production.up.railway.app" : process.env.CLIENT_ORIGIN,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(morgan("short"));
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
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
const PORT = process.env.PORT || 3001;

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log("🚀Server started Successfully");
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.errors[0]?.message || "Erreur interne du serveur",
      details: err.details || null,
    },
  });
});

// Exportation de l'application Express
module.exports = app;
