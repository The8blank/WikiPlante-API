const express = require("express");
const app = express();
const morgan = require("morgan");
const database = require("./database/Mysql.database.js");

const router = require("./routes");

const port = process.env.PORT || 8080;

// connexion a la database et initialisation des models si inexistant.
database.sequelize
  .authenticate() // test de connexion à la db
  .then(() => {
    database.sequelize.sync({ force: true }); // Synchonisation de toutes les tables définit par les modèles
  })
  .catch((err) => console.log(err));

// Parse le body de la requete en json
app.use(express.json());
app.use(morgan("short"))

// Router 
app.use("/wikiplante-api", router);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
