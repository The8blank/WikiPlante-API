const express = require("express");
const app = express();
const morgan = require("morgan");
const database = require("./database/Mysql.database.js");

const routeUser = require("./routes/User.route.js");

const port = process.env.PORT || 8080;

// connexion a la database et initialisation des models si inexistant.
database.sequelize
  .authenticate() // test de connexion à la db
  .then(() => {
    database.sequelize.sync({ force: true }); // Synchonisation de toutes les tables définit par les modèles
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(morgan("short"))

app.use("/wikiplante-api/user", routeUser);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
