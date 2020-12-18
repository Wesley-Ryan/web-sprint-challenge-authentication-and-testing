const jwt = require("jsonwebtoken");
const secret = "berries";
const Helper = require("../helper-model");

const validatePayload = (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.status(401).json("username and password required");
  } else {
    req.User = user;
    next();
  }
};

const validateUsernameUnique = async (req, res, next) => {
  try {
    const exsistingUser = Helper.findBy({ username: req.body.username });
    if (!exsistingUser.length) {
      next();
    } else {
      res.status(400).json("username taken");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const validator = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json("You must be logged in to view this page.");
  } else {
    console.log(token);
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        res.status(401).json(error.message);
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  }
};

const validatePermissions = (user) => {
  return Boolean(
    user.username && user.password && typeof user.password === "string"
  );
};

module.exports = {
  validator,
  validatePermissions,
  validatePayload,
  validateUsernameUnique,
};
