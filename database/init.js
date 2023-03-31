const mysql = require("mysql2");
require("dotenv").config();

const connexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

connexion.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("\x1b[1m", "\x1b[34m", "connected as id " + connexion.threadId);
});

connexion.query(
  "CREATE DATABASE IF NOT EXISTS Wikiplante",
  (error, result, field) => {
    if (error) throw error;

    console.log("base de donée Wikiplante crée");

    process.exit();
  }
);
