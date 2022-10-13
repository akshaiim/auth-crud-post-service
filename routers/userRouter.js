const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { validateSchema } = require('../utils/schemaValidation');
const { schema } = require('./userInputSchema');
const router = express.Router();

// route to save user credentials in db
router.post("/register", validateSchema(schema.registerSchema) , registerUser);
router.post("/login", validateSchema(schema.loginSchema), loginUser);


module.exports = router;