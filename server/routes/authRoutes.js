const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authControllers");

router.route("/login").post(login);

module.exports = router;
