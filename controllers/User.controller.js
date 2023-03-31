const database = require("../database/Mysql.database");
exports.inscription = (req, res, next) => {
   
  try {
    // Creation de L'objet user
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    database.user.create(user).then((user) => {
      console.log(user);
    });
  } catch (err) {
    res.status(404).json(err);
  }
};
