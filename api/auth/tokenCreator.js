const jwt = require("jsonwebtoken");

const secret = "berries";
function tokenCreator(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1000s",
  };
  return jwt.sign(payload, secret, options);
}

module.exports = tokenCreator;
