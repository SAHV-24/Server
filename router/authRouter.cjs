const express = require("express");
const generateJWT = require("../auth/JWT/generateJWT.cjs");
const router = express.Router();
const { response } = require("express");
const validateCredentials = require("../middlewares/validateCredentials.cjs");
const authController = require("../controllers/authController.cjs");

router.post("/", [validateCredentials], authController.generateToken);

module.exports = router;
