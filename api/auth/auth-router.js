const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Helper = require("../helper-model");
const tokenCreator = require("./tokenCreator");
const {
  validatePermissions,
  validatePayload,
  validateUsernameUnique,
} = require("../middleware/validation-middleware");

router.post(
  "/register",
  validatePayload,
  validateUsernameUnique,
  (req, res) => {
    if (validatePermissions(req.User)) {
      const hash = bcrypt.hashSync(req.User.password, 9);
      req.User.password = hash;
      Helper.create(req.User)
        .then((usr) => {
          console.log(usr);
          res.status(201).json(usr);
        })
        .catch((error) => res.status(500).json("username taken"));
    } else {
      res.status(400).json({ message: "invalid credentials" });
    }
  }
);

router.post("/login", validatePayload, (req, res) => {
  if (validatePermissions(req.body)) {
    Helper.findBy({ username: req.body.username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          const token = tokenCreator(user);
          res.status(200).json({
            message: "welcome, " + user.username,
            token,
          });
        } else {
          res.status(401).json("invalid credentials");
        }
      })
      .catch((err) => res.status(500).json(err.message));
  } else {
    res.status(401).json("invalid credentials");
  }
});
module.exports = router;
