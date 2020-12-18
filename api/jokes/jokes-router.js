// do not make changes to this file
const router = require("express").Router();
const { validator } = require("../middleware/validation-middleware");
const jokes = require("./jokes-data");

router.get("/", validator, (req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;
